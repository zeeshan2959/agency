import React from 'react';
import { PiImageFill } from 'react-icons/pi';
interface AvatarGroupProps {
  avatars: string[];
  onClick?: (images: string[]) => void;
}
const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars, onClick }) => {
  const visibleAvatars = avatars?.slice(0, 2);
  const extraCount = avatars?.length > 2 ? avatars?.length - 2 : 0;

  return (
    <div className="flex items-center justify-start -space-x-3 rtl:space-x-reverse cursor-pointer">
      {avatars?.length ? (
        <>
          {visibleAvatars?.map((src, idx) => (
            <img
              key={idx}
              className="max-w-9 max-h-9 min-w-9 min-h-9 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-[#515365] shadow-[0_0_15px_1px_rgba(113,106,202,0.30)] dark:shadow-none"
              src={`${import.meta.env.VITE_ASSET}${src}`}
              alt={`profile-${idx}`}
              onClick={() => onClick?.(avatars)}
            />
          ))}
          {extraCount > 0 && (
            <span
              onClick={() => onClick?.(avatars)}
              className="bg-white rounded-full px-2 py-1 text-primary text-xs shadow-[0_0_20px_0_#d0d0d0] dark:shadow-none dark:bg-black dark:text-white"
            >
              +{extraCount} more
            </span>
          )}
        </>
      ) : (
        <PiImageFill className="h-10 w-10" />
      )}
    </div>
  );
};


export default AvatarGroup;
