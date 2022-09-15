import fs from "fs";

export type Song = {
  id: string;
  name: string;
  author: string;
  folder: string;
  favorite: boolean;
};

export function loadSongs(path: string): Song[] {
  const folders = fs.readdirSync(path);
  return folders
    .filter((it) => fs.existsSync(`${path}/${it}/info.json`))
    .map((it) => loadSongJson(path, it));
}

function loadSongJson(path: string, folder: string): Song {
  const filename = `${path}/${folder}/info.json`;
  console.log(`Loading ${filename}`);
  const content = JSON.parse(fs.readFileSync(filename).toString());
  return {
    id: content.id,
    name: content.name,
    author: content.author,
    folder: `${path}/${folder}`,
    favorite: content.favorite,
  };
}

export function saveSongJson(song: Song) {
  const filename = `${song.folder}/info.json`;
  const content: any = { ...song };
  delete content.folder;
  fs.writeFileSync(filename, JSON.stringify(content, null, 2))
}
