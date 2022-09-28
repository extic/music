import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from "child_process";
import { randomUUID } from 'crypto';
import { DOMParser } from "@xmldom/xmldom";
import { BrowserWindow } from 'electron';

const museScore = "C:/programming/MuseScore/msvc.install_x64/bin/MuseScore3.exe"
const styleSheetFile = "C:/programming/music-old/web-server/Styles.mss"

const PROGRESS_CREATE_TEMP_FOLDER = 10;
const PROGRESS_COPY_TO_TEMP = 20;
const PROGRESS_APPLY_STYLE = 40;
const PROGRESS_CONVERT_TO_IMAGES = 50;
const PROGRESS_CONVERT_TO_XML = 60;
const PROGRESS_CREATE_DESCRIPTOR = 70;
const PROGRESS_COPY_TO_DATA_FILES = 80;
const PROGRESS_DELETE_TEMP_FOLDER = 90;
const PROGRESS_DONE = 100;

function createTempFolder(win: BrowserWindow) {
  win.webContents.send("import-progress", { progress: PROGRESS_CREATE_TEMP_FOLDER, status: "Creating temporary folder" });

  const folder = fs.mkdtempSync(path.join(os.tmpdir(), "extremely-"));
  console.debug(`Created temp folder: ${folder}`);
  return folder;
}

function deleteTempFolder(win: BrowserWindow, folder: string) {
  win.webContents.send("import-progress", { progress: PROGRESS_DELETE_TEMP_FOLDER, status: "Deleting temporary folder" });

  console.debug(`Deleting temp folder`);
  fs.rmSync(folder, { recursive: true });
}

function copyToTempFolder(win: BrowserWindow, fileName: string, folder: string): string {
  win.webContents.send("import-progress", { progress: PROGRESS_COPY_TO_TEMP, status: "Copying files to temporary folder" });

  const file = path.basename(fileName);
  console.debug(`Copying ${file} to temp folder`);
  fs.copyFileSync(fileName, `${folder}/${file}`);
  return file;
}

function applyStyle(win: BrowserWindow, folder: string, fileName: string) {
  win.webContents.send("import-progress", { progress: PROGRESS_APPLY_STYLE, status: "Applying music sheet style" });

  console.debug(`Applying Style to ${fileName}`)

  const fullFileName = `"${folder}/${fileName}"`

  const cmd = `${museScore} --force ${fullFileName} -S ${styleSheetFile} -o ${fullFileName}`
  runCommand(cmd);
}

function convertToImages(win: BrowserWindow, folder: string, fileName: string) {
  win.webContents.send("import-progress", { progress: PROGRESS_CONVERT_TO_IMAGES, status: "Converting music sheet to images" });

  console.debug(`Exporting images from ${fileName}`)

  const file = `${folder}/${fileName}`
  const styledFileName = `"${file}"`
  const pngFileName = `"${folder}/${path.parse(file).name}.png"`;

  const cmd = `${museScore} --force ${styledFileName} -o ${pngFileName}`
  runCommand(cmd)
}

function convertToXml(win: BrowserWindow, folder: string, fileName: string) {
  win.webContents.send("import-progress", { progress: PROGRESS_CONVERT_TO_XML, status: "Converting music sheet to musicxml" });

  console.debug(`Exporting musicxml from ${fileName}`)

  const file = `${folder}/${fileName}`
  const styledFileName = `"${file}"`
  const xmlFileName = `"${folder}/${path.parse(file).name}.musicxml"`;

  const cmd = `${museScore} --force ${styledFileName} -o ${xmlFileName}`
  runCommand(cmd)
}

function createDescriptor(win: BrowserWindow, folder: string, fileName: string) {
  win.webContents.send("import-progress", { progress: PROGRESS_CREATE_DESCRIPTOR, status: "Creating song descriptor" });

  console.debug("Creating info.json")

  const file = `${folder}/${fileName}`
  const xmlFileName = `${folder}/${path.parse(file).name}.musicxml`;

  const content = fs.readFileSync(xmlFileName).toString();
  const scorePartwise = new DOMParser().parseFromString(content, 'text/xml').documentElement;

  const name = parseName(scorePartwise, fileName);
  const author = parseAuthor(scorePartwise);

  const info = {
    id: randomUUID(),
    name,
    author,
    favorite: false,
  };

  fs.writeFileSync(`${folder}/info.json`, JSON.stringify(info, null, 2));
}

function parseName(scorePartwise: Element, filename: string): string {
  const work = scorePartwise.getElementsByTagName('work');
  if (work.length > 0) {
    const workTitle = work[0].getElementsByTagName('work-title');
    if (workTitle.length > 0) {
      return workTitle[0].firstChild.nodeValue;
    }
  }

  const credits = scorePartwise.getElementsByTagName('credit');
  for (let i = 0; i < credits.length; i++) {
    const creditType = credits[i].getElementsByTagName('credit-type')[0].firstChild.nodeValue;
    if (creditType === "title") {
      return credits[i].getElementsByTagName('credit-words')[0].firstChild.nodeValue;
    }
  }

  return filename;
}

function parseAuthor(scorePartwise: Element): string {
  const identification = scorePartwise.getElementsByTagName('identification');
  if (identification.length > 0) {
    const creator = identification[0].getElementsByTagName('creator');
    if (creator.length > 0) {
      console.log(creator, creator.length);
      for (let i = 0; i < creator.length; i++) {
        const author = creator[i].firstChild.nodeValue;
        if (author) {
          return author;
        }
      }
    }
  }

  const credits = scorePartwise.getElementsByTagName('credit');
  for (let i = 0; i < credits.length; i++) {
    const creditTypeElement = credits[i].getElementsByTagName('credit-type')[0];
    if (creditTypeElement) {
      const creditType = creditTypeElement.firstChild.nodeValue;
      if (creditType === "composer") {
        return credits[i].getElementsByTagName('credit-words')[0].firstChild.nodeValue;
      }
    }
  }

  return "";
}

function copyToDataFiles(win: BrowserWindow, folder: string, fileName: string, dataFilesFolder: string) {
  win.webContents.send("import-progress", { progress: PROGRESS_COPY_TO_DATA_FILES, status: "Copy to data files" });

  const folderName = path.parse(`${folder}/${fileName}`).name
    .replaceAll(" ", "-")
    .replaceAll(/\-+/g, "-")
    .toLowerCase();

  const destFolder = `${dataFilesFolder}/${folderName}`
  console.debug(`Copying all files to data-files folder ${destFolder}`);

  fs.mkdirSync(destFolder, { recursive: true });

  const files = fs.readdirSync(folder);
  files.forEach((file) => {
    const srcFile = `${folder}/${file}`;
    const destFile = `${destFolder}/${file}`
    console.debug(`  -- Copying ${file} to ${destFile}`)
    fs.copyFileSync(srcFile, destFile);
  });
}

async function runCommand(cmd: string): Promise<string> {
  console.debug(`  -- Running command: ${cmd}`);
  const output = execSync(cmd);
  console.log(output.toString());

  return "ok";
}

export function importFile(win: BrowserWindow, fileName: string, dataFilesFolder: string) {
  const folder = createTempFolder(win);
  try {
    const destFile = copyToTempFolder(win, fileName, folder);
    applyStyle(win, folder, destFile);
    convertToImages(win, folder, destFile);
    convertToXml(win, folder, destFile);
    createDescriptor(win, folder, destFile);
    copyToDataFiles(win, folder, destFile, dataFilesFolder)
  } finally {
    deleteTempFolder(win, folder);

    win.webContents.send("import-progress", { progress: PROGRESS_DONE, status: "Done" });
  }
}
