import { useEffect, useState } from 'react';

function useLocalStorageState(initialState, key) {
  // use callback to return the initial value of the state
  // because it is a computated value
  const [value, setValue] = useState(() => {
    const storedValue = JSON.parse(localStorage.getItem(key));
    return storedValue || initialState;
  });

  // every time 'value' state changes ==> save it to "key" in localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
export { useLocalStorageState };
