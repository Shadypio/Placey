import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const prefix =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

  const sendRequest = useCallback(
    async (
      url,
      method = "GET",
      body = null,
      headers = {
        "Content-Type": "application/json",
      },
      stringify = true,
    ) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      setError(null);

      try {
        let finalHeaders = headers;
        let finalBody = body;

        if (body instanceof FormData) {
          finalHeaders = { ...headers };
          delete finalHeaders["Content-Type"];
          finalBody = body;
          stringify = false;
        }

        const response = await fetch(prefix + url, {
          method,
          body: finalBody
            ? stringify
              ? JSON.stringify(finalBody)
              : finalBody
            : null,
          headers: finalHeaders,
          signal: httpAbortCtrl.signal,
        });

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Request failed!");
        }

        return data;
      } catch (err) {
        setError(err.message || "Something went wrong!");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
