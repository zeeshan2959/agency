import React from 'react';

type Props = {
  classes?: string;
};

export const Loader: React.FC<Props> = ({ classes }) => {
  return (
    <span
      className={`animate-spin border-4 border-success border-l-transparent rounded-full w-12 h-12 inline-block align-middle m-auto mb-10 ${classes}`}
    ></span>
  );
};
