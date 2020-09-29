import useFetch from "./useFetch";
import { Snapshot } from "../types";

function useSnapshots() {
  const { data, isLoading, isError } = useFetch<Snapshot>();

  return {
    data,
    isLoading,
    isError,
  };
}

export default useSnapshots;
