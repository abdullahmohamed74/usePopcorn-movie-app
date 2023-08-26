import { useEffect, useState } from 'react';
import {
  Navbar,
  Main,
  NumResults,
  MoviesList,
  WatchedSummary,
  WatchedMoviesList,
  Box,
  Search,
  Loader,
  ErrorMessage,
  MovieDetails,
} from './components';
import { useLocalStorageState } from './hooks/useLocalStorageState';

const apiKey = process.env.REACT_APP_API_KEY;

function App() {
  const [movies, setMovies] = useState([]);
  // // use callback to return the initial value of the state
  // // because it is a computated value
  // const [watched, setWatched] = useState(() => {
  //   const storedValue = JSON.parse(localStorage.getItem('watched'));
  //   return storedValue || [];
  // });

  // use "useLocalStorageState" custom hook to create a state based on the stored value
  // also to save the state to localStorage as it changes
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [query, setQuery] = useState('batman');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectedMovie = (id) => {
    setSelectedMovieId(id);
  };

  const handleCloseMovie = () => {
    setSelectedMovieId(null);
  };

  // add new movie to the watched list
  const handleAddWatchedMovie = (newWatchedMovie) => {
    setWatched((curWatched) => [...curWatched, newWatchedMovie]);
  };

  const handleDeleteWatchedMovie = (id) => {
    setWatched((curWatched) =>
      curWatched.filter((movie) => movie.imdbID !== id)
    );
  };

  // search movies on mount and every time 'query changes'
  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        // with each new request ==> reset the error
        // also show the loading
        setIsLoading(true);
        setError('');

        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
          { signal: controller.signal }
        );

        // if there is an error with the request
        if (!response.ok) {
          throw new Error('something went wrong with fetching movies');
        }

        const data = await response.json();

        // if the user is searching for a movie that does NOT exist
        if (data.Response === 'False') {
          throw new Error(`Movie not found`);
        }

        setMovies(data.Search);
        setError('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log(error.message);
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // not to make API request if search word is less than 3 letters
    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    // close movieDetails when searching for another movie
    handleCloseMovie();

    fetchMovies();

    return () => {
      // when the component rerenders cancel the previous request
      controller.abort();
    };
  }, [query]);

  // // every time 'watched' state changes ==> save it to localStorage
  // useEffect(() => {
  //   localStorage.setItem('watched', JSON.stringify(watched));
  // }, [watched]);

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList
              movies={movies}
              handleSelectedMovie={handleSelectedMovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedMovieId ? (
            <MovieDetails
              selectedMovieId={selectedMovieId}
              handleCloseMovie={handleCloseMovie}
              handleAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                handleDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

export default App;
