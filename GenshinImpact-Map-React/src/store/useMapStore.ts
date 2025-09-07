import { create } from "zustand";
import type { AnchorListItem, GuideUIItem, TreeDataItem } from "../types/api/map.types";

interface MapDataState {
  mapAnchorList: AnchorListItem[];
  selectedFilterItems: TreeDataItem[];
  filterTree: TreeDataItem[];
  guidePointList: GuideUIItem[];
}
interface MapActionState {
  setMapAnchorList: (v: AnchorListItem[]) => void;
  setSelectedFilterItem: (v: TreeDataItem) => void;
  delSelectedFilterItem: (v: TreeDataItem) => void;
  setFilterTree: (v: TreeDataItem[]) => void;
  setGuidePointList: (v: GuideUIItem[]) => void;
}

type MapState = MapDataState & MapActionState;

const useMapStore = create<MapState>((set) => ({
  mapAnchorList: [],
  setMapAnchorList: (data) => set(() => ({ mapAnchorList: data })),
  selectedFilterItems: [],
  setSelectedFilterItem: (data) =>
    set((state) => ({
      selectedFilterItems: [...state.selectedFilterItems, data],
    })),
  delSelectedFilterItem: (data) =>
    set((state) => ({
      selectedFilterItems: state.selectedFilterItems.filter(
        (item) => data.id !== item.id
      ),
    })),
  filterTree: [],
  setFilterTree: (data) => set(() => ({ filterTree: data })),
  guidePointList: [],
  setGuidePointList: (data) => set(() => ({ guidePointList: data })),
}));

export default useMapStore;
