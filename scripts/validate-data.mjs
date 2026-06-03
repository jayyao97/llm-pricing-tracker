import { readFile } from "node:fs/promises";

const data = JSON.parse(await readFile(new URL("../data/prices.json", import.meta.url), "utf8"));

assert(data.schemaVersion === 4, "schemaVersion must be 4");
assertCurrency(data.currency, "currency");
if (data.exchangeRate !== undefined) {
  assert(typeof data.exchangeRate === "object" && data.exchangeRate !== null, "exchangeRate must be an object");
  assert(data.exchangeRate.pair === "USD/CNY", "exchangeRate.pair must be USD/CNY");
  assertPrice(data.exchangeRate.usdCny, "exchangeRate.usdCny");
  assertUrl(data.exchangeRate.source, "exchangeRate.source");
  assertDate(data.exchangeRate.updatedAt, "exchangeRate.updatedAt");
}
assert(Array.isArray(data.versions) && data.versions.length > 0, "versions must not be empty");

const dates = new Set();
for (const version of data.versions) {
  assertDate(version.date, "version.date");
  assert(!dates.has(version.date), `duplicate version date: ${version.date}`);
  dates.add(version.date);
  assertDate(version.effectiveDate, "version.effectiveDate");
  assert(typeof version.notes === "string" && version.notes.length > 0, `notes required for ${version.date}`);
  assert(Array.isArray(version.sources) && version.sources.length > 0, `sources required for ${version.date}`);
  assert(Array.isArray(version.models) && version.models.length > 0, `models required for ${version.date}`);

  for (const source of version.sources) {
    assert(typeof source.provider === "string" && source.provider.length > 0, "source.provider required");
    assertUrl(source.url, `source.url for ${source.provider}`);
    assertDate(source.accessedAt, `source.accessedAt for ${source.provider}`);
  }

  const ids = new Set();
  for (const model of version.models) {
    assert(typeof model.provider === "string" && model.provider.length > 0, "model.provider required");
    assert(typeof model.id === "string" && model.id.length > 0, "model.id required");
    assert(!ids.has(model.id), `duplicate model id in ${version.date}: ${model.id}`);
    ids.add(model.id);
    assert(typeof model.name === "string" && model.name.length > 0, `model.name required for ${model.id}`);
    assert(model.contextWindow === null || typeof model.contextWindow === "string", `invalid contextWindow for ${model.id}`);
    assertModalities(model.modalities, `modalities for ${model.id}`);
    assert(Array.isArray(model.pricingItems) && model.pricingItems.length > 0, `pricingItems required for ${model.id}`);
    for (const item of model.pricingItems) {
      assert(typeof item.category === "string" && item.category.length > 0, `pricingItems.category required for ${model.id}`);
      assert(typeof item.label === "string" && item.label.length > 0, `pricingItems.label required for ${model.id}`);
      assertPrice(item.price, `pricingItems.price for ${model.id}`);
      if (item.currency !== undefined) {
        assertCurrency(item.currency, `pricingItems.currency for ${model.id}`);
      }
      assert(typeof item.unit === "string" && item.unit.length > 0, `pricingItems.unit required for ${model.id}`);
      assert(typeof item.conditions === "object" && item.conditions !== null, `pricingItems.conditions required for ${model.id}`);
      assert(item.conditions.contextRange === null || typeof item.conditions.contextRange === "string", `conditions.contextRange invalid for ${model.id}`);
      assert(item.conditions.cacheDuration === null || typeof item.conditions.cacheDuration === "string", `conditions.cacheDuration invalid for ${model.id}`);
      assert(item.conditions.note === null || typeof item.conditions.note === "string", `conditions.note invalid for ${model.id}`);
    }
    assertUrl(model.source?.url, `source.url for ${model.id}`);
  }
}

console.log(`Validated ${data.versions.length} version(s).`);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertDate(value, label) {
  assert(typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value), `${label} must be YYYY-MM-DD`);
}

function assertUrl(value, label) {
  assert(typeof value === "string" && /^https:\/\/.+/.test(value), `${label} must be an https URL`);
}

function assertPrice(value, label) {
  const valid = value === null || (typeof value === "number" && value >= 0);
  assert(valid, `${label} must be null or a non-negative number`);
}

function assertCurrency(value, label) {
  assert(typeof value === "string" && /^[A-Z]{3}$/.test(value), `${label} must be an ISO currency code`);
}

function assertModalities(value, label) {
  const allowed = new Set(["text", "image", "audio", "video", "embedding", "speech"]);
  const allowedDocuments = new Set(["pdf"]);
  assert(typeof value === "object" && value !== null, `${label} must be an object`);
  assert(Array.isArray(value.input) && value.input.length > 0, `${label}.input must not be empty`);
  assert(Array.isArray(value.output) && value.output.length > 0, `${label}.output must not be empty`);
  for (const modality of [...value.input, ...value.output]) {
    assert(allowed.has(modality), `${label} has unsupported modality: ${modality}`);
  }
  if (value.documents !== undefined) {
    assert(Array.isArray(value.documents), `${label}.documents must be an array`);
    for (const documentType of value.documents) {
      assert(allowedDocuments.has(documentType), `${label} has unsupported document input: ${documentType}`);
    }
  }
}
