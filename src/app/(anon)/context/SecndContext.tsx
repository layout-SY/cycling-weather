"use client";
import { createContext, useContext, useState } from "react";
import { LocationDataType } from "../second/page";

export type FormData = {
  locationData: LocationDataType[];
  startDate: string;
  startTime: string;
};

export type SecondContextType = {
  locationFormData: LocationDataType[] | null;
  setLocationFormData: (locationFormData: LocationDataType[] | null) => void;
};

export const SecondContext = createContext<SecondContextType>({
  locationFormData: null,
  setLocationFormData: () => {},
});

export const SecondContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locationFormData, setLocationFormData] = useState<
    LocationDataType[] | null
  >(null);
  return (
    <SecondContext.Provider value={{ locationFormData, setLocationFormData }}>
      {children}
    </SecondContext.Provider>
  );
};

export const useSecondContext = () => {
  const ctx = useContext(SecondContext);
  if (!ctx) {
    throw new Error(
      "useSecondContext must be used within a SecondContextProvider"
    );
  }
  return ctx;
};
