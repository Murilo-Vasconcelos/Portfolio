"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type IntroState = {
  // true quando a intro terminou (ou foi pulada) e a abertura já pode animar
  ready: boolean;
  markReady: () => void;
};

const IntroContext = createContext<IntroState>({
  ready: false,
  markReady: () => {},
});

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);
  const value = useMemo(() => ({ ready, markReady }), [ready, markReady]);

  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
