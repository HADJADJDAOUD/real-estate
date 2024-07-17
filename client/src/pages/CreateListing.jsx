import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filePrec, setFilePrec] = useState(0);
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

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center font-semibold text-3xl my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            maxLength="62"
            minLength="10"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
          />
          <div className="flex gap-6 flex-wrap mt-4">
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="sale" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="parkingSpot" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="offer" />
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
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="border p-3 border-gray-300 rounded-lg"
                type="number"
                id="baths"
                min="1"
                max="10"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border p-3 border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="1"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs"> ($ / Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border p-3 border-gray-300 rounded-lg"
                type="number"
                id="discountedPrice"
                min="1"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs"> ($ / Month)</span>
              </div>
            </div>
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
          <button className="p-3 mt-3 uppercase bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
