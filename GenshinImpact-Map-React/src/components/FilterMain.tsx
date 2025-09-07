import { useEffect, useRef, useState } from "react";
import useMapStore from "../store/useMapStore";
import styles from "./FilterMain.module.css";
import type { TreeDataItem } from "../types/api/map.types";

export default function FilterMain() {
  // 选中的标志物
  const selectedFilterItems = useMapStore((state) => state.selectedFilterItems);
  const filterTree = useMapStore((state) => state.filterTree);
  const setSelectedFilterItem = useMapStore(
    (state) => state.setSelectedFilterItem
  );
  const delSelectedFilterItem = useMapStore(
    (state) => state.delSelectedFilterItem
  );
  const [hasValueFilterTree, setHasValueFilterTree] = useState<TreeDataItem[]>(
    []
  );
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [activeParentType, setActiveParentType] = useState<number>();
  const [hasSelectParent, setHasSelectParent] = useState<
    Record<string, number>
  >({});

  function onTypeItemClick(item: TreeDataItem) {
    setActiveParentType(item.id);
    const targetElement = itemRefs.current[item.id];
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "center",
      });
    }
  }
  // 切换选中
  function onFilterItemClick(item: TreeDataItem) {
    const index = selectedFilterItems.findIndex((it) => it.id === item.id);
    if (index < 0) {
      setSelectedFilterItem(item);
    } else {
      delSelectedFilterItem(item);
    }
  }
  // 计算当前项是否被选中
  function getCurrentItemSelected(item: TreeDataItem) {
    const index = selectedFilterItems.findIndex((it) => it.id === item.id);
    return index > -1;
  }

  useEffect(() => {
    return () => {
      itemRefs.current = {};
    };
  }, []);

  useEffect(() => {
    if (filterTree.length > 0) {
      setActiveParentType(filterTree[0].id);
      setHasValueFilterTree(
        filterTree.map((parent) => {
          const children = parent.children as TreeDataItem[];
          return {
            ...parent,
            children: children.filter((child) => child.point_count),
          };
        })
      );
    }
  }, [filterTree]);

  useEffect(() => {
    setHasSelectParent(
      selectedFilterItems.reduce((last: Record<string, number>, current) => {
        const lastNum = last[current.parent_id] || 0;
        return {
          ...last,
          [current.parent_id]: lastNum + 1,
        };
      }, {})
    );
  }, [selectedFilterItems]);
  return (
    <div className="flex flex-1 filter-main overflow-hidden">
      <div className="bg-[#323947] filter-main-left !pb-[56px] w-[97px] h-full overflow-y-scroll">
        {filterTree &&
          filterTree.map((item) => (
            <div
              className={`filter-type-item flex flex-col relative text-[#ece6d9bf] hover:cursor-pointer hover:text-[#ece5d8] ${
                item.id === activeParentType
                  ? `${styles["filter-type-item-active"]}`
                  : "!py-4 !px-[6px]"
              }`}
              key={item.id}
              onClick={() => onTypeItemClick(item)}
            >
              <div className="font-normal text-[12px] item-name">
                {item.name}
              </div>
              {hasSelectParent[item.id] !== 0 && (
                <div className="top-[5px] right-1 absolute bg-[#3b4354] !px-[3px] rounded-[6px] text-[#d3bc8e] text-[9px] leading-3 item-count">
                  {hasSelectParent[item.id]}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="flex-1 filter-main-right !px-[10px] overflow-y-auto">
        {hasValueFilterTree &&
          hasValueFilterTree.map((item) => (
            <div
              className="border-[#4a536680] border-b filter-content-item"
              key={item.id}
              ref={(el) => {
                itemRefs.current[item.id] = el;
              }}
            >
              <div className="!pt-4 !pl-[2px] content-head">
                <div className="text-[#d3bc8e] text-[14px] head-title">
                  {item.name}
                </div>
              </div>
              <div className="flex flex-wrap !mt-[14px] content-body">
                {item.children.map((it, index: number) => (
                  <div
                    className={`content-item relative !mb-[15px] cursor-pointer ${
                      (index + 1) % 4 === 0 ? "!mr-0" : "!mr-[10px]"
                    }`}
                    key={(it as TreeDataItem).id}
                    onClick={() => onFilterItemClick(it as TreeDataItem)}
                  >
                    <div
                      className={`relative bg-[#323947] rounded-[6px] w-[57px] h-[57px] item-icon-container ${
                        getCurrentItemSelected(it as TreeDataItem)
                          ? styles["item-icon-container-active"]
                          : ""
                      }`}
                    >
                      <div
                        className="bg-cover w-full h-full icon-pic"
                        style={{
                          backgroundImage: `url(${(it as TreeDataItem).icon})`,
                        }}
                      ></div>
                      <div className="right-0 bottom-0 absolute bg-[#323947] !px-1 rounded-t-[6px] text-[#9b9c9f] text-[10px] leading-[13px] icon-count">
                        {(it as TreeDataItem).point_count}
                      </div>
                      <div
                        className={`${
                          getCurrentItemSelected(it as TreeDataItem)
                            ? styles["item-selected-icon-active"]
                            : ""
                        }`}
                      ></div>
                    </div>
                    <div
                      className={`!mt-[5px] max-w-[57px] overflow-ellipsis overflow-hidden text-[#ece6d9bf] text-[12px] text-center content-item-name whitespace-nowrap ${
                        getCurrentItemSelected(it as TreeDataItem)
                          ? styles["content-item-name-active"]
                          : ""
                      }`}
                    >
                      {(it as TreeDataItem).name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
