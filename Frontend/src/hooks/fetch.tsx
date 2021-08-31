import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

function useAPICall<T>(apiFunction: () => Promise<AxiosResponse<T>>) {
  const [response, setResponse] = useState<AxiosResponse<T> | null>(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  useEffect(() => {
    apiFunction()
      .then((res) => {
        setResponse(res);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  }, [apiFunction]);

  return { response, error, loading };
}

export default useAPICall;
