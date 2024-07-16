import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase";
export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePrec, setFilePrec] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { loading, currentUser, error } = useSelector(
    (state) => state.user.user
  );
  console.log(file);
  console.log(formData);
  // console.log("thhis is current user", currentUser);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePrec(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };
  console.log(filePrec);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const dispatch = useDispatch();
  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 ">Profile</h1>
      <form onSubmit={handleSumbit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer"
        />
        <p className=" text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-500">Error Image Upload</span>
          ) : filePrec > 0 && filePrec < 100 ? (
            <span className="text-slate-700">{`upload ${filePrec} %`}</span>
          ) : filePrec === 100 ? (
            <span className="text-green-700 text-lg">
              image successfully uploaded!
            </span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          defaultValue={formData.username || currentUser.username}
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          defaultValue={formData.email || currentUser.email}
          id="email"
          onChange={handleChange}
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="password"
          onChange={handleChange}
          placeholder="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white  rounded-lg p-3 hover:opacity-95 uppercase disabled:opacity-80"
        >
          {loading ? "Loading.." : "Update"}
        </button>
      </form>
      <div className="justify-between flex mt-5">
        <span className="text-red-700  cursor-pointer font-semibold">
          Delete Account
        </span>
        <span className="text-red-700  cursor-pointer font-semibold">
          Sign-out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5 text-center">
        {updateSuccess ? "User updated succesfully" : ""}
      </p>
    </div>
  );
}
