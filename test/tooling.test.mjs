import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";
import { repositoryRoot } from "../scripts/site-validator.mjs";

async function readProjectFile(relativePath) {
    return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

test("package metadata, lockfile, and CI commands stay aligned", async () => {
    const manifest = JSON.parse(await readProjectFile("package.json"));
    const lockfile = JSON.parse(await readProjectFile("package-lock.json"));
    const workflow = await readProjectFile(".github/workflows/ci.yml");
    const nodeVersion = (await readProjectFile(".nvmrc")).trim();

    assert.equal(lockfile.name, manifest.name);
    assert.equal(lockfile.version, manifest.version);
    assert.equal(lockfile.lockfileVersion, 3);
    assert.deepEqual(lockfile.packages[""].engines, manifest.engines);
    assert.match(nodeVersion, /^\d+\.\d+\.\d+$/);
    assert.match(workflow, /npm ci/);
    assert.match(workflow, /npm run lint/);
    assert.match(workflow, /npm test/);
    assert.match(workflow, /npm run build/);
});
