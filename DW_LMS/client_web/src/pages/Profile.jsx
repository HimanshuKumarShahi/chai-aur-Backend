import { useUser, useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [name, setName] = useState(user?.fullName || "");
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update/${user.id}`,
        { name }
      );

      alert("Profile updated");
    } catch (err) {
      console.log(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      
      

      <div className="flex-1 p-6 max-w-xl mx-auto">
        <h1 className="text-3xl text-orange-500 mb-6">Profile</h1>

        <div className="bg-gray-900 p-6 rounded-xl space-y-4">
          
          <div>
            <p className="text-gray-400">Email</p>
            <p>{user?.primaryEmailAddress?.emailAddress}</p>
          </div>

          <div>
            <p className="text-gray-400">Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-black border border-gray-700 rounded mt-1"
            />
          </div>

          <button
            onClick={updateProfile}
            disabled={loading}
            className="bg-orange-500 text-black px-4 py-2 rounded w-full hover:bg-orange-400"
          >
            {loading ? "Updating..." : "Update Name"}
          </button>

          <button
            onClick={() => signOut()}
            className="border border-orange-500 text-orange-500 px-4 py-2 rounded w-full hover:bg-orange-500 hover:text-black"
          >
            Logout
          </button>

        </div>
      </div>

      
    </div>
  );
}