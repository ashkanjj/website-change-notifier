import useFetch from "./useFetch";
import { Snapshot } from "../types";

function useSnapshots(website: string) {
  const { data, isLoading, isError } = useFetch<Snapshot>(
    website && `/api/snapshots?websiteId=${website}`
  );

  return {
    snapshots: data || [],
    isLoading,
    isError,
  };
}

export default useSnapshots;
