/**
 * Get value from localStorage
 *
 * @param {string} key                  The key in localStorage
 * @returns {string|undefined}          The value found
 */
export function loadLocalStorageItem(key: string) {
  try {
    const serializedItem = localStorage.getItem(key);
    if (serializedItem === null) {
      return undefined;
    }
    return JSON.parse(serializedItem);
  } catch (err) {
    return undefined;
  }
}

/**
 * Remove value from localStorage
 *
 * @param {string} key                  The key used in localStorage
 */
export function removeLocaleStorageItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    // Ignore write errors.
  }
}

/**
 * Set value in localStorage
 *
 * @param {string} key                  The key used in localStorage
 * @param {string|object|JSON} value    The value saved
 */
export function saveLocaleStorageItem(key: string, value: string | object | JSON) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    // Ignore write errors.
  }
}

export function clearLocaleStorage() {
  localStorage.clear();
}
