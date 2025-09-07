import useMapStore from "../store/useMapStore";
import { useMapActions } from "../hook/useMapAction";
import type { GuideUIItem } from "../types/api/map.types";

export default function GuideUI() {
  const guidePointList = useMapStore((state) => state.guidePointList);
  const { flyTo } = useMapActions();

  function calcOffsetStyle(item: GuideUIItem) {
    const { innerWidth, innerHeight } = window;
    const screenAngle = Math.atan(innerHeight / innerWidth);
    const { angle } = item;
    const marginTopSlope = angle > 0 ? -1 : 1;
    const marginLeftSlope = Math.abs(angle) < Math.PI / 2 ? 1 : -1;
    // console.log("marginLeftSlope", marginLeftSlope);

    const boundWidth = innerWidth - 100;
    const boundHeight = innerHeight - 100;

    let marginLeft;
    let marginTop;

    if (
      Math.abs(angle) > screenAngle &&
      Math.abs(angle) < Math.PI - screenAngle
    ) {
      // console.log("1", 1);
      marginTop = (boundHeight * marginTopSlope) / 2;
      marginLeft = Math.abs(marginTop / Math.tan(angle)) * marginLeftSlope;
    } else {
      // console.log("2", 2);
      marginLeft = (boundWidth * marginLeftSlope) / 2;
      marginTop = Math.abs(Math.tan(angle) * marginLeft) * marginTopSlope;
    }
    // console.log("margin", {
    //   marginLeft,
    //   marginTop,
    // });

    return {
      marginLeft: `${marginLeft}px`,
      marginTop: `${marginTop}px`,
    };
  }

  function calcBgRotation(item: GuideUIItem) {
    const rotate = Math.PI - item.angle;
    return `rotate(${rotate}rad)`;
  }

  function onGuideMarkerClick(item: GuideUIItem) {
    flyTo([item.lat, item.lng]);
  }

  // useEffect(() => {
  //   console.log("guidePointList", guidePointList);
  // }, [guidePointList]);
  return (
    <div className="top-0 left-0 z-[2] fixed w-[100vw] h-[100vh] pointer-events-none guide-marker-ui">
      {guidePointList.length > 0 &&
        guidePointList.map((item, index) => {
          return (
            <div
              className="top-1/2 left-1/2 absolute flex justify-center items-center w-[53px] h-[53px] -translate-1/2 cursor-pointer pointer-events-auto guide-marker-item"
              key={index}
              style={calcOffsetStyle(item)}
              onClick={() => onGuideMarkerClick(item)}
            >
              <div
                className="absolute bg-[#00000080] border border-[#ffffff4d] rounded-full w-full h-full marker-bg"
                style={{ transform: calcBgRotation(item) }}
              >
                <div
                  className="top-[15px] -left-[19px] absolute bg-[url('/images/map-icon/guide-arrow.png')]] bg-cover w-[19px] h-[26px] arrow-icon"
                  style={{
                    backgroundImage: `url('/images/map-icon/guide-arrow.png')`,
                  }}
                ></div>
              </div>
              <div className="z-[2] relative w-12 h-12 marker-img-container">
                <img className="w-full item-icon" src={item.icon} alt="" />
              </div>
            </div>
          );
        })}
    </div>
  );
}
