import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const safeSetUser = (newUser) => {
    if (newUser === undefined) {
      setError("User is undefined");
    } else {
      setUser(newUser);
      setError(null); // Clear the error message when a valid user is set
    }
  };

  const logOut = () => {
    // Clear user state
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser: safeSetUser, logOut, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
