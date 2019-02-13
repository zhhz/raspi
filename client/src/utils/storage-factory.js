function storageFactory(storage) {
  try {
    storage = storage || window.localStorage || window.sessionStorage;
  } catch(e) {
    storage = {};
  }

  let inMemoryStorage = {};

  function isSupported() {
    try {
      const key = "__some_random_key_you_are_not_going_to_use__";
      storage.setItem(key, key);
      storage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getItem(key) {
    if (isSupported()) {
      return storage.getItem(key);
    }
    return inMemoryStorage[key] || null;
  }

  function setItem(key, value) {
    if (isSupported()) {
      storage.setItem(key, value);
    } else {
      inMemoryStorage[key] = '' + value;
    }
  }

  function removeItem(key) {
    if (isSupported()) {
      storage.removeItem(key);
    } else {
      delete inMemoryStorage[key];
    }
  }

  function clear(key) {
    if (isSupported()) {
      storage.clear();
    } else {
      inMemoryStorage = {};
    }
  }

  function key(n) {
    if (isSupported()) {
      return storage.key(n);
    } else {
       return Object.keys(inMemoryStorage)[n] || null;
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    key,
  };
}

export default storageFactory;
