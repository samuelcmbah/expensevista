import { useState, useCallback } from "react";

export default function useLoadingButton() {
  const [loading, setLoading] = useState(false);
  //receives an async function and manages loading state
  //ensures the functin only runs when loading is false
  const withLoading = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T | void> => {
      if (loading) return; // Prevent double execution
      try {
        setLoading(true);
        return await action();
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  return { loading, withLoading };
}
