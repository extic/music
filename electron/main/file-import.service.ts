import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from "child_process";
import { randomUUID } from 'crypto';
import { DOMParser } from "@xmldom/xmldom";

const museScore = "C:/programming/MuseScore/msvc.install_x64/bin/MuseScore3.exe"
const styleSheetFile = "C:/programming/music-old/web-server/Styles.mss"

function createTempFolder() {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), "extremely-"));
  console.debug(`Created temp folder: ${folder}`);
  return folder;
}

function deleteTempFolder(folder: string) {
  console.debug(`Deleting temp folder`);
  fs.rmSync(folder, { recursive: true });
}

function copyToTempFolder(fileName: string, folder: string): string {
  const file = path.basename(fileName);
  console.debug(`Copying ${file} to temp folder`);
  fs.copyFileSync(fileName, `${folder}/${file}`);
  return file;
}

function applyStyle(folder: string, fileName: string) {
  console.debug(`Applying Style to ${fileName}`)

  const fullFileName = `"${folder}/${fileName}"`

  const cmd = `${museScore} --force ${fullFileName} -S ${styleSheetFile} -o ${fullFileName}`
  runCommand(cmd);
}

function convertToImages(folder: string, fileName: string) {
  console.debug(`Exporting images from ${fileName}`)

  const file = `${folder}/${fileName}`
  const styledFileName = `"${file}"`
  const pngFileName = `"${folder}/${path.parse(file).name}.png"`;

  const cmd = `${museScore} --force ${styledFileName} -o ${pngFileName}`
  runCommand(cmd)
}

function convertToXml(folder: string, fileName: string) {
  console.debug(`Exporting musicxml from ${fileName}`)

  const file = `${folder}/${fileName}`
  const styledFileName = `"${file}"`
  const xmlFileName = `"${folder}/${path.parse(file).name}.musicxml"`;

  const cmd = `${museScore} --force ${styledFileName} -o ${xmlFileName}`
  runCommand(cmd)
}

function createDescriptor(folder: string, fileName: string) {
  console.debug("Creating info.json")

  const file = `${folder}/${fileName}`
  const xmlFileName = `${folder}/${path.parse(file).name}.musicxml`;

  const content = fs.readFileSync(xmlFileName).toString();
  const scorePartwise = new DOMParser().parseFromString(content, 'text/xml').documentElement;

  const work = scorePartwise.getElementsByTagName('work')[0];
  const workTitle = work.getElementsByTagName('work-title');
  const name = workTitle[0].firstChild.nodeValue;

  const identification = scorePartwise.getElementsByTagName('identification')[0];
  const creator = identification.getElementsByTagName('creator');
  let author = '';
  for (let index = 0; index < creator.length; index++) {
    author = creator[index].firstChild.nodeValue;
    if (author) {
      break;
    }
  }

  const info = {
    id: randomUUID(),
    name,
    author,
    favorite: false,
  };

  fs.writeFileSync(`${folder}/info.json`, JSON.stringify(info, null, 2));
}

function copyToDataFiles(folder: string, fileName: string, dataFilesFolder: string) {
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

export function importFile(fileName: string, dataFilesFolder: string) {
  const folder = createTempFolder();
  try {
    const destFile = copyToTempFolder(fileName, folder);
    applyStyle(folder, destFile);
    convertToImages(folder, destFile);
    convertToXml(folder, destFile);
    createDescriptor(folder, destFile);
    copyToDataFiles(folder, destFile, dataFilesFolder)

  } finally {
    deleteTempFolder(folder);
  }
}
