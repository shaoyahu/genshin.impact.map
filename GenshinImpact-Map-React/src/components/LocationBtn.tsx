import { useState } from "react";
import useMapStore from "../store/useMapStore";
import { useMapActions } from "../hook/useMapAction";
import type { AnchorListItem } from "../types/api/map.types";

export default function LocationBtn() {
  const mapAnchorList = useMapStore((state) => state.mapAnchorList);

  return (
    <div className="group top-[84px] -right-8 absolute flex justify-center items-center bg-[#323947cc] rounded-[8px] w-10 h-10 cursor-pointer">
      <div
        className="bg-cover w-6 h-6"
        style={{
          backgroundImage: `url('/images/map-icon/location-btn.png')`,
        }}
      ></div>
      <div className="invisible group-hover:visible top-0 left-[52px] absolute bg-[#3b4354] rounded-[12px] w-[230px] transition-all duration-500">
        <div className="!p-3 border-[#56617833] border-b font-bold text-[#d3bc8e] text-[16px]">
          快速定位
        </div>
        <div className="h-[500px] overflow-y-auto">
          {mapAnchorList &&
            mapAnchorList.map((item) => {
              return <AreaItem key={item.id} item={item} />;
            })}
        </div>
      </div>
    </div>
  );
}

function AreaItem({ item }: { item: AnchorListItem }) {
  const { flyTo } = useMapActions();
  const [isHovered, setIsHovered] = useState(false);
  function onAreaNameClick(item: AnchorListItem, zoom: number) {
    // 由于缺少官方数据，只能固定一个位置来演示快速定位
    const { lat = -120, lng = 145 } = item;
    flyTo([lat, lng], zoom);
  }
  return (
    <div className="area-item">
      <div
        className="flex items-center !pl-[15px] h-12 area-parent"
        onClick={() => onAreaNameClick(item, 5)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="bg-cover !mr-[5px] w-3 h-3 parent-icon"
          style={{
            backgroundImage: `url('/images/map-icon/location-icon-${
              isHovered ? "h" : "n"
            }.png')`,
          }}
        ></div>
        <div
          className="font-normal text-[14px] parent-name"
          style={{
            color: isHovered ? "#ece5d8" : "#d3bc8e",
          }}
        >
          {item.name}
        </div>
      </div>
      {item.children.map((it) => {
        return (
          <div
            className="flex items-center !pl-8 h-12 font-normal text-[#ece6d9bf] hover:text-[#ece5d8] area-child"
            onClick={() => onAreaNameClick(it, 6)}
            key={it.id}
          >
            {it.name}
          </div>
        );
      })}
    </div>
  );
}
