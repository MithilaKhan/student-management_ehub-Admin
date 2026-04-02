"use client";
import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of your User data based on the API response
export interface UserProfile {
  _id: string;
  name: string;
  role: string;
  email: string;
  profile: string;
  isUpdate?: boolean;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const UserContext = createContext<UserProfile | null>(null);

export const UserProvider = ({ children, user }: { children: ReactNode; user: UserProfile | null }) => {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    return useContext(UserContext);
};
