import { useState, useCallback, useRef, useEffect } from "react";

const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false); // loading spinner
  const [error, setError] = useState(); // modal error display

  const httpActiveRequest = useRef([]); // store abortController

  const sendRequest = useCallback(
    async (url, method = "GET", headers = {}, body = null) => {
      headers = headers || {};
      setIsLoading(true);
      const httpAbortController = new AbortController(); // abort request
      httpActiveRequest.current.push(httpAbortController); // store every request abortCtrl

      try {
        const isFormData = body instanceof FormData;

        const fetchOptions = {
          method,
          body,
          signal: httpAbortController.signal,
        };

        // Handle headers
        if (!isFormData) {
          fetchOptions.headers = { ...headers };
        } else {
          // Remove Content-Type but preserve Authorization and others
          const { ["Content-Type"]: _, ...filteredHeaders } = headers;
          fetchOptions.headers = filteredHeaders;
        }

        const response = await fetch(url, fetchOptions);
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || "Request failed!");
        }

        setIsLoading(false);
        return responseData;
      } catch (error) {
        if (error.name === "AbortError") {
          return; // ignore abort errors
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
