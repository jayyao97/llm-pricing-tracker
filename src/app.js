const state = {
  data: null,
  selectedVersion: null,
  selectedModels: new Set(),
  selectedProviders: new Set(),
  exchange: {
    usdCny: 7.1,
    source: "fallback",
  },
  sort: {
    key: "model",
    direction: "asc",
  },
};

const els = {
  versionSelect: document.querySelector("#versionSelect"),
  searchInput: document.querySelector("#searchInput"),
  providerFilter: document.querySelector("#providerFilter"),
  providerOptions: document.querySelector("#providerOptions"),
  providerSummary: document.querySelector("#providerSummary"),
  summary: document.querySelector("#summary"),
  tableWrap: document.querySelector(".table-wrap"),
  tableScroll: document.querySelector("#tableScroll"),
  header: document.querySelector("#priceHeader"),
  rows: document.querySelector("#priceRows"),
  rowCount: document.querySelector("#rowCount"),
  compareList: document.querySelector("#compareList"),
  clearCompare: document.querySelector("#clearCompare"),
  usdCnyRate: document.querySelector("#usdCnyRate"),
  syncRate: document.querySelector("#syncRate"),
  rateStatus: document.querySelector("#rateStatus"),
  versionNotes: document.querySelector("#versionNotes"),
};

const moneyFormatters = new Map();
let floatingHeaderSignature = "";

async function init() {
  if (window.location.protocol === "file:") {
    throw new Error("Open this project through a local HTTP server or a static host. Browsers block JSON fetches from file:// pages.");
  }

  const response = await fetch("data/prices.json");
  state.data = await response.json();
  state.selectedVersion = resolveVersionDate(new URLSearchParams(window.location.search).get("date"));
  state.exchange.usdCny = state.data.exchangeRate?.usdCny || state.exchange.usdCny;
  els.usdCnyRate.value = state.exchange.usdCny;
  els.rateStatus.textContent = rateStatusText();

  renderVersionOptions();
  renderProviderOptions();
  bindEvents();
  watchFloatingHeaders();
  syncExchangeRate();
  render();
}

function bindEvents() {
  els.versionSelect.addEventListener("change", () => {
    state.selectedVersion = els.versionSelect.value;
    updateDateParam(state.selectedVersion);
    state.selectedProviders.clear();
    renderProviderOptions();
    render();
  });
  els.searchInput.addEventListener("input", render);
  els.providerOptions.addEventListener("change", (event) => {
    const input = event.target.closest("input[type='checkbox']");
    if (!input) {
      return;
    }

    if (!input.value) {
      state.selectedProviders.clear();
    } else if (input.checked) {
      state.selectedProviders.add(input.value);
    } else {
      state.selectedProviders.delete(input.value);
    }

    renderProviderOptions();
    render();
  });
  document.addEventListener("click", (event) => {
    if (!els.providerFilter.contains(event.target)) {
      els.providerFilter.open = false;
    }
  });
  els.clearCompare.addEventListener("click", () => {
    state.selectedModels.clear();
    render();
  });
  els.usdCnyRate.addEventListener("input", () => {
    const nextRate = Number(els.usdCnyRate.value);
    if (!Number.isFinite(nextRate) || nextRate <= 0) {
      return;
    }

    state.exchange = {
      usdCny: nextRate,
      source: "manual",
    };
    els.rateStatus.textContent = rateStatusText();
    render();
  });
  els.syncRate.addEventListener("click", syncExchangeRate);
  window.addEventListener("scroll", updateFloatingHeaders, { passive: true });
  window.addEventListener("resize", updateFloatingHeaders);
  els.tableScroll.addEventListener("scroll", updateFloatingHeaders, { passive: true });
}

function renderVersionOptions() {
  els.versionSelect.innerHTML = state.data.versions
    .map((version) => `<option value="${version.date}">${version.date}</option>`)
    .join("");
  els.versionSelect.value = state.selectedVersion;
}

function renderProviderOptions() {
  const version = currentVersion();
  const providers = [...new Set(version.models.map((model) => model.provider))].sort();
  state.selectedProviders = new Set([...state.selectedProviders].filter((provider) => providers.includes(provider)));
  const selectedCount = state.selectedProviders.size;

  els.providerSummary.textContent = selectedCount === 0
    ? "All"
    : selectedCount <= 2
      ? [...state.selectedProviders].sort().join(", ")
      : `${selectedCount} selected`;

  els.providerOptions.innerHTML = [
    providerOption("", "All", selectedCount === 0),
    ...providers.map((provider) => providerOption(provider, provider, state.selectedProviders.has(provider))),
  ].join("");
}

