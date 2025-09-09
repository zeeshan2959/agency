import React, { useState, useEffect } from "react";

interface SwitchProps {
  id: number;
  status: string;
  changeStatus?: (id: number, status: string) => void;
}

export const Switch: React.FC<SwitchProps> = ({ id, status, changeStatus }) => {
  const [isOn, setIsOn] = useState(status === "active");

  useEffect(() => {
    setIsOn(status === "active");
  }, [status]);

  const handleToggle = () => {
    const newStatus = isOn ? "inactive" : "active";
    setIsOn(!isOn);
    if (changeStatus) {
      changeStatus(id, newStatus);
    }
  };

  return (
    <div className="flex items-center justify-center font-poppins">
      <div className="flex items-center justify-center">
        <div
          className={`relative w-[90px] h-[30px] rounded-full shadow-inner cursor-pointer transition-all duration-300 ${
            isOn ? "bg-gray-200" : "bg-gray-100"
          }`}
          onClick={handleToggle}
        >
          <span
            className={`absolute top-1/2 transform -translate-y-1/2 text-[12px] capitalize transition-all duration-500 ${
              isOn
                ? "right-[42px] text-green-500"
                : "left-[36px] text-gray-400"
            }`}
          >
            {isOn ? "Active" : "Inactive"}
          </span>

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
