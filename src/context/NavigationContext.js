import { createContext, useContext } from "react";

export const NavigationContext = createContext(null);

export function useScreenNavigation() {
  const navigation = useContext(NavigationContext);

  if (!navigation) {
    throw new Error("ไม่พบส่วนควบคุมหน้าจอ");
  }

  return navigation;
}
