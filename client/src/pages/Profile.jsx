import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user.user);

  console.log("thhis is current user", currentUser);
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 ">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.data.user.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white  rounded-lg p-3 hover:opacity-95 uppercase disabled:opacity-80">
          update
        </button>
      </form>
      <div className="justify-between flex mt-5">
        <span className="text-red-700  cursor-pointer font-semibold">
          Delete Account
        </span>
        <span className="text-red-700  cursor-pointer font-semibold">Sign-out</span>
      </div>
    </div>
  );
}
