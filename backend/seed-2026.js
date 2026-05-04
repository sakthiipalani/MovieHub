import mongoose from "mongoose";
import dotenv from "dotenv";
import Genre from "./models/Genre.js";
import Movie from "./models/Movie.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import {
  fetchGenres,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchMovieCredits,
  getPosterUrl,
  getBackdropUrl
} from "./utils/tmdb.js";

dotenv.config();

// TMDB genre ID to our genre name mapping
const genreMapping = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

async function seed2026Movies() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // 1. Ensure genres exist
    console.log("Checking genres...");
    let genres = await Genre.find();
    
    if (genres.length === 0) {
      console.log("Fetching genres from TMDB...");
      const tmdbGenres = await fetchGenres();
      
      for (const tmdbGenre of tmdbGenres) {
        await Genre.create({
          name: tmdbGenre.name,
          tmdbId: tmdbGenre.id
        });
      }
      genres = await Genre.find();
      console.log(`Created ${genres.length} genres`);
    }

    // Create genre mapping: tmdbId -> _id
    const genreIdMap = {};
    genres.forEach(g => {
      if (g.tmdbId) {
        genreIdMap[g.tmdbId] = g._id;
      } else {
        // Map by name if tmdbId not set
        const nameMap = {
          "Action": 28, "Adventure": 12, "Animation": 16, "Comedy": 35,
          "Crime": 80, "Documentary": 99, "Drama": 18, "Family": 10751,
          "Fantasy": 14, "History": 36, "Horror": 27, "Music": 10402,
          "Mystery": 9648, "Romance": 10749, "Sci-Fi": 878, "Thriller": 53,
          "War": 10752, "Western": 37
        };
        const id = nameMap[g.name];
        if (id) genreIdMap[id] = g._id;
      }
    });

    // 2. Fetch movies from TMDB (upcoming and now playing)
    console.log("\nFetching movies from TMDB...");
    
    // Fetch multiple pages to get more movies
    const upcomingMovies = await fetchUpcomingMovies(1);
    const nowPlaying = await fetchNowPlayingMovies(1);
    
    // Combine and dedupe movies
    const allMoviesMap = new Map();
    
    [...upcomingMovies, ...nowPlaying].forEach(movie => {
      if (!allMoviesMap.has(movie.id)) {
        allMoviesMap.set(movie.id, movie);
      }
    });
    
    const tmdbMovies = Array.from(allMoviesMap.values());
    console.log(`Found ${tmdbMovies.length} movies from TMDB`);

    // 3. Update existing movies to 2026 or add new ones
    console.log("\nSeeding movies as 2026 releases...");
    
    let addedCount = 0;
    let updatedCount = 0;
    
    for (let i = 0; i < tmdbMovies.length; i++) {
      const tmdbMovie = tmdbMovies[i];
      
      // Skip movies without essential data
      if (!tmdbMovie.title) continue;

      // Check if movie already exists
      const existing = await Movie.findOne({ tmdbId: tmdbMovie.id });
      if (existing) {
        // Map TMDB genre IDs to our genre ObjectIds
        const genreIds = tmdbMovie.genre_ids
          .map(tmdbId => genreIdMap[tmdbId])
          .filter(Boolean);
        
        const genreId = genreIds.length > 0 ? genreIds[0] : genreIdMap[28];
        
        // Update to 2026
        await Movie.findByIdAndUpdate(existing._id, {
          year: 2026,
          genres: genreIds.length > 0 ? genreIds : [genreId]
        });
        
        updatedCount++;
        console.log(`  Updated: ${tmdbMovie.title} -> 2026`);
        continue;
      }

      // Fetch full cast
      let cast = [];
      try {
        cast = await fetchMovieCredits(tmdbMovie.id);
      } catch (e) {
        console.log(`  Could not fetch cast for ${tmdbMovie.title}`);
      }

      // Map TMDB genre IDs to our genre ObjectIds
      const genreIds = tmdbMovie.genre_ids
        .map(tmdbId => genreIdMap[tmdbId])
        .filter(Boolean);

      // Use first genre if available, otherwise use Action as default
      const genreId = genreIds.length > 0 ? genreIds[0] : genreIdMap[28];

      const movieDoc = await Movie.create({
        name: tmdbMovie.title,
        image: getPosterUrl(tmdbMovie.poster_path),
        backdrop: getBackdropUrl(tmdbMovie.backdrop_path),
        year: 2026, // Set year to 2026 for newly released/upcoming movies
        genres: genreIds.length > 0 ? genreIds : [genreId],
        detail: tmdbMovie.overview || "No description available.",
        cast: cast,
        tmdbId: tmdbMovie.id,
        tmdbRating: tmdbMovie.vote_average,
        rating: tmdbMovie.vote_average,
        numReviews: tmdbMovie.vote_count,
        popularity: tmdbMovie.popularity
      });

      addedCount++;
      console.log(`  Added: ${tmdbMovie.title} (2026)`);

      if (addedCount >= 20) {
        console.log("  Reached 20 movies limit for this batch");
        break;
      }
    }

    console.log(`\nTotal: ${updatedCount} updated, ${addedCount} added as 2026 movies`);
    console.log(`Total movies in database: ${await Movie.countDocuments()}`);

    process.exit(0);

  } catch (error) {
    console.error("Error seeding 2026 movies:", error);
    process.exit(1);
  }
}

seed2026Movies();
