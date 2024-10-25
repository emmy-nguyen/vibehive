"use client";
import { getSession, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

const Profile = () => {
  const { data: session } = useSession();
  console.log(session);
  //   const [songs, setSongs] = useState([]);
  //   const [loading, setLoading] = useState(true);

  //   // Fetch songs data from the backend (example: /api/songs)
  //   useEffect(() => {
  //     const fetchSongs = async () => {
  //       try {
  //         const response = await fetch('/api/songs'); // Adjust this endpoint based on your backend
  //         const data = await response.json();
  //         setSongs(data);
  //       } catch (error) {
  //         console.error("Error fetching songs:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchSongs();
  //   }, []);

  //   if (loading) {
  //     return <p className="text-center text-white">Loading songs...</p>;
  //   }

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      {/* Header */}
      <header className="flex items-end justify-between p-6 h-80 bg-gradient-to-b from-neutral-500 to-black shadow-md rounded-lg">
        <div className="flex items-center">
          <img
            src="/images/defaultAvatar.jpeg"
            alt="User Avatar"
            className="w-36 h-36 rounded-full"
          />
          <div className="ml-6">
            <h1 className="text-6xl font-semibold">{session?.user.email}</h1>
          </div>
        </div>
        <button className="bg-white hover:bg-yellow-500 hover:text-white text-neutral-900 py-2 px-4 rounded-lg font-semibold">
          Edit Profile
        </button>
      </header>
    </div>
  );
};

export default Profile;
