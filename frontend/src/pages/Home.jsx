import Header from "./Movies/Header";
import MoviesContainerPage from "./Movies/MoviesContainerPage";
import banner from "../assets/banner.jpg";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="min-h-screen bg-black/70">
        <Header />

        {/* Hero Section */}
        <div className="mt-16 ml-8 md:ml-16 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Movie<span className="text-teal-500">Hub</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-lg drop-shadow-md">
            Discover thousands of movies, read reviews, and find your next favorite film.
          </p>
        </div>

        {/* Movies Section */}
        <section className="mt-12 px-4 md:px-8 pb-8">
          <MoviesContainerPage />
        </section>

        {/* Footer */}
        <footer className="bg-black/50 py-6 mt-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2024 MovieHub. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
