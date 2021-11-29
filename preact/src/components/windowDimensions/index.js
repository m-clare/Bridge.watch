import { h } from "preact"
import { useEffect, useState } from "preact/hooks";

function getWindowDimensions() {
  if (typeof window !== "undefined") {
  const { innerWidth: deviceWidth, innerHeight: deviceHeight } = window;
  return {
    deviceWidth,
    deviceHeight
  };
  }
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
