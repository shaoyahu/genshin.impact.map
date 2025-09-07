export default function FilterHeader() {
  return (
    <div className="flex items-center filter-header !pt-3 !pr-[7px] !pb-[7px] !pl-[10px] text-[#d3bc8e]">
      <div className="flex items-center cursor-pointer header-container">
        <div
          className="bg-cover !mr-2 w-10 h-10 header-icon"
          style={{
            backgroundImage: `url('/images/map-icon/xumi-icon.png')`,
          }}
        ></div>
        <div className="flex justify-center font-normal leading-6 header-name">
          须弥
        </div>
        <div className="flex items-center bg-[#4a5366] !ml-2 !py-[2px] !pr-2 !pl-1 rounded-[12px] h-5 text-[12px] switch-btn">
          <div
            className="bg-cover w-4 h-4 switch-icon"
            style={{
              backgroundImage: `url('/images/map-icon/switch-btn.png')`,
            }}
          ></div>
          <div className="h-4 switch-text">切换</div>
        </div>
      </div>
    </div>
  );
}
