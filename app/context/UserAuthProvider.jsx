"use client";
import React, { createContext, use } from "react";
import UseUserQuery from "../hooks/useUserQuery";


export const UserDataContext = createContext(null);

export const useUserData = () => use(UserDataContext);

const UserAuthProvider = ({ children }) => {
  const { data, isLoading, error } = UseUserQuery();

  return (
    <UserDataContext.Provider value={{ data, isLoading, error }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserAuthProvider;
