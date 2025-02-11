"use client";
import React, { useState } from "react";

const UseHandleQuantity = (defaultQuantity = 1) => {
  const [changeQuantity, setChangeQuantity] = useState(defaultQuantity);
  const handleQuantity = (type) => {
    if (type === "increment") {
      changeQuantity > 0 ? setChangeQuantity(changeQuantity + 1) : null;
    }
    if (type === "decrement") {
      changeQuantity > 1 ? setChangeQuantity(changeQuantity - 1) : null;
    }
  };

  return { handleQuantity, changeQuantity };
};

export default UseHandleQuantity;
