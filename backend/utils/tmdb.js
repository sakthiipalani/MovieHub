import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY || "e7d128e53b312779145f76bba7e87cd2";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Fetch popular movies from TMDB
export async function fetchPopularMovies(page = 1) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    return [];
  }
}

// Fetch movie details by ID
export async function fetchMovieDetails(movieId) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error.message);
    return null;
  }
}

// Fetch movie credits (cast) by ID
export async function fetchMovieCredits(movieId) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return response.data.cast.slice(0, 10).map(actor => actor.name);
  } catch (error) {
    console.error("Error fetching movie credits:", error.message);
    return [];
  }
}

// Fetch genre list from TMDB
export async function fetchGenres() {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error.message);
    return [];
  }
}

// Search movies by query
export async function searchMovies(query, page = 1) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error searching movies:", error.message);
    return [];
  }
}

// Get movie poster URL
export function getPosterUrl(posterPath, size = "w500") {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

// Get movie backdrop URL
export function getBackdropUrl(backdropPath, size = "w1280") {
  if (!backdropPath) return null;
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
}

// Fetch trending movies
export async function fetchTrendingMovies(timeWindow = "week") {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error.message);
    return [];
  }
}

// Fetch top rated movies
export async function fetchTopRatedMovies(page = 1) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching top rated movies:", error.message);
    return [];
  }
}

// Fetch now playing movies
export async function fetchNowPlayingMovies(page = 1) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching now playing movies:", error.message);
    return [];
  }
}

// Fetch upcoming movies
export async function fetchUpcomingMovies(page = 1) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error.message);
    return [];
  }
}

// Transform TMDB movie to our Movie schema format
export function transformMovie(tmdbMovie, genres, cast = []) {
  return {
    tmdbId: tmdbMovie.id,
    name: tmdbMovie.title,
    image: getPosterUrl(tmdbMovie.poster_path),
    backdrop: getBackdropUrl(tmdbMovie.backdrop_path),
    year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : null,
    detail: tmdbMovie.overview,
    cast: cast,
    genre: tmdbMovie.genre_ids.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre._id : null;
    }).filter(Boolean),
    rating: tmdbMovie.vote_average,
    numReviews: tmdbMovie.vote_count,
    popularity: tmdbMovie.popularity
  };
}
