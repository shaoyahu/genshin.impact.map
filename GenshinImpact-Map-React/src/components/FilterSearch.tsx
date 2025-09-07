export default function FilterSearch() {
  return (
    <div className="flex justify-between !p-[10px]">
      <div className="flex items-center bg-[#363e4d] border border-[#4f5563] hover:border-[#d3bc8e] rounded-[22px] w-[210px] h-8 text-[#9b9c9f] text-[12px] cursor-pointer">
        <div
          className="bg-cover !my-0 !mr-[5px] !ml-[10px] w-4 h-4"
          style={{
            backgroundImage: `url('/images/map-icon/search-icon.png')`,
          }}
        ></div>
        <div className="!mt-[1px]">搜索当前区域下的标点分类</div>
      </div>
      <div className="relative bg-[#4a5366] hover:bg-[#676e7e] !px-[10px] !py-[6px] rounded-2xl w-33 text-[#d3bc8e] text-[14px] text-center cursor-pointer">
        我的背包
      </div>
    </div>
  );
}
