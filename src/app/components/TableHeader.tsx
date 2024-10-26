import React from "react";
import { BsGear } from "react-icons/bs";

export default function TableHeader() {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-player mx-auto py-2 px-4 mb-2 border-b-[1px] border-neutral-700">
        <span className="col-span-1  text-neutral-500">#</span>
        <span className="col-span-5  text-neutral-500">TITLE</span>
        <span className="col-span-5  text-neutral-500">ARTIST</span>
        <span className="col-span-1  text-neutral-500">
          <BsGear size="20px" />
        </span>
      </div>
    </div>
  );
}
