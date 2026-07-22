# Changelog

## 2026-07-22

- Replaced Google Gemini 3.5 Flash with the generally available Gemini 3.6 Flash; input, cache-read, and cache-storage prices are unchanged, while output pricing decreased from 9.00 to 7.50 USD per 1M tokens.
- Rechecked all other requested providers against their official pricing pages; no other tracked price or curated lineup changes.
- Updated the default USD/CNY rate to 6.778084 from ExchangeRate-API.

## 2026-07-19

- Reduced xAI Grok 4.5 cached-input pricing from 0.50 to 0.30 USD per 1M tokens through 200k input tokens and from 1.00 to 0.60 USD above 200k tokens; input and output prices are unchanged.
- Rechecked all other requested providers against their official pricing pages; no other tracked price or curated lineup changes. Kimi's pricing index still lists Kimi K3, K2.7 Code, and K2.6, but its fetched per-model pages did not expose pricing table rows, so those prices were carried forward unchanged.
- Updated the default USD/CNY rate to 6.784582 from ExchangeRate-API.

## 2026-07-17

- Added Kimi K3 (kimi-k3), Kimi's new flagship model for long-horizon coding and knowledge work: 1,048,576-token context, text/image/video input, input cache miss 3, cache hit 0.30, and output 15 USD per 1M tokens.
- Kept Kimi K2.6 and K2.7 Code; both remain available on the official pricing index with unchanged prices.
- Rechecked all other tracked providers against their official pricing pages; no other tracked price or lineup changes. Meta's Model API documentation was region-blocked, so its values were carried forward unchanged.
- Updated the default USD/CNY rate to 6.778295 from ExchangeRate-API.

## 2026-07-16

- Applied Alibaba Qwen3.7 Max's official limited-time 50% discount: input 1.25 and output 3.75 USD per 1M tokens (list prices: 2.5 / 7.5).
- Applied Alibaba Qwen3.7 Plus's official limited-time 20% discount: input/output 0.32/1.28 USD through 256k tokens and 0.96/3.84 USD above 256k through 1M tokens (list prices: 0.4/1.6 and 1.2/4.8).
- Rechecked all other tracked provider prices and lineups against their official pages; no other changes.
- Updated the default USD/CNY rate to 6.782028 from ExchangeRate-API.

## 2026-07-15

- Added xAI Grok 4.5 higher-context pricing for requests above 200k tokens: input 4, cache hit 1, and output 12 USD per 1M tokens. The existing input 2, cache hit 0.50, and output 6 USD rates now apply through 200k tokens.
- Rechecked OpenAI, Anthropic, Google, DeepSeek, Zhipu, Alibaba, ByteDance, Kimi, MiniMax, and Xiaomi against their official pricing pages; no tracked price or lineup changes.

## 2026-07-10

- Replaced OpenAI GPT-5.5 with the GPT-5.6 standard family now listed on the official OpenAI pricing and models pages. All three GPT-5.6 standard models have a 1.05M context window:
  - GPT-5.6 Sol (gpt-5.6-sol): short-context input 5, cache hit 0.50, cache write 6.25, output 30 USD per 1M tokens; long-context input 10, cache hit 1, cache write 12.50, output 45 USD per 1M tokens.
  - GPT-5.6 Terra (gpt-5.6-terra): short-context input 2.5, cache hit 0.25, cache write 3.125, output 15 USD per 1M tokens; long-context input 5, cache hit 0.50, cache write 6.25, output 22.5 USD per 1M tokens.
  - GPT-5.6 Luna (gpt-5.6-luna): short-context input 1, cache hit 0.10, cache write 1.25, output 6 USD per 1M tokens; long-context input 2, cache hit 0.20, cache write 2.5, output 9 USD per 1M tokens.
