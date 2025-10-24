import { FC } from "react";

interface IconMenuBrandsProps {
  className?: string;
}

const IconMenuBrands: FC<IconMenuBrandsProps> = ({ className }) => {
  return (
    <svg
      className={className}
      height="20"
      width="20"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M497.941 225.941 286.059 14.059C278.437 6.437 268.353 2 257.941 2H96C78.327 2 64 16.327 64 34v161.941c0 10.412 4.437 20.496 12.059 28.118l211.882 211.882C294.563 443.563 304.647 448 315.059 448s20.496-4.437 28.118-12.059l154.764-154.764c7.622-7.622 12.059-17.706 12.059-28.118s-4.437-20.496-12.059-28.118zM96 48h161.941l211.882 211.882-154.764 154.764L96 209.941V48z" />
      <circle cx="176" cy="136" r="40" />
    </svg>
  );
};

export default IconMenuBrands;