function providerOption(value, label, checked) {
  return `
    <label class="provider-option">
      <input type="checkbox" value="${escapeHtml(value)}" ${checked ? "checked" : ""}>
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

function render() {
  const version = currentVersion();
  const models = filteredModels(version);
  clearFloatingHeaders();
  renderHeader(version);
  renderSummary(version, models);
  renderRows(version, models);
  renderCompare(version);
  renderNotes(version);
  updateFloatingHeaders();
}

function currentVersion() {
  const date = resolveVersionDate(state.selectedVersion);
  state.selectedVersion = date;
  els.versionSelect.value = date;
  return state.data.versions.find((version) => version.date === date);
}

function resolveVersionDate(requestedDate) {
  const dates = state.data.versions.map((version) => version.date).sort();
  if (dates.length === 0) {
    return null;
  }
  if (!requestedDate) {
    return dates[dates.length - 1];
  }
  if (dates.includes(requestedDate)) {
    return requestedDate;
  }

  return [...dates].reverse().find((date) => date <= requestedDate) || dates[0];
}

function updateDateParam(date) {
  const url = new URL(window.location.href);
  url.searchParams.set("date", date);
  window.history.replaceState(null, "", url);
}

function filteredModels(version) {
  const keyword = els.searchInput.value.trim().toLowerCase();
  const providers = state.selectedProviders;

  const models = version.models.filter((model) => {
    const matchesProvider = providers.size === 0 || providers.has(model.provider);
    const haystack = `${model.provider} ${model.name} ${model.id}`.toLowerCase();
    return matchesProvider && (!keyword || haystack.includes(keyword));
  });

  return sortModels(models);
}

function sortModels(models) {
  return [...models].sort((a, b) => {
    let result;

    if (state.sort.key === "provider") {
      result = a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name);
    } else if (state.sort.key === "model") {
      result = a.name.localeCompare(b.name) || a.provider.localeCompare(b.provider);
    } else if (state.sort.key.startsWith("price:")) {
      const key = state.sort.key.replace("price:", "");
      result = comparePrices(priceForSort(a, key), priceForSort(b, key)) || a.name.localeCompare(b.name);
    } else if (state.sort.key.startsWith("category:")) {
      const category = state.sort.key.replace("category:", "");
      result = comparePrices(categoryPriceForSort(a, category), categoryPriceForSort(b, category)) || a.name.localeCompare(b.name);
    } else if (state.sort.key === "context") {
      result = (a.contextWindow || "").localeCompare(b.contextWindow || "") || a.name.localeCompare(b.name);
    } else {
      result = `${a.provider} ${a.name}`.localeCompare(`${b.provider} ${b.name}`);
    }

    return state.sort.direction === "asc" ? result : -result;
  });
}

function priceForSort(model, key) {
  const item = findItemForKey(model, key);
  return convertedPrice(item);
}

function categoryPriceForSort(model, category) {
  const prices = getItems(model, category).map(convertedPrice).filter(Number.isFinite);
  return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
}

function comparePrices(left, right) {
  if (!Number.isFinite(left) && !Number.isFinite(right)) {
    return 0;
  }

  return left - right;
}

function renderSummary(version, models) {
  const providers = new Set(models.map((model) => model.provider));
  els.summary.innerHTML = [
    metric("Current Date", version.date),
    metric("Models", models.length),
    metric("Providers", providers.size),
    metric("Compare FX", `USD/CNY ${formatRate(state.exchange.usdCny)}`),
  ].join("");
}

function metric(label, value) {
  return `<div class="metric"><span>${label}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function renderHeader(version) {
  const columns = catalogColumns(version.models);
  els.header.innerHTML = [
    '<th scope="col">Compare</th>',
    sortableHeader("Provider", "provider"),
    sortableHeader("Model", "model"),
    ...columns.map((column) => `
      <th scope="col">
        <button class="sort-button" type="button" data-sort-key="category:${escapeHtml(column.category)}">
          <span class="sort-main">
            <span>${escapeHtml(column.label)}</span>
            ${sortIndicator(`category:${column.category}`)}
          </span>
        </button>
      </th>
    `),
    sortableHeader("Context", "context"),
    '<th scope="col">Source</th>',
  ].join("");

  els.header.querySelectorAll("[data-sort-key]").forEach((button) => {
    button.addEventListener("click", () => {
      setSort(button.dataset.sortKey);
      render();
    });
  });
}

function sortableHeader(label, key) {
  return `
    <th scope="col">
      <button class="sort-button" type="button" data-sort-key="${escapeHtml(key)}">
        <span class="sort-main">
          <span>${escapeHtml(label)}</span>
          ${sortIndicator(key)}
        </span>
      </button>
    </th>
  `;
}

function sortIndicator(key) {
  if (state.sort.key !== key) {
    return '<span class="sort-indicator" aria-hidden="true"></span>';
  }

  return `<span class="sort-indicator is-active" aria-hidden="true">${state.sort.direction === "asc" ? "↑" : "↓"}</span>`;
}

function setSort(key) {
  if (state.sort.key === key) {
    state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
    return;
  }

  state.sort.key = key;
  state.sort.direction = "asc";
}

function renderRows(version, models) {
  const columns = catalogColumns(version.models);
  els.rowCount.textContent = `${models.length} models`;

  if (models.length === 0) {
    els.rows.innerHTML = `<tr><td colspan="${columns.length + 5}" class="empty">No matching models.</td></tr>`;
    return;
  }

  els.rows.innerHTML = models.map((model) => {
    const selectionKey = selectedModelKey(version, model);
    const checked = state.selectedModels.has(selectionKey) ? "checked" : "";
    return `
      <tr class="${checked ? "is-selected" : ""}" data-selection-key="${escapeHtml(selectionKey)}">
        <td><input class="compare-checkbox" type="checkbox" data-selection-key="${escapeHtml(selectionKey)}" ${checked} aria-label="Select ${escapeHtml(model.name)}"></td>
        <td>${providerIcon(model)}</td>
        <td>
          <div class="model-name">${escapeHtml(model.name)}</div>
          <div class="model-id">${escapeHtml(model.id)}</div>
        </td>
        ${columns.map((column) => `<td class="price-cell">${formatPricingCategory(model, column.category)}</td>`).join("")}
        <td>${escapeHtml(model.contextWindow || "-")}</td>
        <td>
          <a class="source-link" href="${escapeHtml(model.source.url)}" rel="noreferrer" target="_blank">Official</a>
          <div class="model-id">${escapeHtml(version.effectiveDate)}</div>
        </td>
      </tr>
    `;
  }).join("");

  els.rows.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      setModelSelected(event.target.dataset.selectionKey, event.target.checked);
    });
  });

  els.rows.querySelectorAll("tr[data-selection-key]").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.closest("a, button, input, select")) {
        return;
      }

      const checkbox = row.querySelector("input[type='checkbox']");
      checkbox.checked = !checkbox.checked;
      setModelSelected(row.dataset.selectionKey, checkbox.checked);
    });
  });
}