- Added Meta Muse Spark 1.1 (muse-spark-1.1), now available in public preview on Meta Model API with a 1,048,576-token context window: input 1.25, cached input 0.15, and output 4.25 USD per 1M tokens.
- Rechecked Anthropic, Google, DeepSeek, xAI, Zhipu, Alibaba, ByteDance, Kimi, MiniMax, Xiaomi, and LongCat against their official pricing pages; no other tracked price or lineup changes.
- Updated the default USD/CNY rate to 6.810223 from ExchangeRate-API.

## 2026-07-09

- Replaced xAI Grok 4.3 with Grok 4.5 (grok-4.5), now listed on the official xAI pricing page as the newest Grok flagship: 500k context, input 2, cache hit 0.50, output 6 USD per 1M tokens.
- Rechecked OpenAI, Anthropic, Google, DeepSeek, Zhipu, Alibaba, ByteDance, Kimi, MiniMax, Xiaomi, and LongCat against their official pricing pages; no other tracked price or lineup changes.
- Updated the default USD/CNY rate to 6.801883 from ExchangeRate-API.

## 2026-07-07

- Added Zhipu GLM-5V-Turbo (glm-5v-turbo), a new multimodal GLM-5 Turbo variant listed on the official BigModel pricing page: text/image/video input, 200k context, input 5/7 CNY, cache hit 1.2/1.8 CNY, and output 22/26 CNY per 1M tokens for input <32k / >=32k.
- Rechecked OpenAI, Anthropic, Google, DeepSeek, xAI, Alibaba, ByteDance, Kimi, MiniMax, Xiaomi, and LongCat against their official pricing pages; no other tracked price or lineup changes.
- Updated the default USD/CNY rate to 6.785482 from ExchangeRate-API.

## 2026-07-02

- Added Zhipu GLM-5-Turbo cache-hit pricing from the official BigModel pay-as-you-go table: 1.2 CNY per 1M tokens for input <32k and 1.8 CNY per 1M tokens for input >=32k. Input and output prices are unchanged.
- Rechecked OpenAI, Anthropic, Google, DeepSeek, xAI, Alibaba, ByteDance, Kimi, MiniMax, Xiaomi, and LongCat against their official pricing pages; no tracked price or lineup changes.
- Updated the default USD/CNY rate to 6.796501 from ExchangeRate-API.

## 2026-07-01

- Replaced Claude Sonnet 4.6 with Claude Sonnet 5 (claude-sonnet-5), now generally available on the official pricing page. Current promotional pricing through 2026-08-31: input 2, 5m cache write 2.5, 1h cache write 4, cache hit 0.20, output 10 USD per 1M tokens; the official table lists 2026-09-01 prices as 3 / 3.75 / 6 / 0.30 / 15.
- Rechecked OpenAI, Google, DeepSeek, xAI, Zhipu, Alibaba, ByteDance, Kimi, MiniMax, Xiaomi, and LongCat against their official pricing pages; no other tracked price or lineup changes.
- Updated the default USD/CNY rate timestamp from ExchangeRate-API; the rate remains 6.804421.

## 2026-06-30

- Added Meituan LongCat-2.0 (longcat-2.0), currently the only LongCat API pay-as-you-go model listed on the official LongCat pricing page: input cache miss 0.30, cache hit 0.006, output 1.20 USD per 1M tokens at the limited-time discounted rate (official list prices: 0.75 / 0.015 / 2.95), with a 1M context window.
- Added ByteDance's Doubao Seed Evolving (doubao-seed-evolving), a generally available Seed 2.1 Evolving model ID that calls the strongest version and currently maps to Seed 2.1 Pro. Standard Volcengine Ark pay-as-you-go pricing: input 6, cache hit 1.2, cache storage 0.017 CNY/1M/hour, output 30 CNY per 1M tokens.
- Left Doubao Seed 2.1 Pro, Seed 2.1 Turbo, Seed 2.0 Lite, and Seed 2.0 Mini in place; their standard pay-as-you-go prices are unchanged.
- Rechecked OpenAI, Anthropic, Google, DeepSeek, xAI, Zhipu, Alibaba, Kimi, MiniMax, and Xiaomi against their official pricing pages; no other tracked price or lineup changes.
- Updated the default USD/CNY rate to 6.804421 from ExchangeRate-API.

