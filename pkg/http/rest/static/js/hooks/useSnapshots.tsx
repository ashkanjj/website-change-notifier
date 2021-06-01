import useFetch from "./useFetch";
import { Snapshot } from "../types";

function useSnapshots(websiteId: string) {
const { data, isLoading, isError } = useFetch<Snapshot>(
    websiteId && `/api/snapshots?websiteId=${websiteId}`
  );

  return {
    data: data || [],
    isLoading,
    isError,
  };
}

export default useSnapshots;
