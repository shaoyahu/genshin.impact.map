import L from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMapPointDetail } from "../http/point";
import useMapStore from "../store/useMapStore";
import type {
  GuideUIItem,
  PointConfig,
  PointDetail,
} from "../types/api/map.types";

interface AreaNameConfig {
  lat: number;
  lng: number;
  name: string;
  children: AreaNameConfig[];
}

interface Vector {
  x: number;
  y: number;
}

interface MapOptions {
  initZoom?: number;
  // 标志物选中时围绕在标志物左上，左下，右上，右下的四个有旋转角度的相同图标
  // 提供类名，arrow-icon-lt，arrow-icon-lb，arrow-icon-rt，arrow-icon-rb
  arrowIconImg: string;
  // 地图标点的 style ，将直接写入 dom 元素中
  // 例："background-image: url('/images/map-icon/normal_box.png');"
  pointItemContainerStyle?: string;
}

interface MapAPI {
  renderPoints: () => void;
  flyTo: (latlng: L.LatLngExpression, zoom?: number) => void;
  enableClickDebug: () => void;
}

const calcVectorAngle = (vectorA: Vector, vectorB: Vector) => {
  const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  const magnitudeA = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2);
  const magnitudeB = Math.sqrt(vectorB.x ** 2 + vectorB.y ** 2);
  const cosTheta = dotProduct / (magnitudeA * magnitudeB);
  const theta = Math.acos(cosTheta);
  const crossProduct = vectorA.x * vectorB.y - vectorA.y * vectorB.x;
  const direction = crossProduct > 0 ? 1 : -1;
  return theta * direction;
};

