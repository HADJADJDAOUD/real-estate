import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        //  if (data.success === false) {
        //    console.log(data.message);
        //    setError(data.message);
        //    setLoading(false);
        //    return;
        //  }
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex  flex-col gap-4">
          <p>
            {" "}
            Contact <span className="font-semibold">
              {landlord.username}
            </span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border rounded-lg p-3"
            name="message"
            id="message"
            rows="2"
            value={message}
            placeholder="enter your message here "
            onChange={onChange}
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            to={`mailto:${landlord.email}?subject = regarding ${listing.name}& body=${message}`}
          >
            send message
          </Link>
        </div>
      )}
    </>
  );
}
