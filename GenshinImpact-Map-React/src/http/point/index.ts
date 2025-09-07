import type { AnchorListItem, PointDetail, TreeDataItem } from "../../types/api/map.types";
import axios from "../index";

export function getMapFilterTree(): Promise<TreeDataItem[]> {
  return axios.get("/api/label/tree");
}

export function getMapAnchorList(): Promise<AnchorListItem[]> {
  return axios.get("/api/map_anchor/list");
}

export function getMapPointDetail(pointId: number): Promise<PointDetail> {
  return axios.get(`/api/map/point/detail/${pointId}`);
}
