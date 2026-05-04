import mongoose from "mongoose";
import dotenv from "dotenv";
import Genre from "./models/Genre.js";
import Movie from "./models/Movie.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const genres = [
  { name: "Action" },
  { name: "Adventure" },
  { name: "Animation" },
  { name: "Comedy" },
  { name: "Crime" },
  { name: "Documentary" },
  { name: "Drama" },
  { name: "Family" },
  { name: "Fantasy" },
  { name: "History" },
  { name: "Horror" },
  { name: "Music" },
  { name: "Mystery" },
  { name: "Romance" },
  { name: "Sci-Fi" },
  { name: "Thriller" },
  { name: "War" },
  { name: "Western" }
];

const movies = [
  {
    name: "Avatar: The Way of Water",
    image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    year: 2022,
    detail: "Jake Sully lives with his newfound family formed on the planet of Pandora. When a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi princess to protect their planet.",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Kate Winslet"]
  },
  {
    name: "Avengers: Endgame",
    image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    year: 2019,
    detail: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance.",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Chris Hemsworth"]
  },
  {
    name: "Spider-Man: Across the Spider-Verse",
    image: "https://image.tmdb.org/t/p/w500/8Vt6lWERzPYHL6vQryJ7c3J3JTD.jpg",
    year: 2023,
    detail: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. But when the heroes clash over how to proceed, Miles must redefine what it means to be a hero.",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Brian Tyree Henry", "Oscar Isaac"]
  },
  {
    name: "The Batman",
    image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvber9r3jtvyqZaC.jpg",
    year: 2022,
    detail: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Jeffrey Wright"]
  },
  {
    name: "Dune: Part Two",
    image: "https://image.tmdb.org/t/p/w500/1pdfLvkb6OoLGN5p6P5P5F5P5P5.jpg",
    year: 2024,
    detail: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"]
  },
  {
    name: "Oppenheimer",
    image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zRrmnJD.jpg",
    year: 2023,
    detail: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."]
  },
  {
    name: "Interstellar",
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lMU5cQ9l4h1L.jpg",
    year: 2014,
    detail: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"]
  },
  {
    name: "Inception",
    image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    year: 2010,
    detail: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"]
  },
  {
    name: "The Dark Knight",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    detail: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"]
  },
  {
    name: "Guardians of the Galaxy Vol. 3",
    image: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSr1TvmgYQXCx.jpg",
    year: 2023,
    detail: "Still reeling from the loss of Gamora, Peter Quill must rally his team around him to defend the universe along with protecting one of their own.",
    cast: ["Chris Pratt", "Zoe Saldana", "Dave Bautista", "Karen Gillan"]
  },
  {
    name: "Barbie",
    image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    year: 2023,
    detail: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    cast: ["Margot Robbie", "Ryan Gosling", "America Ferrera", "Kate McKinnon"]
  },
  {
    name: "John Wick: Chapter 4",
    image: "https://image.tmdb.org/t/p/w500/vZnpQjR6Ew9NQ1BqPmPQG3Y9c1T.jpg",
    year: 2023,
    detail: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.",
    cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård", "Laurence Fishburne"]
  },
  {
    name: "Top Gun: Maverick",
    image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpZaDOeHK0cB0nhI.jpg",
    year: 2022,
    detail: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.",
    cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Jon Hamm"]
  },
  {
    name: "Everything Everywhere All at Once",
    image: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jYykb0.jpg",
    year: 2022,
    detail: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives of alternate versions of herself.",
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan", "Jamie Lee Curtis"]
  },
  {
    name: "The Matrix Resurrections",
    image: "https://image.tmdb.org/t/p/w500/gL8oFefQ4p5lLnLtNfyN5X9l0Xj.jpg",
    year: 2021,
    detail: "Plucked from a life of domestic tranquility, Neo is drawn back into the world of the Matrix where he uncovers a startling truth: the technology that created our world may be the key to our destruction.",
    cast: ["Keanu Reeves", "Carrie-Anne Moss", "Yahya Abdul-Mateen II", "Jessica Henwick"]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Genre.deleteMany({});
    await Movie.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data");

    // Create genres
    const createdGenres = await Genre.insertMany(genres);
    console.log(`Created ${createdGenres.length} genres`);

    // Assign genre IDs to movies
    const genreMap = {};
    createdGenres.forEach((genre) => {
      genreMap[genre.name] = genre._id;
    });

// Movie genre assignments - covering all 18 genres
    const movieGenreAssignments = [
      { name: "Avatar: The Way of Water", genres: ["Sci-Fi", "Adventure", "Fantasy"] },
      { name: "Avengers: Endgame", genres: ["Action", "Sci-Fi", "Adventure"] },
      { name: "Spider-Man: Across the Spider-Verse", genres: ["Animation", "Action", "Adventure"] },
      { name: "The Batman", genres: ["Action", "Crime", "Mystery"] },
      { name: "Dune: Part Two", genres: ["Sci-Fi", "Adventure", "Drama"] },
      { name: "Oppenheimer", genres: ["Drama", "History", "Thriller"] },
      { name: "Interstellar", genres: ["Sci-Fi", "Adventure", "Drama"] },
      { name: "Inception", genres: ["Sci-Fi", "Action", "Mystery", "Thriller"] },
      { name: "The Dark Knight", genres: ["Action", "Crime", "Thriller"] },
      { name: "Guardians of the Galaxy Vol. 3", genres: ["Action", "Sci-Fi", "Comedy"] },
      { name: "Barbie", genres: ["Comedy", "Fantasy", "Family"] },
      { name: "John Wick: Chapter 4", genres: ["Action", "Crime", "Thriller"] },
      { name: "Top Gun: Maverick", genres: ["Action", "Drama", "War"] },
      { name: "Everything Everywhere All at Once", genres: ["Action", "Comedy", "Sci-Fi", "Adventure"] },
      { name: "The Matrix Resurrections", genres: ["Sci-Fi", "Action", "Thriller"] }
    ];

    // Create movies with genre references
    const moviesWithGenres = movies.map((movie) => {
      const assignment = movieGenreAssignments.find(m => m.name === movie.name);
      return {
        ...movie,
        genres: assignment.genres.map(g => genreMap[g]),
        numReviews: 0,
        rating: 0
      };
    });

    await Movie.insertMany(moviesWithGenres);
    console.log(`Created ${moviesWithGenres.length} movies`);

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    await User.create({
      username: "Admin",
      email: "admin@moviehub.com",
      password: hashedPassword,
      isAdmin: true
    });
    console.log("Created admin user (admin@moviehub.com / admin123)");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
