import { useEffect } from 'react';

function UseKeyPressEvent(key, action) {
  // globally listen to the 'keydown' event
  useEffect(() => {
    const callback = (e) => {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    };
    document.addEventListener('keydown', callback);

    // each time the component unmount ==> remove the event listener
    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [key, action]);
}
export { UseKeyPressEvent };
