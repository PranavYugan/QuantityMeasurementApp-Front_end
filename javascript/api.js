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
