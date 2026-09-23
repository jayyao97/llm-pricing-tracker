import assert from "node:assert/strict";
import { readFile, mkdtemp, mkdir, copyFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const source = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
const context = vm.createContext({
  document: { querySelector: () => null, querySelectorAll: () => [] },
});
vm.runInContext(source.slice(0, source.lastIndexOf("init().catch")), context);
const select = context.comparisonPresetModels;
const snapshot = async (date) => JSON.parse(await readFile(new URL(`../data/snapshots/2026/09/${date}.json`, import.meta.url), "utf8"));
const latest = await snapshot("2026-09-23");
const previous = await snapshot("2026-09-22");
const ids = (version, group) => Array.from(select(version, group), (model) => model.id);

assert.deepEqual(ids(latest, "nonChinaBig"), ["gpt-6-astra", "claude-fable-5-1"]);
assert.deepEqual(ids(latest, "nonChinaDaily"), [
  "gpt-6-sol", "muse-spark-1.1", "claude-opus-5-5", "gemini-3.1-pro-preview", "grok-4.7",
]);
assert.deepEqual(ids(previous, "nonChinaDaily"), [
  "gpt-5.6-sol", "muse-spark-1.1", "claude-opus-5", "gemini-3.1-pro-preview", "grok-4.7",
]);
assert.deepEqual(ids(latest, "chinaBig"), [
  "deepseek-v4-pro", "glm-5.3", "qwen3.8-max", "doubao-seed-2.1-pro",
  "mimo-v2.6-pro", "kimi-k3", "minimax-m3", "longcat-2.0",
]);
assert.deepEqual(ids(latest, "chinaLite"), [
  "deepseek-v4.1-flash", "glm-5.3-flash", "qwen3.8-flash", "doubao-seed-2.1-lite", "mimo-v2.6-flash",
]);
assert(!latest.models.some((model) => model.id === "glm-5.1"));
assert(previous.models.some((model) => model.id === "glm-5.1"));

// New generations are selected from snapshot membership, regardless of name or price.
const next = structuredClone(latest);
next.models.find((model) => model.id === "claude-fable-5-1").comparisonGroup = null;
next.models.push({ id: "new-frontier-model", provider: "Anthropic", comparisonGroup: "nonChinaBig", pricingItems: [] });
assert.deepEqual(ids(next, "nonChinaBig"), ["gpt-6-astra", "new-frontier-model"]);
assert.deepEqual(ids(latest, "nonChinaBig"), ["gpt-6-astra", "claude-fable-5-1"]);
assert.deepEqual(ids({ models: [{ id: "historical-model" }] }, "nonChinaBig"), []);

// Exercise the actual validator against isolated invalid datasets.
const temp = await mkdtemp(join(tmpdir(), "pricing-validation-"));
try {
  await mkdir(join(temp, "scripts"));
  await mkdir(join(temp, "data"));
  await copyFile(new URL("./validate-data.mjs", import.meta.url), join(temp, "scripts/validate-data.mjs"));
  const data = JSON.parse(await readFile(new URL("../data/meta.json", import.meta.url), "utf8"));
  data.versions = [structuredClone(latest)];
  const validate = () => execFileSync(process.execPath, [join(temp, "scripts/validate-data.mjs")], { stdio: "pipe" });
  const write = () => writeFile(join(temp, "data/prices.json"), JSON.stringify(data));
  await write();
  validate();
  delete data.versions[0].models[0].comparisonGroup;
  await write();
  assert.throws(validate, /comparisonGroup required/);
  data.versions[0].models[0].comparisonGroup = "nonChinaBig";
  data.versions[0].models[1].comparisonGroup = "nonChinaBig";
  await write();
  assert.throws(validate, /multiple OpenAI models/);
} finally {
  await rm(temp, { recursive: true, force: true });
}
console.log("Comparison preset tests passed.");
