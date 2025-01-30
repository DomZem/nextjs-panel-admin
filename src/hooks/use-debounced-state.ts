import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export const useDebouncedState = <T>(
  initialValue: T,
  delay: number,
  onDebounce?: (value: T) => void,
) => {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue] = useDebounce(value, delay);

  useEffect(() => {
    if (onDebounce) {
      onDebounce(debouncedValue);
    }
  }, [debouncedValue, onDebounce]);

  return { value, setValue, debouncedValue };
};
