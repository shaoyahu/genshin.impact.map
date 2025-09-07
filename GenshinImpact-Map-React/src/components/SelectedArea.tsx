import { useState } from "react";
import useMapStore from "../store/useMapStore";
import type { TreeDataItem } from "../types/api/map.types";
export default function SelectedArea() {
  const [expanded, setExpanded] = useState(false);
  const selectedFilterItems = useMapStore((state) => state.selectedFilterItems);
  const delSelectedFilterItem = useMapStore(
    (state) => state.delSelectedFilterItem
  );

  function onSelectedDelete(item: TreeDataItem) {
    delSelectedFilterItem(item);
  }

  return (
    <>
      {selectedFilterItems.length > 0 && (
        <div className="top-[136px] -right-8 absolute flex justify-center items-center bg-[#323947cc] !py-2 rounded-[8px] w-10 cursor-pointer selected-area">
          {expanded ? (
            <div className="!pt-1 !pb-2 list-container">
              <div
                className="flex justify-center !mb-3 up-container"
                onClick={() => setExpanded(!expanded)}
              >
                <div
                  className="bg-cover w-3 h-3 up-icon"
                  style={{
                    backgroundImage: `url('/images/map-icon/arrow-top.png')`,
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3 selected-item-box">
                {selectedFilterItems.map((item) => {
                  return (
                    <div
                      className="group relative cursor-pointer selected-item"
                      key={item.id}
                    >
                      <div className="flex justify-center items-center bg-[#3b4252] border border-[#ffffff29] group-hover:border-[#d3bc8e] rounded-full w-8 h-8 overflow-hidden item-container">
                        <div
                          className="bg-cover w-full h-full item-icon"
                          style={{ backgroundImage: `url(${item.icon})` }}
                        ></div>
                      </div>
                      <div
                        className="hidden group-hover:block -top-1 -right-0.5 absolute bg-cover bg-no-repeat bg-center w-3 h-3 icon-delete"
                        style={{
                          backgroundImage: `url('/images/map-icon/delete-icon.svg')`,
                        }}
                        onClick={() => onSelectedDelete(item)}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="-top-1 -right-[6px] absolute flex justify-center items-center bg-[#ff5e41] rounded-full w-4 h-4 selected-count">
                <span className="text-[12px] text-white text-center">
                  {selectedFilterItems.length}
                </span>
              </div>
              <div
                className="bg-cover w-6 h-6 selected-icon"
                style={{
                  backgroundImage: `url('/images/map-icon/cart-icon.png')`,
                }}
                onClick={() => setExpanded(!expanded)}
              ></div>
            </>
          )}
        </div>
      )}
    </>
  );
}
