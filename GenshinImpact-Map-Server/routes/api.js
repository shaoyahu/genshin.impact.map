import express from "express";
const router = express.Router();
import Mock from "mockjs";
import { LabelTreeData } from "../data/label-tree-data.js";
import { MapAnchorList } from "../data/map-anchor-list.js";

router.get("/test", (req, res) => {
  const obj = {
    code: 0,
    msg: "OK",
    data: {
      description: "测试接口",
    },
  };
  res.json(obj);
});

router.get("/label/tree", (req, res) => {
  res.json({
    code: 0,
    msg: "OK",
    data: LabelTreeData,
  });
});

router.get("/map_anchor/list", (req, res) => {
  res.json({
    code: 0,
    msg: "OK",
    data: MapAnchorList,
  });
});

router.get("/map/point/detail/:id", (req, res) => {
  res.json({
    code: 0,
    msg: "OK",
    data: {
      info: {
        id: 28743,
        map_id: 2,
        label_id: 3,
        x_pos: -4232.5,
        y_pos: 2944,
        expansion: "",
        display_state: 1,
        version: 4,
        editor: "",
        editor_name: "EricMonlye",
        author: "",
        author_name: "冬卫",
        ctime: "2022-08-24 11:21:05",
        content: "传送锚点·觉王之殿·东",
        img: "https://webstatic.mihoyo.com/upload/wiki-ys-map/2022/08/24/243156870/950c0314ce0ef52df93322c9b3173afb_7231103071544122512.jpg",
        url_list: [
          {
            text: "锚点开启方法",
            url: "https://bbs.mihoyo.com/ys/article/27964030",
          },
        ],
        record_id: "116922",
        area_id: 4,
        ext_attrs: "{}",
        z_level: 0,
        icon_sign: 0,
        video: {
          cover_url: "",
          duration: 0,
          detail: null,
        },
      },
      correct_user_list: [
        {
          name: "祀非不废",
          img: "https://bbs-static.miyoushe.com/communityweb/upload/29fab2f6cec22b79225726a73f1741c0.png",
          ctime: "2022-08-31 10:32:41",
        },
        {
          name: "RT任地",
          img: "https://bbs-static.miyoushe.com/communityweb/upload/77b466232303de73e16cadb5271d9ae2.png",
          ctime: "2022-08-25 19:55:06",
        },
      ],
      last_update_time: "2022-08-31 10:32:41",
    },
  });
});

export default router;
