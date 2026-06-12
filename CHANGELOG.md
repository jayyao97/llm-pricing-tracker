# Changelog

## 2026-06-12

- Added Kimi K2.7 Code (kimi-k2.7-code), the newest model in Kimi's K2 line, generally available on the Kimi platform: input cache miss 0.95, input cache hit 0.19, output 4 USD per 1M tokens, 262k context, text/image/video input.
- Left Kimi K2.6 in place; it is still offered on the official pricing docs.
- Rechecked OpenAI, Anthropic, Google, DeepSeek, xAI, Zhipu, Alibaba, ByteDance, MiniMax, and Xiaomi against their official pricing pages; no other tracked price or lineup changes.
- Updated the default USD/CNY rate to 6.787632 from ExchangeRate-API.

## 2026-06-10

- Added Claude Fable 5 (claude-fable-5), Anthropic's new most-capable widely released model, generally available on the Claude API from 2026-06-09: input 10, 5m cache write 12.5, 1h cache write 20, cache hit 1, output 50 USD per 1M tokens, 1M context, text+image input.
- Did not track Claude Mythos 5, which Anthropic announced the same day but offers only as invitation-only (Project Glasswing, not generally available).
- Rechecked OpenAI, Google, DeepSeek, xAI, Zhipu, Alibaba, ByteDance, Kimi, MiniMax, and Xiaomi against their official pricing pages; no other tracked price or lineup changes.
- Updated the default USD/CNY rate to 6.785295 from ExchangeRate-API.

## 2026-06-09

- Corrected MiMo V2.5 input modalities to text, image, audio, and video; Xiaomi's official documentation describes V2.5 as natively multimodal (the successor to MiMo-V2-Omni).
- Left MiMo V2.5 Pro unchanged as text-only, matching its role as the long-range reasoning model.
- No price changes; this is a metadata correction only.

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
