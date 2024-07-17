import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
/////////////////////
//////////////////

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filePrec, setFilePrec] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.user.currentUser);
  const navigate = useNavigate();
  /////////////////////
  ////////////////////
  ////////////////
  console.log("this is formdata", formData);
  console.log("this is files", files);
  //////////////////////
  //////////////////////
  ///////////////////////

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      setUploading(true);
      setImageUploadError(false);
      for (let i = 0; i < files.length; i++) {
        console.log(i);
        promises.push(storageImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
          setFilePrec(0);
        })
        .catch((error) => {
          setImageUploadError("image upload filed  (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("you can uploead only 6 images");
      setUploading(false);
    }
  };

  const storageImage = async (file) => {
    return new Promise((resolve, reject) => {
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
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  ////////////////////

  /////////////////
  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("discount price must be lower then the regular price");
      setError(false);
      setLoading(true);
      const res = await fetch(`/api/listing/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center font-semibold text-3xl my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSumbit} className="flex flex-col sm:flex-row">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap mt-4">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-5">
            <div className="flex items-center gap-2">
              <input
                className="border p-3 border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="border p-3 border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border p-3 border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="50"
                max="100000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs"> ($ / Month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  className="border p-3 border-gray-300 rounded-lg"
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="100000"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs"> ($ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="ml-2 font-normal text-gray-600">
              The first image will be cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={handleFileChange}
              className="p-3 rounded w-full border border-gray-300"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              onClick={handleImageSubmit}
              type="button"
              className="p-3 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 border border-green-700"
            >
              {uploading ? "LOADING..." : "Upload"}
            </button>
          </div>
          <span>
            {filePrec > 0 && filePrec < 100 ? (
              <span className="text-slate-700">{`upload ${filePrec} %`}</span>
            ) : filePrec === 100 ? (
              <span className="text-green-700 text-lg">wait!!</span>
            ) : (
              ""
            )}
          </span>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className=" flex justify-between p-3 border items-center "
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 rounded-lg object-contain"
                />
                <button
                  type="button "
                  onClick={() => handleRemoveImage(index)}
                  className=" text-red-500 p-3 uppercase hover:opacity-75 rounded font-semibold"
                >
                  delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 mt-3 uppercase bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating ..." : "Create Listing"}
          </button>
          {error && <p className="text-sm text-red-700"> {error}</p>}
        </div>
      </form>
    </main>
  );
}
