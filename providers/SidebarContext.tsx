"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

export type TSizeSidebar = "full" | "small";

const SidebarContext = createContext({
  size: "full",
  setSize: (size: TSizeSidebar) => {},
});

export const SidebarContextProvider = ({ children }: PropsWithChildren) => {
  const [size, setSize] = useState<TSizeSidebar>("full");

  return (
    <SidebarContext.Provider value={{ size, setSize }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarData = () => useContext(SidebarContext);
