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