## 2026-06-23

- ByteDance launched the new-generation Doubao Seed 2.1 series on the Volcengine Ark standard pay-as-you-go (标准按量付费) table. Added two models (256k context window, text/image/video understanding, no audio):
  - Doubao Seed 2.1 Pro (doubao-seed-2.1-pro): new flagship Coding & Agent model. Single 0-256k tier: input 6, cache hit 1.2, cache storage 0.017 CNY/1M/hour, output 30 CNY per 1M tokens.
  - Doubao Seed 2.1 Turbo (doubao-seed-2.1-turbo): scaled-production tier. Input 3, cache hit 0.6, cache storage 0.017 CNY/1M/hour, output 15 CNY per 1M tokens.
- Removed Doubao Seed 2.0 Pro (doubao-seed-2.0-pro), superseded by Seed 2.1 Pro as the flagship (Seed 2.0 is now the previous generation). Kept Doubao Seed 2.0 Lite and Mini (still GA on the page, prices unchanged, no Seed 2.1 lite/mini equivalent yet).
- Rechecked OpenAI, Anthropic, Google, DeepSeek, xAI, Zhipu, Alibaba, Kimi, MiniMax, and Xiaomi against their official pricing pages; no other tracked price or lineup changes (no GPT-5.6/6; Claude Mythos 5 still limited-availability; no Gemini 3.6/4.x; no Qwen3.8/Qwen3.7 Flash).
- Updated the default USD/CNY rate to 6.786919 from ExchangeRate-API.

## 2026-06-17

- Added Zhipu's GLM-5.2 (glm-5.2), its new long-task flagship, now listed on the official BigModel pay-as-you-go pricing page (previously subscription-only). Text model, 1M context window: input 8, output 28, cache hit 2 CNY per 1M tokens (single 0-1M tier; cache storage limited-time free).
- Left GLM-5.1 and GLM-5-Turbo in place; both are still offered on the pay-as-you-go page with unchanged prices.
- Rechecked OpenAI, Anthropic, Google, DeepSeek, xAI, Alibaba, ByteDance, Kimi, MiniMax, and Xiaomi against their official pricing pages; no other tracked price or lineup changes (Anthropic's Claude Mythos 5 is still limited-availability; no Qwen3.8/Qwen3.7 Flash; no Gemini 3.6/4.x).
- Updated the default USD/CNY rate to 6.769763 from ExchangeRate-API.

## 2026-06-15

- Refreshed Alibaba's Qwen flagship lineup to its current generation; prior snapshots had fallen behind and missed the 3.6/3.7 releases. All three now have a 1M context window (USD International pay-as-you-go pricing from the official Model Studio table):
  - Qwen3 Max -> Qwen3.7 Max (qwen3.7-max, = qwen3.7-max-2026-05-20): input 2.5, output 7.5 per 1M tokens (single 0-1M tier), text-only.
  - Qwen3.5 Plus -> Qwen3.7 Plus (qwen3.7-plus, = qwen3.7-plus-2026-05-26): input 0.4 / output 1.6 (<=256K), input 1.2 / output 4.8 (256K-1M), text/image/video.
  - Qwen3.5 Flash -> Qwen3.6 Flash (qwen3.6-flash, = qwen3.6-flash-2026-04-16): input 0.25 / output 1.5 (<=256K), input 1 / output 4 (256K-1M), text/image/video. No Qwen3.7 Flash exists yet.
- Did not add Anthropic's Claude Mythos 5 (still limited-availability, not generally available) or Zhipu's GLM-5.2 (still not on the pay-as-you-go page).
- Rechecked OpenAI, Anthropic, Google, DeepSeek, xAI, Zhipu, ByteDance, Kimi, MiniMax, and Xiaomi against their official pricing pages; no other tracked price or lineup changes.
- Updated the default USD/CNY rate to 6.769141 from ExchangeRate-API.

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
