# Contributing

Contributions for models and pricing history are welcome.

When submitting data:

- Add a new dated snapshot in `versions` for each pricing change. Do not overwrite old dates.
- Every price must include an official source URL.
- The default unit is USD / 1M tokens. If a price uses another unit, make that explicit in the field.
- Run `node scripts/validate-data.mjs` before submitting.

If an official page only provides tiered pricing, record the original rule as a string first to avoid incorrect normalization.
