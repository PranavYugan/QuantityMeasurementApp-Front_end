async function handleTypeCardClick() {
  const typeCards = document.querySelectorAll(".type-card");
  const typeSelector = document.querySelector(".type-selector");
  const fromInput = document.querySelector(".from-input");
  const toInput = document.querySelector(".to-input");
  const fromSelect = document.querySelector(".from-select");
  const toSelect = document.querySelector(".to-select");

  typeCards.forEach(card => {
    card.addEventListener("click", async () => {
      state.type = card.dataset.type;
      setActive(typeSelector, card, ".type-card");
      
      fromInput.value = "";
      toInput.value = "";
      showResult(0, "");

      try {
        const units = await getUnits(state.type);
        if (units) {
          populateDropdown(fromSelect, units);
          populateDropdown(toSelect, units);
        }
      } catch (err) {
        console.error("Error loading units:", err);
        showBanner("Failed to load units");
      }

      state.fromUnit = "";
      state.toUnit = "";
    });
  });
}

function handleActionTabClick() {
  const actionButtons = document.querySelectorAll(".action-btn");
  const actionSelector = document.querySelector(".action-selector");

  actionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      state.action = btn.dataset.action;
      setActive(actionSelector, btn, ".action-btn");
      toggleOperators(state.action === "Arithmetic");
      showResult(0, "");
    });
  });
}

async function calculate() {
  try {
    if (!state.fromVal || !state.fromUnit || !state.toUnit) {
      return;
    }

    let result;
    let expression;

    if (state.action === "Conversion") {
      const conv = await getConversion(state.fromUnit, state.toUnit);
      result = applyConversion(state.fromVal, conv);
      expression = `${state.fromVal} ${state.fromUnit} to ${state.toUnit}`;
      showResult(result, state.toUnit);
    } else if (state.action === "Comparison") {
      if (!state.toVal) return;
      const conv1 = await getConversion(state.fromUnit, state.fromUnit);
      const conv2 = await getConversion(state.toUnit, state.toUnit);
      const base1 = applyConversion(state.fromVal, conv1);
      const base2 = applyConversion(state.toVal, conv2);
      result = compareValues(state.fromVal, state.fromUnit, state.toVal, state.toUnit, base1, base2);
      expression = `${state.fromVal} ${state.fromUnit} vs ${state.toVal} ${state.toUnit}`;
      showResult(result, "");
    } else if (state.action === "Arithmetic") {
      if (!state.toVal || !state.operator) return;
      const conv = await getConversion(state.toUnit, state.fromUnit);
      const v2Normalised = applyConversion(state.toVal, conv);
      result = performArithmetic(state.fromVal, v2Normalised, state.operator);
      expression = `${state.fromVal} ${state.fromUnit} ${state.operator} ${state.toVal} ${state.toUnit}`;
      showResult(result, state.fromUnit);
    }

    const record = {
      type: state.type,
      action: state.action,
      expression: expression,
      result: result,
      timestamp: new Date().toISOString()
    };

    await saveHistory(record);
    const history = await getHistory();
    renderHistory(history);
  } catch (err) {
    showResult("Error: " + err.message, "");
  }
}
