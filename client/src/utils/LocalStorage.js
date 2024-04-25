// get value from local storage
export const getValueFromLS = (key) => {
  const item = localStorage.getItem(key);
  return JSON.parse(item);
};

// set value to ls
export const setValueToLs = (key, value) => {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
};
