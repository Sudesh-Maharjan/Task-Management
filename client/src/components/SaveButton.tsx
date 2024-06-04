import React, { useState } from "react";
import { MdDone } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { IoIosSave } from "react-icons/io";
const SaveButton: React.FC<{
  saveColors: () => void;
  loading: boolean;
}> = ({ saveColors, loading }) => {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(false);
    await saveColors();
    setSaved(true);
  };

  return (
    <Button
      variant="purple"
      className="flex justify-center items-center gap-1 w-14 mb-1"
      onClick={handleSave}
    >
     {loading ? (
        <svg
          className="animate-spin h-5 w-5 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V2.5A1.5 1.5 0 0010.5 1h-5A1.5 1.5 0 004 2.5V12zm2 0a6 6 0 016-6V3a1 1 0 00-1-1H5a1 1 0 00-1 1v3a1 1 0 001 1z"
          ></path>
        </svg>
       ) : null}
      <IoIosSave className="text-xl"/>{" "}
      <span className={`text-xl ${saved ? "" : "hidden"}`}>
        <MdDone />
      </span>
    </Button>
  );
};

export default SaveButton;
