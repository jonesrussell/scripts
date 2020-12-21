#!/usr/bin/env node

import { readFileSync } from "fs";
import program, { on } from "commander";
import { Validator } from "jsonschema";
import globalModules from "global-modules";
import { Table } from "console-table-printer";

// Set the program version
program.version("1.0.0");

const loadFile = (filename: string) => {
  try {
    return readFileSync(filename, "utf-8");
  } catch (err) {
    throw console.error(`Cannot open ${filename}`);
  }
};

const cwd: string = process.cwd();

/**
 * Open package.json in current directory
 */
const filename = `${cwd}/package.json`;
// Convert the file contents to a JSON object
const data = JSON.parse(loadFile(filename));

const schemaFilename = `${globalModules}/@jonesrussell42/scripts/package.schema.json`;
const fileSchema = loadFile(schemaFilename);

// Convert the fileSchema contents to a JSON object
const schema = JSON.parse(fileSchema);

// Validate package.json against schema
const v = new Validator();
const validated = v.validate(data, schema);

if (!validated.valid) {
  throw console.error("Invalid package.json");
}

/**
 * Show scripts
 */
let scripts = [];
for (let [name] of Object.entries(data?.scripts)) {
  scripts.push({ Name: name });
}

function scripsTable({ title, scripts }: { title: string; scripts: any; }) {
  const p = new Table({
    title,
    columns: [{ name: "Name" }],
  });
  p.addRows(scripts);

  return p.render();
}

console.log(`${scripsTable({ title: 'scripts', scripts })}`);

process.exit(0);
