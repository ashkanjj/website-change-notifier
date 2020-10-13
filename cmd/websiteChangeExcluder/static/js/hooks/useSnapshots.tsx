import useFetch from "./useFetch";
import { Snapshot } from "../types";

function useSnapshots() {
  const { data, isLoading, isError } = useFetch<Snapshot>("/api");

  return {
    data,
    isLoading,
    isError,
  };
}

export default useSnapshots;
