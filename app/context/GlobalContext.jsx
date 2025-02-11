"use client";
import React, { createContext, useReducer } from "react";
import { globalReducer } from "../reducers/globalReducer";
import { initialState } from "../defaults/defaultState";

export const GlobalContext = createContext(null);

const GlobalContextProvider = ({ children }) => {
  const [globalState, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ globalState, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
