"use client";

import { createContext, useContext, useState } from "react";

export type FormData = {
  startDate: string;
  startTime: string;
  fastForward: string;
  file: File | null;
};

type FormDataContextValue = {
  formData: FormData | null;
  setFormData: (data: FormData | null) => void;
};

const FormDataContext = createContext<FormDataContextValue | null>(null);

export function FormDataProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FormData | null>(null);

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  const ctx = useContext(FormDataContext);
  if (!ctx) {
    throw new Error("useFormData must be used within FormDataProvider");
  }
  return ctx;
}