function setModelSelected(selectionKey, isSelected) {
  if (isSelected) {
    state.selectedModels.add(selectionKey);
  } else {
    state.selectedModels.delete(selectionKey);
  }

  const row = els.rows.querySelector(`tr[data-selection-key="${CSS.escape(selectionKey)}"]`);
  if (row) {
    row.classList.toggle("is-selected", isSelected);
    const checkbox = row.querySelector("input[type='checkbox']");
    if (checkbox) {
      checkbox.checked = isSelected;
    }
  }
  renderCompare(currentVersion());
}

function selectedModelKey(version, model) {
  return `${version.date}::${model.provider}::${model.id}`;
}

function providerIcon(model) {
  const provider = model.provider;
  const icons = {
    Alibaba: {
      src: "assets/providers/qwen.png",
      className: "provider-qwen",
      label: "Qwen",
    },
    Anthropic: {
      src: "assets/providers/anthropic.png",
      className: "provider-anthropic",
      label: "Anthropic",
    },
    ByteDance: {
      src: "assets/providers/doubao.png",
      className: "provider-doubao",
      label: "Doubao",
    },
    DeepSeek: {
      src: "assets/providers/deepseek.ico",
      className: "provider-deepseek",
      label: "DeepSeek",
    },
    Google: {
      src: "assets/providers/gemini.svg",
      className: "provider-gemini",
      label: "Gemini",
    },
    Kimi: {
      src: "assets/providers/kimi.ico",
      className: "provider-kimi",
      label: "Kimi",
    },
    MiniMax: {
      src: "assets/providers/minimax.ico",
      className: "provider-minimax",
      label: "MiniMax",
    },
    OpenAI: {
      src: "assets/providers/openai.svg",
      className: "provider-openai",
      label: "OpenAI",
    },
    xAI: {
      src: "assets/providers/grok.ico",
      className: "provider-grok",
      label: "Grok",
    },
    Xiaomi: {
      src: "assets/providers/mimo.png",
      className: "provider-mimo",
      label: "MiMo",
    },
    Zhipu: {
      src: "assets/providers/glm.svg",
      className: "provider-glm",
      label: "GLM",
    },
  };
  const icon = icons[provider];

  if (!icon) {
    return `<span class="provider-name">${escapeHtml(provider)}</span>`;
  }

  const label = `${icon.label} / ${provider}`;
  return `
    <span class="provider-icon ${escapeHtml(icon.className)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">
      <img src="${escapeHtml(icon.src)}" alt="${escapeHtml(icon.label)}" loading="lazy">
    </span>
  `;
}

