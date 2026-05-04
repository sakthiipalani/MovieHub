import SliderUtil from "../../component/SliderUtil";
import { useGetNewMoviesQuery } from "../../redux/api/movies";

const Header = () => {
  const { data } = useGetNewMoviesQuery();

  return (
    <div className="mt-16">
      {/* Latest Movies Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2 ml-4">
          <span className="w-2 h-8 bg-gradient-to-b from-teal-500 to-blue-500 rounded"></span>
          New Releases
        </h2>
        <SliderUtil data={data} />
      </div>
    </div>
  );
};

export default Header;
