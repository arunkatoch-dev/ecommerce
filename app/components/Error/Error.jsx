import React from "react";

const Error = ({ message }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <span className="text-2xl text-red-600 ">{message}</span>
    </div>
  );
};

export default Error;
