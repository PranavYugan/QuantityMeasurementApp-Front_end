const BASE_URL = "http://localhost:3000";

async function getUnits(type) {
  try {
    const res = await fetch(`${BASE_URL}/units?type=${type.toLowerCase()}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      return null;
    }
    throw err;
  }
}

async function getHistory() {
  try {
    const res = await fetch(`${BASE_URL}/history?_sort=timestamp&_order=desc`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Unable to load history:", err);
    return [];
  }
}

async function getConversion(from, to) {
  try {
    if (from === to) {
      return { from, to, factor: 1, formula: "value * 1" };
    }

    const res = await fetch(`${BASE_URL}/conversions?from=${from}&to=${to}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json(); 
    
    if (!data.length) {
      throw new Error("Conversion not available for this pair");
    }
    
    return data[0];
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Conversion not available for this pair");
    }
    throw err;
  }
}

async function saveHistory(record) {
  try {
    const res = await fetch(`${BASE_URL}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    return await res.json();
  } catch (err) {
    console.warn("Unable to save history:", err);
    return null;
  }
}

function applyConversion(value, convObj) {
  if (isNaN(value)) {
    throw new Error("Invalid number");
  }

  if (convObj.factor !== null) {
    return parseFloat((value * convObj.factor).toFixed(6));
  } else {
    try {
      const expr = convObj.formula.replace(/value/g, value);
      return parseFloat(eval(expr).toFixed(6));
    } catch (err) {
      throw new Error("Bad formula");
    }
  }
}

function compareValues(v1, u1, v2, u2, base1, base2) {
  if (isNaN(v1) || isNaN(v2)) {
    return "Invalid values — cannot compare";
  }

  if (base1 > base2) {
    return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
  } else if (base1 < base2) {
    return `${v1} ${u1} is LESS than ${v2} ${u2}`;
  } else {
    return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
  }
}
