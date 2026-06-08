# Changelog

## 2026-06-08

- Updated MiniMax M3 pricing for input above 512k tokens: input 1.2 to 0.6, output 4.8 to 2.4, and prompt-cache read 0.24 to 0.12 USD per 1M tokens, as the official page now applies the permanent 50% discount to this tier.
- Left the MiniMax M3 input-at-or-below-512k tier unchanged (0.3/1.2/0.06); its discount is now noted as permanent.
- Rechecked OpenAI, Anthropic, Google, DeepSeek, xAI, Zhipu, Alibaba, ByteDance, Kimi, and Xiaomi against their official pricing pages; no other tracked price changes were applied.
- Updated the default USD/CNY rate to 6.793402 from ExchangeRate-API.

## 2026-06-01

- Added a new pricing snapshot for MiniMax M3 with 1M context support.
- Replaced MiniMax M2.7 and M2.7 Highspeed in the latest snapshot.
- Added MiniMax M3 pricing tiers for input at or below 512k tokens and input above 512k tokens.
- Updated DeepSeek V4 Pro notes from promotion pricing to official post-promotion pricing; token prices are unchanged.
- Expanded Doubao Seed 2.0 Pro, Lite, and Mini into official input-length pricing tiers.
- Updated the default USD/CNY rate to 6.772555 from ExchangeRate-API.

## 2026-05-29

- Added a new pricing snapshot for Claude Opus 4.8 and kept the 2026-05-28 snapshot with Claude Opus 4.7.
- Rechecked tracked standard token pricing sources; no other tracked price changes were applied.
- Updated the default USD/CNY rate to 6.791862 from ExchangeRate-API.

## 2026-05-28

- Refreshed the active pricing snapshot date and source access dates.
- Updated the default USD/CNY rate to 6.793906 from ExchangeRate-API.
- Filled the missing GPT-5.5 Pro long-context pricing rows from the OpenAI pricing page.

## 2026-05-27

- Initial dataset with date-versioned pricing records.
- Added structured pricing items for input, output, cache read, cache write, context tiers, and provider-specific currencies.
- Added official source URLs for each model price record.
