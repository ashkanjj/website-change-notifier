import { Website } from "../types";
import useFetch from "./useFetch";

function useWebsites() {
  const { data, isLoading, isError } = useFetch<Website>("/api/websites");

  return {
    isError,
    isLoading,
    data,
  };
}

export default useWebsites;
