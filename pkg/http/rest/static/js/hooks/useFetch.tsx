import { useEffect, useState } from "react";
import axios from "axios";

function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    url && fetchData();
  }, [url]);

  return {
    isLoading,
    isError,
    data,
  };
}

export default useFetch;
