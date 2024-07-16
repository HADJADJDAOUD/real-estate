export default function CreateListing() {
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
            className="border p-3 rounded-lg "
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg "
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id="name"
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
              <span>parking Spot</span>
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
          <div className=" flex flex-wrap  gap-6 mt-5 ">
            <div className="flex items-center gap-2">
              <input
                className="border p-3 border-gray-300 rounded-lg "
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
                className="border p-3 border-gray-300 rounded-lg "
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
                className="border p-3 border-gray-300 rounded-lg "
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs"> ($ / Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border p-3 border-gray-300 rounded-lg "
                type="number"
                id="DiscountedPrice"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs"> ($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col flex-1 gap-4">
          <p className="font-semibold ">
            Images:
            <span className="ml-2 font-normal text-gray-600">
              the first image will be cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 rounded w-full border border-gray-300"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 text-green-700 rounded uppercase  hover:shadow-lg disabled:opacity-80 border border-green-700 ">
              Upload
            </button>
          </div>
          <button className="p-3 mt-3 uppercase bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
