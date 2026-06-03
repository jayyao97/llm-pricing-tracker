import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const root = new URL("..", import.meta.url);
const dataDir = new URL("data/", root);
const snapshotsDir = new URL("snapshots/", dataDir);

const meta = JSON.parse(await readFile(new URL("meta.json", dataDir), "utf8"));
const versions = [];

for (const file of await snapshotFiles(snapshotsDir)) {
  const version = JSON.parse(await readFile(file, "utf8"));
  const expectedFile = `${version.date}.json`;
  if (basename(file.pathname) !== expectedFile) {
    throw new Error(`Snapshot filename must match version.date: ${file.pathname}`);
  }
  versions.push(version);
}

versions.sort((a, b) => b.date.localeCompare(a.date));

await writeFile(
  new URL("prices.json", dataDir),
  `${JSON.stringify({ ...meta, versions }, null, 2)}\n`,
);

async function snapshotFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir.pathname, entry.name);
    if (entry.isDirectory()) {
      files.push(...await snapshotFiles(new URL(`${path}/`, "file://")));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(new URL(path, "file://"));
    }
  }

  return files;
}
