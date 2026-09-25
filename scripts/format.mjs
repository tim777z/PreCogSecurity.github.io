import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");
const ignoredDirectories = new Set([".git", "coverage", "dist", "node_modules"]);
const supportedNames = new Set([".editorconfig", ".gitignore", ".nvmrc"]);
const supportedExtensions = new Set([".css", ".html", ".json", ".md", ".mjs", ".yaml", ".yml"]);

function listTextFiles(directory) {
    const files = [];

    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
            continue;
        }

        const entryPath = path.join(directory, entry.name);
        if (entry.isFile() && (supportedNames.has(entry.name) || supportedExtensions.has(path.extname(entry.name).toLowerCase()))) {
            files.push(entryPath);
        } else if (entry.isDirectory()) {
            files.push(...listTextFiles(entryPath));
        }
    }

    return files.sort();
}

function normalize(source) {
    let normalized = source.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "");
    if (normalized.length > 0 && !normalized.endsWith("\n")) {
        normalized += "\n";
    }
    return normalized;
}

const problems = [];
for (const file of listTextFiles(root)) {
    const relativePath = path.relative(root, file).split(path.sep).join("/");
    const source = readFileSync(file, "utf8");
    const normalized = normalize(source);
    if (source !== normalized) {
        problems.push(relativePath);
        if (!checkOnly) {
            writeFileSync(file, normalized, "utf8");
        }
    }
}

if (problems.length > 0) {
    const action = checkOnly ? "run npm run format" : "formatted";
    console.error(`Formatting found ${problems.length} file(s) needing changes (${action}):`);
    for (const file of problems) {
        console.error(`- ${file}`);
    }
    if (checkOnly) {
        process.exitCode = 1;
    }
} else {
    console.log(checkOnly ? "Formatting check passed." : "Formatting complete.");
}
