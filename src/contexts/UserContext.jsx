// UserIdContext.js
import { createContext, useContext } from "react";

// Create a context with a default hardcoded user ID
const UserContext = createContext("45c4b990-4a01-46aa-87a5-f73e243c338c");

export const useUserId = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const userId = "45c4b990-4a01-46aa-87a5-f73e243c338c";

  return <UserContext.Provider value={userId}>{children}</UserContext.Provider>;
};
