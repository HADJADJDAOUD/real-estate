import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../Firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      console.log("daoud in ouath");
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log('result in outh',result);
      console.log("before in outh");
      const res = await fetch("http://localhost:3000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      console.log("after fetching in outh");
      const data = await res.json();
      console.log("entered the sunbit funciton in oath");
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log(error, "we clouldnt sign with google in oath");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-500 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      {" "}
      Continue With Google
    </button>
  );
}
