import { Website } from "../types";
import useFetch from "./useFetch";

function useWebsites() {
  const { data, isLoading, isError } = useFetch<Website>("/api/websites");

  return {
    isError,
    isLoading,
    websites: data,
  };
}

export default useWebsites;