function renderCompare(version) {
  const selected = selectedCompareModels();
  els.clearCompare.hidden = selected.length === 0;

  if (selected.length === 0) {
    els.compareList.innerHTML = '<p class="empty">Select models across one or more dates to compare them here.</p>';
    return;
  }

  const rows = compareRows(selected);
  const rankedSelected = sortModelsByComparisonScore(selected, rows);
  els.compareList.innerHTML = `
    <div class="compare-basket" aria-label="Comparison basket">
      ${selected.map((model) => `
        <button class="compare-chip" type="button" data-remove-selection="${escapeHtml(model.compareKey)}" title="Remove ${escapeHtml(model.name)} from comparison">
          <span>${escapeHtml(model.name)}</span>
          <small>${escapeHtml(model.provider)} · ${escapeHtml(model.snapshotDate)}</small>
          <span aria-hidden="true">×</span>
        </button>
      `).join("")}
    </div>
    <div class="compare-table-wrap">
      <div class="compare-grid" style="--compare-columns: ${rankedSelected.length}">
        <div class="compare-cell compare-header">Field</div>
        ${rankedSelected.map((model) => `
          <div class="compare-cell compare-header">
            <span class="model-name">${escapeHtml(model.name)}</span>
            <span class="model-id">${escapeHtml(model.provider)} · ${escapeHtml(model.snapshotDate)}</span>
          </div>
        `).join("")}
        ${rows.map((row) => `
          <div class="compare-cell compare-row-head${row.isBandHeader ? " compare-band-head" : ""}">${escapeHtml(row.label)}</div>
          ${rankedSelected.map((model) => {
            const rank = row.rankByModel?.get(compareModelKey(model));
            const rankClass = rank ? ` rank-${rank}` : "";
            const rankLabel = rank ? `<span class="rank-badge rank-badge-${rank}">#${rank}</span>` : "";
            const bandClass = row.isBandHeader ? " compare-band-cell" : "";
            return `<div class="compare-cell${bandClass}${rankClass}">${row.value(model)}${rankLabel}</div>`;
          }).join("")}
        `).join("")}
      </div>
    </div>
  `;

  els.compareList.querySelectorAll("[data-remove-selection]").forEach((button) => {
    button.addEventListener("click", () => {
      setModelSelected(button.dataset.removeSelection, false);
    });
  });
  const compareScroll = els.compareList.querySelector(".compare-table-wrap");
  if (compareScroll) {
    compareScroll.addEventListener("scroll", updateFloatingHeaders, { passive: true });
  }
  updateFloatingHeaders();
}

function selectedCompareModels() {
  const selected = [];

  for (const version of state.data.versions) {
    for (const model of version.models) {
      const compareKey = selectedModelKey(version, model);
      if (!state.selectedModels.has(compareKey)) {
        continue;
      }
      selected.push({
        ...model,
        compareKey,
        originalId: model.id,
        snapshotDate: version.date,
        effectiveDate: version.effectiveDate,
      });
    }
  }

  return selected;
}

function clearFloatingHeaders() {
  document.querySelectorAll(".floating-header").forEach((header) => header.remove());
}

function watchFloatingHeaders() {
  const tick = () => {
    const compareScroll = els.compareList.querySelector(".compare-table-wrap");
    const signature = [
      window.scrollX,
      window.scrollY,
      window.innerWidth,
      els.tableScroll.scrollLeft,
      compareScroll?.scrollLeft || 0,
    ].join(":");

    if (signature !== floatingHeaderSignature) {
      floatingHeaderSignature = signature;
      updateFloatingHeaders();
    }
  };

  window.setInterval(tick, 100);
}

function updateFloatingHeaders() {
  updateCatalogFloatingHeader();
  updateCompareFloatingHeader();
}

