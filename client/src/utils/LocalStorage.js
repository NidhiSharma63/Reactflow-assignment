import { KEY_FOR_STORING_TOKEN } from "./LocalStoragekey";

// get value from local storage
export const getValueFromLS = (key) => {
  const item = localStorage.getItem(key);
  if (key === KEY_FOR_STORING_TOKEN) return item;
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
