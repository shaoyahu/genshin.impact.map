import { createContext, useEffect, useMemo } from "react";
import { useMap } from "../hook/useMap";
import useMapStore from "../store/useMapStore";

type MapActions = {
  renderPoints: () => void;
  flyTo: (location: [number, number], zoom?: number) => void;
  enableClickDebug: () => void;
};

const MapContext = createContext<MapActions | null>(null);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const setGuidePointList = useMapStore((state) => state.setGuidePointList);
  const [guideUIPointList, actions] = useMap("map", {
    arrowIconImg: "/images/map-icon/arrow-l.png",
    pointItemContainerStyle:
      "background-image: url('/images/map-icon/icon-bg.png');",
  });

  // 使用 useMemo 缓存操作对象，避免不必要的重渲染
  const contextValue = useMemo(
    () => ({
      renderPoints: actions.renderPoints,
      flyTo: actions.flyTo,
      enableClickDebug: actions.enableClickDebug,
    }),
    [actions]
  );

  useEffect(() => {
    setGuidePointList(guideUIPointList);
  }, [guideUIPointList, setGuidePointList]);

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
}

export default MapContext;