function updateCatalogFloatingHeader() {
  const table = els.tableScroll?.querySelector("table");
  const headerRow = els.header;
  if (!table || !headerRow || headerRow.children.length === 0) {
    removeFloatingHeader("catalog");
    return;
  }

  const tableRect = table.getBoundingClientRect();
  const scrollRect = els.tableScroll.getBoundingClientRect();
  const headerRect = headerRow.getBoundingClientRect();
  const active = tableRect.top < 0 && tableRect.bottom > headerRect.height;
  const floating = ensureFloatingHeader("catalog");
  floating.hidden = !active;
  if (!active) {
    return;
  }

  floating.style.left = `${Math.max(scrollRect.left, 0)}px`;
  floating.style.width = `${Math.min(scrollRect.width, window.innerWidth - Math.max(scrollRect.left, 0))}px`;
  const floatingScroll = floating.querySelector(".floating-header-scroll");
  const inner = floating.querySelector(".floating-header-inner");
  inner.style.width = `${table.offsetWidth}px`;
  inner.innerHTML = `<table>${catalogFloatingColGroup(headerRow)}<thead><tr>${headerRow.innerHTML}</tr></thead></table>`;
  floatingScroll.scrollLeft = els.tableScroll.scrollLeft;
  bindFloatingSortButtons(floating);
}

function catalogFloatingColGroup(headerRow) {
  return `
    <colgroup>
      ${[...headerRow.children].map((cell) => `<col style="width: ${cell.getBoundingClientRect().width}px">`).join("")}
    </colgroup>
  `;
}

function updateCompareFloatingHeader() {
  const compareScroll = els.compareList.querySelector(".compare-table-wrap");
  const compareGrid = compareScroll?.querySelector(".compare-grid");
  if (!compareScroll || !compareGrid) {
    removeFloatingHeader("compare");
    return;
  }

  const headers = [...compareGrid.querySelectorAll(".compare-header")];
  if (headers.length === 0) {
    removeFloatingHeader("compare");
    return;
  }

  const gridRect = compareGrid.getBoundingClientRect();
  const scrollRect = compareScroll.getBoundingClientRect();
  const headerHeight = Math.max(...headers.map((header) => header.getBoundingClientRect().height));
  const active = gridRect.top < 0 && gridRect.bottom > headerHeight;
  const floating = ensureFloatingHeader("compare");
  floating.hidden = !active;
  if (!active) {
    return;
  }

  floating.style.left = `${Math.max(scrollRect.left, 0)}px`;
  floating.style.width = `${Math.min(scrollRect.width, window.innerWidth - Math.max(scrollRect.left, 0))}px`;
  const floatingScroll = floating.querySelector(".floating-header-scroll");
  const inner = floating.querySelector(".floating-header-inner");
  inner.style.width = `${compareGrid.scrollWidth}px`;
  inner.innerHTML = `
    <div class="compare-grid" style="--compare-columns: ${headers.length - 1}">
      ${headers.map((header) => `<div class="${escapeHtml(header.className)}">${header.innerHTML}</div>`).join("")}
    </div>
  `;
  floatingScroll.scrollLeft = compareScroll.scrollLeft;
}

function ensureFloatingHeader(kind) {
  let floating = document.querySelector(`.floating-header[data-floating="${kind}"]`);
  if (!floating) {
    floating = document.createElement("div");
    floating.className = `floating-header floating-header-${kind}`;
    floating.dataset.floating = kind;
    floating.innerHTML = '<div class="floating-header-scroll"><div class="floating-header-inner"></div></div>';
    document.body.append(floating);
  }
  return floating;
}

function removeFloatingHeader(kind) {
  document.querySelector(`.floating-header[data-floating="${kind}"]`)?.remove();
}

function bindFloatingSortButtons(floating) {
  floating.querySelectorAll("[data-sort-key]").forEach((button) => {
    button.addEventListener("click", () => {
      setSort(button.dataset.sortKey);
      render();
    });
  });
}

function getItems(model, category) {
  return model.pricingItems.filter((item) => displayCategory(item.category) === category);
}

function pricingColumns(models) {
  const columns = [];
  const seen = new Set();

  for (const model of models) {
    for (const item of model.pricingItems) {
      const key = itemKey(item);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      columns.push({
        key,
        category: displayCategory(item.category),
        label: labelForCategory(item.category),
        condition: conditionText(item),
      });
    }
  }

  return columns.sort((a, b) => categoryOrder(a.category) - categoryOrder(b.category) || a.condition.localeCompare(b.condition));
}

function catalogColumns(models) {
  const categories = [...new Set(models.flatMap((model) => model.pricingItems.map((item) => displayCategory(item.category))))]
    .sort((a, b) => categoryOrder(a) - categoryOrder(b));

  return categories.map((category) => ({
    category,
    label: labelForCategory(category),
  }));
}

