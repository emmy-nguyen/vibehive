"use client";

import Header from "../Header";
import ListItem from "../ListItem";

const HeaderClient = () => {
  return (
    <Header>
      <div className="mb-2">
        <h1 className="text-white text-3xl font-semibold">Welcome back</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
          <ListItem
            image="/images/Poster.jpeg"
            name="Liked Songs"
            href="liked"
          />
        </div>
      </div>
    </Header>
  );
};

export default HeaderClient;
