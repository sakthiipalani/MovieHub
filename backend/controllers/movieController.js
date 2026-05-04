  import Movie from "../models/Movie.js";

const createMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.json(savedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate("genres");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpecificMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const specificMovie = await Movie.findById(id).populate("genres");
    if (!specificMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(specificMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const movieReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      const alreadyReviewed = movie.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Movie already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      
      // Calculate average rating from user reviews
      const userRating = movie.reviews.length > 0
        ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) / movie.reviews.length
        : 0;
      
      // Use TMDB rating if no user reviews yet, otherwise use user rating
      movie.rating = movie.reviews.length > 0 ? userRating : (movie.tmdbRating || 0);

      await movie.save();
      res.status(201).json({ message: "Review Added" });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteMovie = await Movie.findByIdAndDelete(id);
    if (!deleteMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json({ message: "Movie Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { movieId, reviewId } = req.body;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const reviewIndex = movie.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    movie.reviews.splice(reviewIndex, 1);
    movie.numReviews = movie.reviews.length;
    
    // Recalculate rating
    movie.rating = movie.reviews.length > 0
      ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) / movie.reviews.length
      : (movie.tmdbRating || 0);

    await movie.save();
    res.json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getNewMovies = async (req, res) => {
  try {
    // Sort by createdAt (release date) to show newest movies first
    const newMovies = await Movie.find().sort({ createdAt: -1 }).limit(10).populate("genres");
    res.json(newMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopMovies = async (req, res) => {
  try {
    const topRatedMovies = await Movie.find()
      .sort({ rating: -1, numReviews: -1 })
      .limit(10)
      .populate("genres");
    res.json(topRatedMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRandomMovies = async (req, res) => {
  try {
    const movies = await Movie.aggregate([
      { $sample: { size: 10 } },
      { $lookup: { from: "genres", localField: "genres", foreignField: "_id", as: "genres" } }
    ]);
    // Only unwind if genres array is not empty
    const randomMovies = movies.map(movie => 
      movie.genres && movie.genres.length > 0 
        ? { ...movie, genres: movie.genres[0] }
        : movie
    );
    res.json(randomMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
};
