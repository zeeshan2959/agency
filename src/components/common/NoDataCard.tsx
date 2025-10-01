import React from "react";
import { Link } from "react-router-dom";
type Props = {
    buttonText?: string;
    buttonLink?: string;
};

const NoDataCard: React.FC<Props> = ({buttonText,buttonLink}:Props) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 p-8 shadow-sm dark:border-gray-600 bg-white dark:bg-gray-800">
      <img
        src="/assets/images/no-data.jpg"
        alt="No Data"
        className="w-32 h-32 object-contain"
      />
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          No Data Found
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          There is no data available. Please add new data to get started.
        </p>
      </div>
      <Link
        to={buttonLink || "#"}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-white shadow-md hover:bg-primary/90 transition"
      >
        {buttonText || "Add New Data"}
      </Link>
    </div>
  );
};

export default NoDataCard;
