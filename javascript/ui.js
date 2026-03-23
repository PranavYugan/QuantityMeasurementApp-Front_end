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