export const useMap = (
  domId: string,
  opt: MapOptions
): [GuideUIItem[], MapAPI] => {
  const { initZoom = 5, arrowIconImg, pointItemContainerStyle } = opt;
  const mapRef = useRef<L.Map | null>(null);
  const areaNameLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const pointLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [guideUIPointList, setGuideUIPointList] = useState<GuideUIItem[]>([]);
  const mapAnchorList = useMapStore((state) => state.mapAnchorList);
  const mapAnchorListRef = useRef<AreaNameConfig[]>(mapAnchorList);
  const selectedFilterItems = useMapStore((state) => state.selectedFilterItems);
  const pointListRef = useRef<PointConfig[]>([]);

  // 选中地图上标点
  const lastActivePointIdRef = useRef(-1);
  const pointRenderListRef = useRef<Record<number, HTMLDivElement | null>>([]);

  // 点击地图 任一位置时 移除其他标志物点位的 active 类名
  const handleMapClick = useCallback(() => {
    closeActiveItem(lastActivePointIdRef.current);
  }, []);

  // 生成地点名称 div
  const getAreaNameMakerItem = useCallback(
    (config: AreaNameConfig[]): L.Marker[] => {
      return config.map((marker) => {
        return L.marker(L.latLng(marker.lat || 0, marker.lng || 0), {
          icon: L.divIcon({
            className: "map-marker-item",
            html: `<div class='area-mark-item text-[18px] text-[#ffffffcc] font-bold whitespace-nowrap'>${marker.name}</div>`,
          }),
        });
      });
    },
    []
  );
  // 根据缩放等级 渲染地图中地点名称
  const renderAreaNames = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const configList = mapAnchorListRef.current;
    if (configList.length === 0) return;

    // 每次渲染前清空上一次渲染的地图地点信息
    areaNameLayerGroupRef.current?.clearLayers();
    const zoom = map.getZoom();
    let markers: L.Marker[] = [];

    switch (zoom) {
      case 5:
        markers = getAreaNameMakerItem(configList);
        break;
      case 6:
        configList.forEach((item) => {
          markers = [...markers, ...getAreaNameMakerItem(item.children)];
        });
        break;
    }

    areaNameLayerGroupRef.current = L.layerGroup(markers);
    areaNameLayerGroupRef.current.addTo(map);
  }, [getAreaNameMakerItem]);

  // 关闭标志物弹窗
  function closeActiveItem(id: number) {
    const lastActivePoint = document.getElementById(`mapPointItem${id}`);
    lastActivePoint?.classList.remove("point-active");
    lastActivePoint?.querySelectorAll(".arrow-icon").forEach((arrow) => {
      arrow.classList.add("force-hidden");
    });
    lastActivePointIdRef.current = -1;
  }
  // 开启标志物弹窗
  function openActiveItem(id: number) {
    const curPoint = document.getElementById(`mapPointItem${id}`);
    curPoint?.classList.add("point-active");
    curPoint?.querySelectorAll(".arrow-icon").forEach((arrow) => {
      arrow.classList.remove("force-hidden");
    });
    lastActivePointIdRef.current = id;
    // console.log("lastActivePointIdRef", lastActivePointIdRef.current);
  }

  // 生成地图标志物弹窗详情 HTML
  const calcPopupContent = useCallback(
    (data: PointDetail & { name: string }) => {
      const avatarElStr = data.correct_user_list
        .map((val) => {
          return `<div class='avatar-item w-6 h-4 bg-cover' title='${val.name}' style='background-image: url("${val.img}")'></div>`;
        })
        .join("");

      return `<div class='point-popup-container w-[375px] text-[14px] relative !px-3 !pt-3 !pb-[10px]'>
      <div class='popup-title !mb-[7px] text-[#d3bc8e]'>${data.name}</div>
      <div class='popup-pic w-[355px] h-[200px] rounded-[6px] bg-cover' style='background-image: url("${data.info.img}")'></div>
      <div class='point-name text-[#ece5d8] text-[14px] font-mono whitespace-pre-wrap break-words !mt-[10px]'>${data.info.content}</div>
      <div class='contributor-container flex !mt-[10px]'>
        <div class='contributor-label text-[#9b9c9f] text-[12px] leading-[30px]j !mr-[10px]'>贡献者: </div>
        <div class='avatar-container flex'>${avatarElStr}</div>
      </div>
      <div class='point-time text-[12px] text-[#9b9c9f] leading-[30px]'>更新时间: ${data.last_update_time}</div>
    </div>`;
    },
    []
  );

  // 计算获取视图外面的点位最近的标点信息
  const calcOutScreenPoints = useCallback(() => {
    const map = mapRef.current;
    if (!map || pointListRef.current.length === 0) return;

    // console.log("pointListRef", pointListRef.current);

    const guideUIArr: GuideUIItem[] = [];
    const calcPointMap: Record<
      string,
      Record<string, number | boolean | string | PointConfig>
    > = {};
    const center = map.getCenter();

    pointListRef.current.forEach((pointItem) => {
      const { name } = pointItem;
      if (!calcPointMap[name]) {
        calcPointMap[name] = {};
      }

      if (calcPointMap[name].inScreen) return;

      const isContain = map
        .getBounds()
        .contains([pointItem.lat, pointItem.lng]);
      if (!isContain) {
        const distance = center.distanceTo([pointItem.lat, pointItem.lng]);
        if (
          !calcPointMap[name].pointItem ||
          distance < (calcPointMap[name].distance as number)
        ) {
          calcPointMap[name] = { distance, pointItem, inScreen: false };
        }
      } else {
        calcPointMap[name] = { inScreen: true };
      }
    });

    Object.keys(calcPointMap).forEach((key) => {
      const { inScreen, pointItem } = calcPointMap[key];
      if (!inScreen && pointItem) {
        const { lat, lng, icon } = pointItem as PointConfig;
        const directionVector = { x: lng - center.lng, y: lat - center.lat };
        const xVector = { x: 1, y: 0 };
        const angle = calcVectorAngle(xVector, directionVector);
        guideUIArr.push({ angle, icon, lat, lng });
      }
    });

    setGuideUIPointList(guideUIArr);
  }, []);

  // 在地图上渲染点位，同时，生成每个点位的详情弹窗内容，和计算在视图外的点位的最近距离标点
  const renderPoints = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    pointLayerGroupRef.current?.clearLayers();
    // console.log("pointListRef", pointListRef.current);

    const pointMarkers = pointListRef.current.map((point) => {
      const marker = L.marker(L.latLng(point.lat || 0, point.lng || 0), {
        icon: L.divIcon({
          className: `map-point-item`,
          html: `<div class='point-item-container relative w-[37px] h-10 bg-cover flex justify-center box-border !pt-[3px] ' style="background-image: url('/images/map-icon/icon-bg.png');${pointItemContainerStyle}"  id='mapPointItem${point.pointId}'>
           <div class='point-pic w-[25px] h-[25px] bg-cover' style='background-image: url(${point.icon})'></div>
           <div class='arrow-icon force-hidden absolute w-[10px] h-[10px] bg-cover arrow-icon-lt left-0 -top-1 scale-y-[-1]' style="background-image:url('${arrowIconImg}')"></div>
           <div class='arrow-icon force-hidden absolute w-[10px] h-[10px] bg-cover arrow-icon-lb left-0 bottom-[6px]' style="background-image:url('${arrowIconImg}')"></div>
           <div class='arrow-icon force-hidden absolute w-[10px] h-[10px] bg-cover arrow-icon-rt right-0 -top-1 scale-[-1]' style="background-image:url('${arrowIconImg}')"></div>
           <div class='arrow-icon force-hidden absolute w-[10px] h-[10px] bg-cover arrow-icon-rb right-0 bottom-[6px] scale-x-[-1]' style="background-image:url('${arrowIconImg}')"></div>
           </div>`,
          iconSize: [37, 40],
          iconAnchor: [19, 20],
        }),
      });

      marker.bindPopup(
        L.popup({
          keepInView: true,
          autoClose: false,
          offset: [220, 330],
          className:
            "[&>*:first-child]:!bg-[#3b4354] [&>*:first-child]:!rounded-[12px] [&>*:first-child]:!p-0 [&>*:first-child>*]:!w-[auto] [&>*:first-child>*]:!m-0 [&>*:nth-child(2)]:hidden [&>*:nth-child(3)]:!absolute [&>*:nth-child(3)]:!top-[10px] [&>*:nth-child(3)]:!right-[10px] [&>*:nth-child(3)]:!w-6 [&>*:nth-child(3)]:!h-6 [&>*:nth-child(3)]:!bg-cover [&>*:nth-child(3)]:!bg-[url('/images/map-icon/close-icon.png')]",
        })
      );

      marker.on("popupopen", async () => {
        const res = await getMapPointDetail(point.pointId);
        marker.setPopupContent(calcPopupContent({ ...res, name: point.name }));
      });

      // 添加 popupclose 事件是因为点击关闭按钮时不会触发 click 事件
      // 这虽然挺合理但是蛮恶心的
      marker.on("popupclose", function () {
        setTimeout(() => {
          closeActiveItem(lastActivePointIdRef.current);
        });
      });

      marker.on("click", () => {
        const lastId = lastActivePointIdRef.current;
        if (lastId === -1) {
          // 第一次点击标志物，直接打开弹窗
          openActiveItem(point.pointId);
        } else {
          // 非第一次点击标志物，分两种情况，但是无论如何都会关闭上一个弹窗
          closeActiveItem(lastId);

          // 点击的是另一个标志物，打开新的标志物弹窗
          if (lastId !== point.pointId) {
            setTimeout(() => {
              openActiveItem(point.pointId);
            });
          }
        }
      });

      return marker;
    });

    pointLayerGroupRef.current = L.layerGroup(pointMarkers);
    pointLayerGroupRef.current.addTo(map);
    calcOutScreenPoints();
  }, [
    arrowIconImg,
    calcOutScreenPoints,
    calcPopupContent,
    pointItemContainerStyle,
  ]);

  // 平滑移动到某个经纬度 ([lat, lng], zoom = initZoom) => void
  const flyTo = useCallback(
    (latlng: L.LatLngExpression, zoom: number = initZoom) => {
      mapRef.current?.flyTo(latlng, zoom);
    },
    [initZoom]
  );

  // 鼠标点击调试函数 () => void
  const enableClickDebug = useCallback(() => {
    mapRef.current?.on("click", function (e) {
      console.log("coordinate", e.latlng);
    });
  }, []);
  // 初始化地图
  useEffect(() => {
    if (mapRef.current) return;
    // 设置地图边界，函数 latLngBounds 接受左上角坐标和右下角坐标确定地图边界
    const maxBounds = L.latLngBounds(L.latLng(-77, 56), L.latLng(-180, 202));
    // 这里的第二属性考虑从 hook 参数中获取 优化
    const map = L.map(domId, {
      center: [-84, 148],
      zoom: initZoom,
      crs: L.CRS.Simple,
      maxBounds,
      zoomControl: false,
      attributionControl: false,
      minZoom: 1,
      maxZoom: 7,
    });

    L.tileLayer("/images/map/{z}/{x}/{y}.png", {
      maxZoom: 7,
      bounds: maxBounds,
    }).addTo(map);

    map.addControl(
      // @ts-expect-error 处理Zoomslider类型问题
      new L.Control.Zoomslider({
        position: "bottomright",
        stepHeight: 30,
        knowHeight: 25,
      })
    );

    // 在 useEffect 中使用赋值就不算“渲染期间修改”。
    // 事件处理、useEffect、异步回调里改 ref 都是完全安全的。
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [domId, initZoom]);

  useEffect(() => {
    if (mapAnchorList.length > 0) {
      mapAnchorListRef.current = mapAnchorList;
      renderAreaNames();
    }
  }, [mapAnchorList, renderAreaNames]);

  useEffect(() => {
    if (selectedFilterItems.length >= 0) {
      // console.log("selectedFilterItems", selectedFilterItems);
      pointListRef.current = selectedFilterItems.flatMap((parent) =>
        parent.children.map((it) => {
          const { lat, lng, pointId } = it;
          return {
            lat,
            lng,
            pointId,
            icon: parent.icon,
            name: parent.name,
          } as PointConfig;
        })
      );

      renderPoints();
    }
  }, [selectedFilterItems, renderPoints]);

  // 绑定地图事件
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleZoom = () => {
      const curZoom = map.getZoom()
      console.log("当前 zoom 层级", curZoom);
      // if(curZoom > 5){
      //   alert('演示网站未配置层级5以上地图瓦片，请降低层级！')
      // }
      renderAreaNames();
    };

    const handleMoveEnd = () => {
      calcOutScreenPoints();
    };

    map.on("zoom", handleZoom);
    map.on("moveend", handleMoveEnd);
    map.on("click", handleMapClick);

    return () => {
      map.off("zoom", handleZoom);
      map.off("moveend", handleMoveEnd);
      map.off("click", handleMapClick);
      pointRenderListRef.current = {};
    };
  }, [calcOutScreenPoints, handleMapClick, renderAreaNames]);

  return [
    guideUIPointList,
    {
      renderPoints,
      flyTo,
      enableClickDebug,
    },
  ];
};
