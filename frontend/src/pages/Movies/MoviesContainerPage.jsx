import { useState, useMemo } from "react";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";

import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../component/SliderUtil";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

const MoviesContainerPage = () => {
  const { data: allMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
  };

// Filter movies by selected genre - handle both populated genres array and genre ID
  const filteredMovies = useMemo(() => {
    if (!allMovies || !selectedGenre) return allMovies || [];
    
    return allMovies.filter((movie) => {
      // Check if movie has genres array (new format) or single genre (old format)
      if (movie.genres && Array.isArray(movie.genres)) {
        return movie.genres.some(g => {
          const genreId = g?._id || g;
          return genreId?.toString() === selectedGenre?.toString();
        });
      }
      // Fallback for old single genre format
      const movieGenreId = movie.genre?._id || movie.genre;
      return movieGenreId?.toString() === selectedGenre?.toString();
    });
  }, [allMovies, selectedGenre]);

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 p-4">
      {/* Genre Sidebar - Fixed on mobile scroll, sidebar on desktop */}
      <div className="sticky top-20 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 z-10 bg-black/50 p-2 rounded-lg">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
            selectedGenre === null
              ? "bg-teal-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => handleGenreClick(null)}
        >
          All Genres
        </button>
        {genres?.map((g) => (
          <button
            key={g._id}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              selectedGenre === g._id
                ? "bg-teal-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => handleGenreClick(g._id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Movies Sections */}
      <div className="flex flex-col gap-10 w-full">
        {/* Choose For You */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <span className="w-2 h-8 bg-teal-500 rounded"></span>
            Choose For You
          </h2>
          <SliderUtil data={randomMovies} />
        </div>

        {/* Top Movies */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-teal-500 to-blue-500 rounded"></span>
            Top Movies
</h2>
          <SliderUtil data={topMovies} />
        </div>

        {/* New Releases - Recently Added Movies */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <span className="w-2 h-8 bg-pink-500 rounded"></span>
            New Releases
          </h2>
          <SliderUtil data={allMovies} />
        </div>

        {/* Choose Movie - Shows filtered movies vertically with details */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <span className="w-2 h-8 bg-purple-500 rounded"></span>
            {selectedGenre 
              ? `Selected: ${genres?.find(g => g._id === selectedGenre)?.name || 'Movies'}`
              : 'Choose Movie'}
          </h2>
          {filteredMovies.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredMovies.map((movie) => (
                <Link 
                  key={movie._id} 
                  to={`/movies/${movie._id}`}
                  className="flex items-start gap-4 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800 transition group"
                >
                  {/* Movie Poster */}
                  <div className="flex-shrink-0 w-20 sm:w-24">
                    <img 
                      src={movie.image} 
                      alt={movie.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  {/* Movie Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base sm:text-lg group-hover:text-teal-400 transition truncate">
                      {movie.name}
                    </h3>
                    
                    {/* Year and Rating */}
                    <div className="flex items-center gap-3 mt-1">
                      {movie.year && (
                        <span className="text-gray-400 text-sm">{movie.year}</span>
                      )}
                      {movie.rating && (
                        <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-5.756 4.635 1.123 6.545z" />
                          </svg>
                          {movie.rating}
                        </span>
                      )}
                    </div>
                    
                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.genres.slice(0, 3).map((genre, index) => (
                          <span 
                            key={index}
                            className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full"
                          >
                            {typeof genre === "object" ? genre.name : genre}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Description */}
                    {movie.detail && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {movie.detail}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 py-8 text-center">
              No movies found in this genre
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesContainerPage;
