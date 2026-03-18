

const state = {
  type: "Length",
  action: "Conversion",
  fromVal: null,
  fromUnit: "",
  toVal: null,
  toUnit: "",
  operator: "+"
};

const apiBase = "http://localhost:3000";

function showBanner(message) {
  let banner = document.querySelector(".error-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.className = "error-banner";
    banner.style.cssText = "background:#ffe5e5;color:#a00;padding:12px;border:1px solid #f5c2c2;margin:8px 0;border-radius:5px;text-align:center;font-weight:bold;";
    const container = document.querySelector(".container") || document.body;
    container.insertBefore(banner, container.firstChild);
  }
  banner.textContent = message;
  banner.style.display = "block";
}

function hideBanner() {
  const banner = document.querySelector(".error-banner");
  if (banner) banner.style.display = "none";
}


function toggleOperators(show) {
  const opRow = document.querySelector(".operator-row");
  if (!opRow) return;
  opRow.style.display = show ? "flex" : "none";
}

function setActiveTypeCard(index = 0) {
  const cards = Array.from(document.querySelectorAll(".modify-grid"));
  cards.forEach((card, idx) => {
    card.classList.toggle("active", idx === index);
  });
  if (cards[index]) {
    const heading = cards[index].querySelector(".adjust");
    if (heading) {
      state.type = heading.textContent.trim();
    }
  }
}

function setActiveActionButton(index = 0) {
  const buttons = Array.from(document.querySelectorAll(".action-btn"));
  buttons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === index);
  });
  if (buttons[index]) {
    state.action = buttons[index].textContent.trim();
  }
}

async function loadUnits(type) {
  try {
    const res = await fetch(`${apiBase}/units`);
    if (!res.ok) {
      throw new Error(`Failed to load units: ${res.status}`);
    }
    const allUnits = await res.json();

    const selects = document.querySelectorAll(".conv-select");
    if (selects.length < 2) {
      console.warn("Not enough select elements found");
      return null;
    }

    const filteredUnits = allUnits.filter(
      unit => unit.type && unit.type.toLowerCase() === type.toLowerCase()
    );

    if (!Array.isArray(filteredUnits) || filteredUnits.length === 0) {
      throw new Error(`No units found for type: ${type}`);
    }

    const [fromSelect, toSelect] = selects;
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    filteredUnits.forEach((unit, idx) => {
      const label = unit.label || unit.symbol || "";

      const fromOpt = document.createElement("option");
      fromOpt.value = label;
      fromOpt.textContent = label;
      if (idx === 0) fromOpt.selected = true;
      fromSelect.appendChild(fromOpt);

      const toOpt = document.createElement("option");
      toOpt.value = label;
      toOpt.textContent = label;
      if (idx === 0) toOpt.selected = true;
      toSelect.appendChild(toOpt);
    });

    state.fromUnit = fromSelect.value;
    state.toUnit = toSelect.value;
    hideBanner();
    return filteredUnits;
  } catch (err) {
    if (err instanceof TypeError) {
      showBanner("Server unavailable");
    } else {
      showBanner("Unable to load units");
    }
    console.error("loadUnits error:", err);
    return null;
  }
}

async function loadHistory() {
  try {
    const res = await fetch(`${apiBase}/history`);
    if (!res.ok) {
      throw new Error(`History fetch failed: ${res.status}`);
    }
    const history = await res.json();

    const existing = document.querySelector(".history-list");
    if (existing) {
      existing.remove();
    }

    const historySection = document.createElement("section");
    historySection.className = "history-list";
    historySection.style.marginTop = "20px";
    historySection.style.padding = "12px";
    historySection.style.backgroundColor = "#f9f9f9";
    historySection.style.borderRadius = "5px";

    const heading = document.createElement("h3");
    heading.textContent = "Conversion History";
    heading.style.marginTop = "0";
    historySection.appendChild(heading);

    const list = document.createElement("ul");
    list.style.paddingLeft = "20px";
    list.style.margin = "8px 0";

    if (Array.isArray(history) && history.length > 0) {
      history.forEach((item) => {
        const li = document.createElement("li");
        li.style.marginBottom = "6px";
        li.textContent = item.text || JSON.stringify(item);
        list.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No history yet.";
      li.style.color = "#999";
      list.appendChild(li);
    }

    historySection.appendChild(list);
    document.querySelector(".container")?.appendChild(historySection);
  } catch (err) {
    console.warn("Unable to load history:", err);
  }
}

function attachEventListeners() {
  const typeCards = document.querySelectorAll(".modify-grid");
  typeCards.forEach((card, index) => {
    card.addEventListener("click", async () => {
      setActiveTypeCard(index);
      await loadUnits(state.type);
    });
  });

  const actionButtons = document.querySelectorAll(".action-btn");
  actionButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      setActiveActionButton(index);
      const showOperators = state.action === "Arithmetic";
      toggleOperators(showOperators);
    });
  });

  const selects = document.querySelectorAll(".conv-select");
  if (selects.length >= 2) {
    selects[0].addEventListener("change", (e) => {
      state.fromUnit = e.target.value;
    });
    selects[1].addEventListener("change", (e) => {
      state.toUnit = e.target.value;
    });
  }

  const operatorSelect = document.querySelector(".operator-select");
  if (operatorSelect) {
    operatorSelect.addEventListener("change", (e) => {
      state.operator = e.target.value;
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Initializing Quantity Measurement App...");


  attachEventListeners();


  setActiveTypeCard(0);
  setActiveActionButton(1);


  await loadUnits("Length");


  toggleOperators(false);


  await loadHistory();

  console.log("App initialized. Current state:", state);
});
