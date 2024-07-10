import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSumbit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/signIn");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">SignUp</h1>
      <form onSubmit={handleSumbit} className="flex flex-col  gap-4 ">
        <input
          className="border p-3 rounded-lg"
          id="username"
          type="text"
          placeholder="username"
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg"
          id="email"
          type="text"
          placeholder="email"
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg"
          id="password"
          type="text"
          placeholder="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="rounded-lg bg-slate-700 text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account? </p>
        <Link to="/signIn">
          <span className="text-blue-700 ">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-5 ">{error}</p>}
    </div>
  );
}
