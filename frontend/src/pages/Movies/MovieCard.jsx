import { Link } from "react-router-dom";

const MovieCard = ({ movie, variant = "default" }) => {
  // Variant styles: 'default' for grid, 'slider' for carousel, 'compact' for horizontal list
  const variantStyles = {
    default: {
      container: "w-full min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px]",
      image: "aspect-[2/3]",
      content: "p-1.5",
    },
    slider: {
      container: "w-full min-w-[110px] sm:min-w-[130px] md:min-w-[150px]",
      image: "aspect-[2/3]",
      content: "p-1",
    },
    compact: {
      container: "w-full min-w-[80px] sm:min-w-[100px]",
      image: "aspect-[2/3]",
      content: "p-1",
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <div
      key={movie._id}
      className={`relative group overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-1 ${styles.container}`}
    >
      <Link to={`/movies/${movie._id}`} className="block">
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden">
          <img
            src={movie.image}
            alt={movie.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${styles.image}`}
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Hover Content - Rating & Quick Info */}
          <div className="absolute top-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            {movie.rating && (
              <span className="flex items-center gap-1 bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded-full">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-5.756 4.635 1.123 6.545z" />
                </svg>
                {movie.rating}
              </span>
            )}
            {movie.year && (
              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {movie.year}
              </span>
            )}
          </div>

          {/* Play Button on Hover for Movies with preview/trailer */}
          {movie.previewUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button className="w-14 h-14 rounded-full bg-teal-500/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                <svg className="w-6 h-6 fill-white ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className={styles.content}>
          <h3 className="text-white font-semibold text-sm truncate group-hover:text-teal-400 transition-colors duration-300">
            {movie.name}
          </h3>
          
          {/* Genre Tags */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full"
                >
                  {typeof genre === "object" ? genre.name : genre}
                </span>
              ))}
              {movie.genres.length > 2 && (
                <span className="text-xs text-gray-500">+{movie.genres.length - 2}</span>
              )}
            </div>
          )}

          {/* Description - Show on hover for default variant */}
          {variant === "default" && movie.detail && (
            <p className="text-gray-400 text-xs mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {movie.detail}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
