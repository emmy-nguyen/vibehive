import React, { useState, useEffect } from "react";

export default async function Profile({
  user,
}: {
  user: {
    username?: string | null;
  };
}) {
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
            <h1 className="text-6xl font-semibold">{user.username}</h1>
          </div>
        </div>
        <button className="bg-white hover:bg-yellow-500 hover:text-white text-neutral-900 py-2 px-4 rounded-lg font-semibold">
          Edit Profile
        </button>
      </header>
    </div>
  );
}