function displayCategory(category) {
  return category === "cache_storage" ? "cache_write_tokens" : category;
}

function labelForCategory(category) {
  return {
    input_tokens: "Input",
    output_tokens: "Output",
    cache_read_tokens: "Cache Read",
    cache_write_tokens: "Cache Write",
  }[category] || category;
}

function categoryOrder(category) {
  return {
    input_tokens: 1,
    output_tokens: 2,
    cache_read_tokens: 3,
    cache_write_tokens: 4,
  }[category] || 99;
}

function formatPricingItemByKey(model, key) {
  const item = findItemForKey(model, key);

  if (!item) {
    return '<span class="price-note">-</span>';
  }

  return formatPrice(item);
}

function formatPricingCategory(model, category) {
  const items = getItems(model, category);
  if (items.length === 0) {
    return '<span class="price-note">-</span>';
  }

  return [...items]
    .sort((a, b) => conditionText(a).localeCompare(conditionText(b)))
    .map((item) => {
      const condition = conditionText(item);
      const note = condition === "all ranges" ? "" : `<span class="column-condition">${escapeHtml(condition)}</span>`;
      return `<div class="price-line">${formatPrice(item)}${note}</div>`;
    })
    .join("");
}

function findItemForKey(model, key) {
  const exact = model.pricingItems.find((candidate) => itemKey(candidate) === key);
  if (exact) {
    return exact;
  }

  const [category] = key.split("|");
  return findAllRangesItem(model, category);
}

function findAllRangesItem(model, category) {
  return model.pricingItems.find((item) => {
    return displayCategory(item.category) === category && isAllRange(item.conditions.contextRange);
  });
}

function compareRows(models) {
  const bands = contextBands(models);
  const specs = comparePriceSpecs(models);
  const priceRows = bands.flatMap((band) => [
    {
      label: band.label,
      isBandHeader: true,
      value: (model) => matchedTierSummary(model, band),
    },
    ...specs
      .map((spec) => priceRowForBand(models, band, spec))
      .filter((row) => row.hasAnyValue),
  ]);

  return [
    {
      label: "Snapshot date",
      value: (model) => escapeHtml(model.snapshotDate || "-"),
    },
    {
      label: "Context window",
      value: (model) => escapeHtml(model.contextWindow || "-"),
    },
    ...priceRows,
    {
      label: "Official source",
      value: (model) => `<a href="${escapeHtml(model.source.url)}" target="_blank" rel="noreferrer">Open</a>`,
    },
  ];
}

