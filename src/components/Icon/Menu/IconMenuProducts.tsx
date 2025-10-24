import { FC } from "react";

interface IconMenuProductsProps {
  className?: string;
}

const IconMenuProducts: FC<IconMenuProductsProps> = ({ className }) => {
  return (
    <svg
      className={className}
      height="20"
      width="20"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M494.4 110.6 272.4 3.4c-10.2-5-22.6-5-32.8 0L17.6 110.6C6.8 115.9 0 127 0 139.2v233.6c0 12.2 6.8 23.3 17.6 28.6l222 107.2c10.2 5 22.6 5 32.8 0l222-107.2c10.8-5.3 17.6-16.4 17.6-28.6V139.2c0-12.2-6.8-23.3-17.6-28.6zM256 48l192 92.8-192 92.8L64 140.8 256 48zm208 324.8L272 464V281.6l192-92.8v184z"/>
    </svg>
  );
};

export default IconMenuProducts;
