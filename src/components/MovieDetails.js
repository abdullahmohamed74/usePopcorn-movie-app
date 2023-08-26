import { useEffect, useRef, useState } from 'react';
import Loader from './Loader';
import ErrorMessage from './Error';
import StarRating from './StarRating';
import { UseKeyPressEvent } from '../hooks/UseKeyPressEvent';

const apiKey = process.env.REACT_APP_API_KEY;

function MovieDetails({
  selectedMovieId,
  handleCloseMovie,
  handleAddWatchedMovie,
  watched,
}) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(0);

  const countRateRef = useRef(0);

  const isWatched = watched.some((movie) => movie.imdbID === selectedMovieId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedMovieId
  )?.userRating;

  // fetch the movie ahen the component mount
  // or id changes
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedMovieId}`
        );

        // if there is an error with the request
        if (!response.ok) {
          throw new Error(
            'something went wrong with fetching the movie details'
          );
        }
        const data = await response.json();

        setSelectedMovie(data);
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [selectedMovieId]);

  // change page title to the fetched movie title
  useEffect(() => {
    if (!selectedMovie.Title) return;
    document.title = `Movie | ${selectedMovie.Title}`;

    // get the title back to its original each time the component unmount
    return () => {
      document.title = `usePopcorn`;
      // it has access to title because of ==> closure
      // console.log(`clean up title ${selectedMovie.Title}`);
    };
  }, [selectedMovie.Title]);

  // // globally listen to the 'keydown' event
  // useEffect(() => {
  //   const callback = (e) => {
  //     if (e.code === 'Escape') {
  //       handleCloseMovie();
  //     }
  //   };
  //   document.addEventListener('keydown', callback);

  //   // each time the component unmount ==> remove the event listener
  //   return () => {
  //     document.removeEventListener('keydown', callback);
  //   };
  // }, [handleCloseMovie]);

  UseKeyPressEvent('Escape', handleCloseMovie);

  // increase 'countRateRef.current' by 1 each time 'userRate' changes
  useEffect(() => {
    if (userRating) countRateRef.current += 1;
  }, [userRating]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const {
    Title: title,
    Poster: poster,
    Year: year,
    imdbRating,
    Runtime: runtime,
    Released: released,
    Plot: plot,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = selectedMovie;

  const handleAddMovie = () => {
    const newWatchedMovie = {
      imdbID: selectedMovieId,
      title,
      year,
      poster,
      runtime: Number(runtime.split(' ')[0]),
      imdbRating: Number(imdbRating),
      userRating,
      countRateDecisions: countRateRef.current,
    };

    // add watched movie to the list
    handleAddWatchedMovie(newWatchedMovie);
    handleCloseMovie();
  };

  return (
    <div className="details">
      <header>
        <button onClick={handleCloseMovie} className="btn-back">
          &larr;
        </button>
        <img src={poster} alt={`poster of ${title} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDB rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          {isWatched ? (
            <p>you rated this movie {watchedUserRating}⭐</p>
          ) : (
            <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button onClick={handleAddMovie} className="btn-add">
                  + Add to list
                </button>
              )}
            </>
          )}
        </div>

        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}
export default MovieDetails;
