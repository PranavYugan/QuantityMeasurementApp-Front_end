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
    const res = await fetch(`${BASE_URL}/history`);
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
