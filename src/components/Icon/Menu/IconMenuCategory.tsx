import { FC } from "react";

interface IconMenuCategoryProps {
  className?: string;
}

const IconMenuCategory: FC<IconMenuCategoryProps> = ({ className }) => {
  return (
    <svg
      className={className}
      height="20"
      width="20"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <g>
        <path d="M160 32H64C46.3 32 32 46.3 32 64v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zM448 32H352c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zM160 288H64c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32zM448 288H352c-17.7 0-32 14.3-32 32v160c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32V320c0-17.7-14.3-32-32-32z" />
      </g>
    </svg>
  );
};

export default IconMenuCategory;
