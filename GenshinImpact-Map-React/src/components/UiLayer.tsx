import LocationBtn from "./LocationBtn";
import SelectedArea from "./SelectedArea";
import FilterHeader from "./FilterHeader";
import FilterMain from "./FilterMain";
import FilterSearch from "./FilterSearch";
import GuideUI from "./GuideUI";

export default function UiLayer() {
  return (
    <div className="top-0 left-0 z-2 absolute h-full">
      {/* 左侧筛选栏 */}
      <div className="top-0 left-0 z-3 box-border absolute p-5! w-[415px] h-full">
        <div className="flex flex-col bg-[#3b4354] rounded-[12px] w-full h-full">
          {/* 关闭按钮 */}
          <div
            className="top-8 -right-[44px] box-border absolute flex items-center bg-cover !pl-[18px] w-16 h-10"
            style={{
              backgroundImage: `url('/images/map-icon/close-bg.png')`,
            }}
          >
            <div
              className="bg-cover w-6 h-6"
              style={{
                backgroundImage: `url('/images/map-icon/close-icon.png')`,
              }}
            ></div>
          </div>

          {/* 快速定位按钮 */}
          <LocationBtn />

          {/* 快速定位展开面板 */}
          <SelectedArea />

          {/* 地图切换，但是没做 */}
          <FilterHeader />

          {/* 搜索框和背包 */}
          <FilterSearch />

          {/* 筛选栏 */}
          <FilterMain />

          {/* 导航点位 */}
          <GuideUI />
        </div>
      </div>

      {/* 地图外标点层 */}
      {/* <div></div> */}
    </div>
  );
}
