import { useRef, useState, useEffect, RefObject } from "react";

const useDropDirection = (
  ref: RefObject<HTMLDivElement | null>,
  dropDownWidth = 240,
) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY;

    if (left + dropDownWidth > window.innerWidth) {
      left = rect.right + window.scrollX - dropDownWidth;
    }
    if (left < 0) left = 16;

    setPosition({ top, left });
  };

  useEffect(() => {
    updatePosition(); // initial
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [ref]);

  return position;
};

export default useDropDirection;
