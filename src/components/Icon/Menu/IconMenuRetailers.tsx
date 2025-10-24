import { FC } from "react";

interface IconMenuRetailerProps {
  className?: string;
}

const IconMenuRetailer: FC<IconMenuRetailerProps> = ({ className }) => {
  return (
    <svg
      className={className}
      height="20"
      width="20"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M496 128H16c-8.8 0-16 7.2-16 16v48c0 17.7 14.3 32 32 32v224c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32V224c17.7 0 32-14.3 32-32v-48c0-8.8-7.2-16-16-16zM64 448V224h384v224H64zM32 160h448v32H32v-32z" />
      <path d="M144 256c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32h-96zm80 112h-64v-64h64v64zM384 256h-80v32h48v128h32V256z" />
    </svg>
  );
};

export default IconMenuRetailer;
