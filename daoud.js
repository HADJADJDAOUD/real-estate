import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  console.log(file);
  console.log("thhis is current user", currentUser);

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
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("upload " + progress + "$done");
    });
  };
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 ">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
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
        <span className="text-red-700  cursor-pointer font-semibold">
          Sign-out
        </span>
      </div>
    </div>
  );
}
