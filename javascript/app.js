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
