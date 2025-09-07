import { useContext } from "react";
import MapContext from "../context";

export function useMapActions() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapActions must be used within a MapProvider');
  }
  return context;
}