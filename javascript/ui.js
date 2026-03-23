function populateDropdown(selectEl, units) {
  if (!selectEl) {
    console.warn("selectEl is null or invalid");
    return;
  }

  selectEl.innerHTML = "";

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "-- Select Unit --";
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  selectEl.appendChild(defaultOpt);

  if (Array.isArray(units)) {
    units.forEach(u => {
      const opt = document.createElement("option");
      opt.value = u.symbol;
      opt.textContent = `${u.label} (${u.symbol})`;
      selectEl.appendChild(opt);
    });
  }
}

function setActive(parentEl, clickedEl, childSelector) {
  if (!parentEl) {
    return;
  }

  parentEl.querySelectorAll(childSelector).forEach(el => el.classList.remove("active"));
  clickedEl.classList.add("active");
}

function showResult(value, unitSymbol) {
  const resultValueEl = document.querySelector("#result-value");
  const resultUnitEl = document.querySelector("#result-unit");

  resultValueEl.textContent = value !== null ? value : "—";
  resultUnitEl.textContent = unitSymbol;

  resultValueEl.classList.add("highlight");
  setTimeout(() => {
    resultValueEl.classList.remove("highlight");
  }, 1500);
}

function toggleOperators(show) {
  const operatorSelector = document.querySelector("#operator-selector");
  if (!operatorSelector) {
    console.warn("Element #operator-selector not found");
    return;
  }

  operatorSelector.style.display = show ? "flex" : "none";
}

function renderHistory(records) {
  const list = document.querySelector("#history-list");
  list.innerHTML = "";

  records = records || [];

  if (!records.length) {
    list.innerHTML = "<li>No history yet.</li>";
    return;
  }

  records.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.expression}  =  ${r.result}  (${new Date(r.timestamp).toLocaleString()})`;
    list.appendChild(li);
  });
}
