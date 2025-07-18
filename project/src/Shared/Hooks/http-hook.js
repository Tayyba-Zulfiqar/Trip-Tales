import { useState, useCallback, useRef, useEffect } from "react";

const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const httpActiveRequest = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", headers = {}, body = null) => {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      httpActiveRequest.current.push(httpAbortController);
      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortController.signal,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || "Request failed!");
        }

        setIsLoading(false);
        return responseData;
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        setError(error.message || "Something went wrong!");
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      httpActiveRequest.current.forEach((abortCtrl) => abortCtrl.abort());
      httpActiveRequest.current = [];
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
export default useHttpClient;
