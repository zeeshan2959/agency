import React, { useState, useEffect } from "react";

interface SwitchProps {
  status: string; // "active" or "inactive"
}

export const Switch: React.FC<SwitchProps> = ({ status }) => {
  const [isOn, setIsOn] = useState(status === "active");

  // Keep in sync if the status prop changes
  useEffect(() => {
    setIsOn(status === "active");
  }, [status]);

  return (
    <div className="flex items-center justify-center font-poppins">
      <div className="flex items-center justify-center">
        <div
          className={`relative w-[90px] h-[30px] rounded-full shadow-inner cursor-pointer transition-all duration-300 ${
            isOn ? "bg-gray-200" : "bg-gray-100"
          }`}
          onClick={() => setIsOn(!isOn)}
        >
          {/* Text label */}
          <span
            className={`absolute top-1/2 transform -translate-y-1/2 text-[12px] capitalize transition-all duration-500 ${
              isOn
                ? "right-[42px] text-green-500"
                : "left-[36px] text-gray-400"
            }`}
          >
            {isOn ? "Active" : "Inactive"}
          </span>

          {/* Knob */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 w-[27px] h-[24px] rounded-full shadow transition-transform duration-700 ${
              isOn
                ? "translate-x-[59px] bg-green-500"
                : "translate-x-1 bg-white"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};
