import { useRef } from 'react';
import { UseKeyPressEvent } from '../hooks/UseKeyPressEvent';

function Search({ query, setQuery }) {
  const inputEl = useRef();

  // useEffect(() => {
  //   const callback = (e) => {
  //     if (e.code === 'Enter') {
  //       // if the input already focused ==> don't reset the input
  //       if (document.activeElement === inputEl.current) return;
  //       // click on Enter key ==> focus input
  //       inputEl.current.focus();
  //       // reset the input
  //       setQuery('');
  //     }
  //   };
  //   document.addEventListener('keydown', callback);

  //   return () => document.removeEventListener('keydown', callback);
  // }, [setQuery]);

  UseKeyPressEvent('Enter', () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

export default Search;
