import { useRequest } from "ahooks";
import { getMapAnchorList, getMapFilterTree } from "../http/point";
import useMapStore from "../store/useMapStore";
export default function useLoadData() {
  const setMapAnchorList = useMapStore((state) => state.setMapAnchorList);
  useRequest(getMapAnchorList, {
    onSuccess(data) {
      setMapAnchorList(data);
    },
  });

  const setFilterTree = useMapStore((state) => state.setFilterTree);
  useRequest(getMapFilterTree, {
    onSuccess(data) {
      setFilterTree(data);
    },
  });
}
