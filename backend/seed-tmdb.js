import mongoose from "mongoose";
import dotenv from "dotenv";
import Genre from "./models/Genre.js";
import Movie from "./models/Movie.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import {
  fetchGenres,
  fetchPopularMovies,
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

async function seedFromTMDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // 1. Sync genres from TMDB
    console.log("Fetching genres from TMDB...");
    const tmdbGenres = await fetchGenres();
    console.log(`Found ${tmdbGenres.length} genres from TMDB`);

    // Clear and recreate genres
    await Genre.deleteMany({});
    
    const genreDocs = [];
    for (const tmdbGenre of tmdbGenres) {
      const genreDoc = await Genre.create({
        name: tmdbGenre.name,
        tmdbId: tmdbGenre.id
      });
      genreDocs.push(genreDoc);
      console.log(`  Created genre: ${tmdbGenre.name}`);
    }

    // Create genre mapping: tmdbId -> _id
    const genreIdMap = {};
    genreDocs.forEach(g => {
      genreIdMap[g.tmdbId] = g._id;
    });

    // 2. Fetch popular movies from TMDB
    console.log("\nFetching popular movies from TMDB...");
    const tmdbMovies = await fetchPopularMovies(3); // Fetch 3 pages = 60 movies
    
    // Clear existing movies
    await Movie.deleteMany({});

    // Create movies with full details
    for (let i = 0; i < tmdbMovies.length; i++) {
      const tmdbMovie = tmdbMovies[i];
      
      // Skip movies without essential data
      if (!tmdbMovie.title || !tmdbMovie.release_date) continue;

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
        year: new Date(tmdbMovie.release_date).getFullYear(),
        genre: genreId,
        detail: tmdbMovie.overview || "No description available.",
        cast: cast,
        tmdbId: tmdbMovie.id,
        tmdbRating: tmdbMovie.vote_average,
        rating: tmdbMovie.vote_average, // Also set the main rating for backward compatibility
        numReviews: tmdbMovie.vote_count,
        popularity: tmdbMovie.popularity
      });

      if ((i + 1) % 10 === 0) {
        console.log(`  Created ${i + 1} movies...`);
      }
    }

    console.log(`\nCreated ${await Movie.countDocuments()} movies`);

    // 3. Create admin user
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    await User.create({
      username: "Admin",
      email: "admin@moviehub.com",
      password: hashedPassword,
      isAdmin: true
    });
    console.log("\nCreated admin user (admin@moviehub.com / admin123)");

    console.log("\n✅ Database seeded with live TMDB data!");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedFromTMDB();
