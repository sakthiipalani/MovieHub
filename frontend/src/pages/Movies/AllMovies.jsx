import { useGetAllMoviesQuery } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";
import MovieCard from "./MovieCard";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import banner from "../../assets/banner.jpg";
import {
  setMoviesFilter,
  setFilteredMovies,
  setMovieYears,
  setUniqueYears,
} from "../../redux/features/movies/moviesSlice";

const AllMovies = () => {
  const dispatch = useDispatch();
  const { data } = useGetAllMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();

  const { moviesFilter, filteredMovies } = useSelector((state) => state.movies);

  const movieYears = data?.map((movie) => movie.year);
  const uniqueYears = Array.from(new Set(movieYears));

  useEffect(() => {
    dispatch(setFilteredMovies(data || []));
    dispatch(setMovieYears(movieYears));
    dispatch(setUniqueYears(uniqueYears));
  }, [data, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setMoviesFilter({ searchTerm: e.target.value }));

    const filteredMovies = data.filter((movie) =>
      movie.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    dispatch(setFilteredMovies(filteredMovies));
  };

const handleGenreClick = (genreId) => {
    const filterByGenre = data.filter((movie) => {
      // Check if movie has genres array (new format) or single genre (old format)
      if (movie.genres && Array.isArray(movie.genres)) {
        return movie.genres.some(g => {
          const gId = g?._id || g;
          return gId?.toString() === genreId?.toString();
        });
      }
      // Fallback for old single genre format
      return movie.genre === genreId;
    });
    dispatch(setFilteredMovies(filterByGenre));
  };

  const handleYearChange = (year) => {
    const filterByYear = data.filter((movie) => movie.year === +year);
    dispatch(setFilteredMovies(filterByYear));
  };

  const handleSortChange = (sortOption) => {
    switch (sortOption) {
      case "new":
        dispatch(setFilteredMovies(newMovies));
        break;
      case "top":
        dispatch(setFilteredMovies(topMovies));
        break;
      case "random":
        dispatch(setFilteredMovies(randomMovies));
        break;

      default:
        dispatch(setFilteredMovies([]));
        break;
    }
  };

return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div
        className="relative h-[60vh] w-full flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/70 to-black/80"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">The Movies Hub</h1>
          <p className="text-lg md:text-xl">
            Cinematic Odyssey: Unveiling the Magic of Movies
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-gray-900 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <input
            type="text"
            className="w-full max-w-md mx-auto block h-12 px-4 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Movie"
            value={moviesFilter.searchTerm}
            onChange={handleSearchChange}
          />
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <select
              className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={moviesFilter.selectedGenre}
              onChange={(e) => handleGenreClick(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres?.map((genre) => (
                <option key={genre._id} value={genre._id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={moviesFilter.selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={moviesFilter.selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="new">New Movies</option>
              <option value="top">Top Movies</option>
              <option value="random">Random Movies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMovies?.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllMovies;