function comparePriceSpecs(models) {
  const seen = new Set();
  const specs = [];

  for (const model of models) {
    for (const item of model.pricingItems) {
      const category = displayCategory(item.category);
      const cacheDuration = item.conditions.cacheDuration || "";
      const key = `${category}|${cacheDuration}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      specs.push({
        category,
        cacheDuration,
        label: cacheDuration
          ? `${labelForCategory(category)} (${cacheDuration})`
          : labelForCategory(category),
      });
    }
  }

  return specs.sort((a, b) => {
    return categoryOrder(a.category) - categoryOrder(b.category) || a.cacheDuration.localeCompare(b.cacheDuration);
  });
}

function priceRowForBand(models, band, spec) {
  const row = {
    label: spec.label,
    isComparable: comparableCountForBand(models, band, spec) >= 2,
    rankByModel: rankModelsForBand(models, band, spec),
    hasAnyValue: models.some((model) => findItemForBand(model, band, spec)),
    value: (model) => formatBandPrice(model, band, spec),
  };

  return row;
}

function contextBands(models) {
  const boundaries = new Set([0]);
  let hasUncappedOpenEndedRange = false;

  for (const model of models) {
    const contextLimit = parseTokenValue(model.contextWindow);
    if (Number.isFinite(contextLimit)) {
      boundaries.add(contextLimit);
    }

    for (const item of model.pricingItems) {
      if (isAllRange(item.conditions.contextRange)) {
        continue;
      }
      const range = parseContextRange(item.conditions.contextRange);
      if (!range) {
        continue;
      }
      if (range.lower > 0) {
        boundaries.add(range.lower);
      }
      if (Number.isFinite(range.upper)) {
        boundaries.add(range.upper);
      } else {
        hasUncappedOpenEndedRange = !Number.isFinite(contextLimit) || hasUncappedOpenEndedRange;
      }
    }
  }

  const points = [...boundaries].filter((value) => value >= 0).sort((a, b) => a - b);
  const bands = [];
  for (let index = 1; index < points.length; index += 1) {
    if (points[index] > points[index - 1]) {
      bands.push({
        lower: points[index - 1],
        upper: points[index],
        label: bandLabel(points[index - 1], points[index]),
      });
    }
  }

  const maxPoint = points[points.length - 1];
  if (hasUncappedOpenEndedRange && maxPoint > 0) {
    bands.push({
      lower: maxPoint,
      upper: Number.POSITIVE_INFINITY,
      label: `> ${formatTokenCount(maxPoint)}`,
    });
  }

  return bands.length ? bands : [{ lower: 0, upper: Number.POSITIVE_INFINITY, label: "All context ranges" }];
}

function bandLabel(lower, upper) {
  if (lower === 0) {
    return `<= ${formatTokenCount(upper)}`;
  }
  return `${formatTokenCount(lower)} - ${formatTokenCount(upper)}`;
}

function formatTokenCount(value) {
  if (value >= 1000000 && value % 1000000 === 0) {
    return `${value / 1000000}M`;
  }
  if (value >= 1000 && value % 1000 === 0) {
    return `${value / 1000}k`;
  }
  return `${value}`;
}

function parseContextRange(range) {
  if (isAllRange(range)) {
    return { lower: 0, upper: Number.POSITIVE_INFINITY };
  }

  const text = range.toLowerCase();
  const numbers = [...text.matchAll(/(\d+(?:\.\d+)?)\s*([km])?/g)].map((match) => parseTokenNumber(match[1], match[2]));
  if (numbers.length === 0) {
    return null;
  }

  if (text.includes("<=") || text.includes("<")) {
    if (numbers.length >= 2) {
      return { lower: numbers[0], upper: numbers[1] };
    }
    return { lower: 0, upper: numbers[0] };
  }

  if (text.includes(">=") || text.includes(">")) {
    return { lower: numbers[0], upper: Number.POSITIVE_INFINITY };
  }

  return null;
}

function parseTokenValue(value) {
  if (!value) {
    return Number.NaN;
  }
  const match = String(value).toLowerCase().match(/(\d+(?:\.\d+)?)\s*([km])?/);
  return match ? parseTokenNumber(match[1], match[2]) : Number.NaN;
}

function parseTokenNumber(value, unit) {
  const number = Number(value);
  if (unit === "m") {
    return number * 1000000;
  }
  if (unit === "k") {
    return number * 1000;
  }
  return number;
}

function findItemForBand(model, band, spec) {
  const exact = model.pricingItems.find((item) => {
    return displayCategory(item.category) === spec.category
      && (item.conditions.cacheDuration || "") === spec.cacheDuration
      && rangeCoversBand(parseContextRange(item.conditions.contextRange), band);
  });

  if (exact) {
    return exact;
  }

  return model.pricingItems.find((item) => {
    return displayCategory(item.category) === spec.category
      && (item.conditions.cacheDuration || "") === spec.cacheDuration
      && isAllRange(item.conditions.contextRange);
  });
}

function rangeCoversBand(range, band) {
  if (!range) {
    return false;
  }
  return range.lower <= band.lower && range.upper >= band.upper;
}

function formatBandPrice(model, band, spec) {
  const item = findItemForBand(model, band, spec);
  if (!item) {
    return '<span class="price-note">-</span>';
  }

  const tier = contextConditionText(item);
  const tierNote = tier === "all ranges" ? "" : `<span class="price-converted">matched: ${escapeHtml(tier)}</span>`;
  return `${formatPrice(item)}${tierNote}`;
}

function matchedTierSummary(model, band) {
  const tiers = new Set();
  for (const item of model.pricingItems) {
    if (rangeCoversBand(parseContextRange(item.conditions.contextRange), band)) {
      tiers.add(contextConditionText(item));
    }
  }

  if (tiers.size === 0) {
    return '<span class="price-note">not covered</span>';
  }
  if (tiers.size === 1) {
    const [tier] = tiers;
    return tier === "all ranges" ? "all ranges" : escapeHtml(tier);
  }

  return "multiple official tiers";
}

function contextConditionText(item) {
  return item.conditions.contextRange && !isAllRange(item.conditions.contextRange)
    ? item.conditions.contextRange
    : "all ranges";
}

function sortModelsByComparisonScore(models, rows) {
  const sourceOrder = new Map(models.map((model, index) => [compareModelKey(model), index]));

  return [...models].sort((left, right) => {
    const leftScore = comparisonScore(left, rows);
    const rightScore = comparisonScore(right, rows);
    return rightScore - leftScore || sourceOrder.get(compareModelKey(left)) - sourceOrder.get(compareModelKey(right));
  });
}

function compareModelKey(model) {
  return model.compareKey || model.id;
}

function comparableCountForBand(models, band, spec) {
  return models.filter((model) => Number.isFinite(convertedPrice(findItemForBand(model, band, spec)))).length;
}

function rankModelsForBand(models, band, spec) {
  const priced = models
    .map((model) => {
      const item = findItemForBand(model, band, spec);
      const price = convertedPrice(item);
      return Number.isFinite(price) ? { model, price } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.price - b.price);

  const ranks = new Map();
  let rank = 0;
  let previousPrice = null;
  for (const entry of priced) {
    if (previousPrice === null || entry.price !== previousPrice) {
      rank += 1;
      previousPrice = entry.price;
    }
    if (rank <= 3) {
      ranks.set(compareModelKey(entry.model), rank);
    }
  }

  return ranks;
}

function comparisonScore(model, rows) {
  const scored = rows.reduce((result, row) => {
    if (!row.isComparable) {
      return result;
    }

    const rank = row.rankByModel?.get(compareModelKey(model));
    return {
      score: result.score + (rank ? 4 - rank : 0),
      count: result.count + 1,
    };
  }, { score: 0, count: 0 });

  return scored.count ? scored.score / scored.count : 0;
}

function itemKey(item) {
  return [
    displayCategory(item.category),
    normalizedContextRange(item.conditions.contextRange),
    item.conditions.cacheDuration || "",
  ].join("|");
}

function conditionText(item) {
  const conditions = [];
  if (item.conditions.contextRange && !isAllRange(item.conditions.contextRange)) {
    conditions.push(item.conditions.contextRange);
  }
  if (item.conditions.cacheDuration) {
    conditions.push(`cache duration: ${item.conditions.cacheDuration}`);
  }
  return conditions.length ? conditions.join("; ") : "all ranges";
}

function normalizedContextRange(range) {
  return isAllRange(range) ? "all" : range || "";
}

function isAllRange(range) {
  return !range || range === "all" || range === "all ranges";
}

function renderNotes(version) {
  const sourceLinks = version.sources.map((source) => {
    return `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.provider)}</a>`;
  }).join(", ");

  els.versionNotes.innerHTML = `
    <p>${escapeHtml(version.notes)}</p>
    <p>Official sources: ${sourceLinks}</p>
  `;
}

function formatPrice(item) {
  const value = item?.price;
  if (value === null || value === undefined) {
    return '<span class="price-note">-</span>';
  }

  if (typeof value === "string") {
    return `<span>${escapeHtml(value)}</span>`;
  }

  const currency = itemCurrency(item);
  const base = money(currency).format(value);
  const converted = convertedPrice(item);
  const note = item.conditions?.note ? `<span class="price-converted">${escapeHtml(item.conditions.note)}</span>` : "";

  if (currency === "USD" || !Number.isFinite(converted)) {
    return `${base}${note}`;
  }

  return `
    <span>${formatConvertedUsd(converted)}</span>
    <span class="price-converted">${base}</span>
    ${note}
  `;
}

function itemCurrency(item) {
  return item?.currency || state.data.currency || "USD";
}

function convertedPrice(item) {
  if (!item || typeof item.price !== "number") {
    return Number.POSITIVE_INFINITY;
  }

  const currency = itemCurrency(item);
  if (currency === "USD") {
    return item.price;
  }
  if (currency === "CNY") {
    return item.price / state.exchange.usdCny;
  }

  return Number.POSITIVE_INFINITY;
}

function money(currency) {
  if (!moneyFormatters.has(currency)) {
    moneyFormatters.set(currency, new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 6,
    }));
  }

  return moneyFormatters.get(currency);
}

function formatConvertedUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(value);
}

async function syncExchangeRate() {
  els.syncRate.disabled = true;
  els.rateStatus.textContent = "Updating...";

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const rate = payload.rates?.CNY;
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("CNY rate missing");
    }

    state.exchange = {
      usdCny: rate,
      source: "ExchangeRate-API",
    };
    els.usdCnyRate.value = rate.toFixed(4);
  } catch (error) {
    state.exchange.source = "fallback";
  } finally {
    els.syncRate.disabled = false;
    els.rateStatus.textContent = rateStatusText();
    render();
  }
}

function rateStatusText() {
  return `${state.exchange.source}; CNY shown as USD equivalent`;
}

function formatRate(value) {
  return Number(value).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[char];
  });
}

init().catch((error) => {
  els.rows.innerHTML = `<tr><td colspan="8" class="empty">Failed to load data: ${escapeHtml(error.message)}</td></tr>`;
});
