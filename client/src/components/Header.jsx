import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
export default function Header() {
  const { currentUser } = useSelector((state) => state.user.user);
  console.log("this is current user", currentUser);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex items-center justify-between md:pl-20 md:pr-20 mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex ">
          <span className="text-slate-500">Sahand</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center ">
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent focus:outline-none w-32 sm:w-52 lg:w-96"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4 text-xl ">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              About
            </li>
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt=" profile picture"
                className=" rounded-full h-9 w-9 object-cover "
              />
            ) : (
              <li className="text-slate-700 hover:underline cursor-pointer">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
