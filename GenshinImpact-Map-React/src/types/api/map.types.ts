export interface PointItemDetail {
  lat: number;
  lng: number;
  pointId: number;
}

// tree 接口数据
export interface TreeDataItem {
  id: number;
  name: string;
  icon: string;
  parent_id: number;
  depth: number;
  node_type: number;
  jump_type: number;
  jump_target_id: number;
  wiki_jump_url: string;
  display_priority: number;
  children: PointItemDetail[] | TreeDataItem[];
  activity_page_label: number;
  area_page_label: [];
  is_all_area: boolean;
  default_show: boolean;
  ch_ext: string;
  sort: number;
  area_label_list: [];
  ext_attr_list: [];
  recommend_route_list: [];
  point_count: number;
  alias_name: string;
  item_id: number;
  rec_refresh_hour: number;
  tips: string;
  lat?: number;
  lng?: number;
  pointId?: number;
}

// list 接口返回数据
export interface AnchorListItem {
  id: string;
  name: string;
  l_x: number;
  l_y: number;
  r_x: number;
  r_y: number;
  app_sn: string;
  parent_id: string;
  map_id: string;
  children: AnchorListItem[];
  sort: number;
  area_id: number;
  lat: number;
  lng: number;
}

// 点位贡献人信息类型
export interface PointCorrectUser {
  name: string;
  img: string;
  ctime: string;
}

// 点位详细信息数据
export interface PointDetail {
  info: {
    id: number;
    map_id: number;
    label_id: number;
    x_pos: number;
    y_pos: number;
    expansion: string;
    display_state: number;
    version: number;
    editor: string;
    editor_name: string;
    author: string;
    author_name: string;
    ctime: string;
    content: string;
    img: string;
    url_list: Array<{
      text: string;
      url: string;
    }>;
    record_id: string;
    area_id: number;
    ext_attrs: string;
    z_level: number;
    icon_sign: number;
    video: {
      cover_url: string;
      duration: number;
      detail: null;
    };
  };
  correct_user_list: PointCorrectUser[];
  last_update_time: string;
}

// 地图外导航点位类型
export interface GuideUIItem {
  lat: number;
  lng: number;
  icon: string;
  angle: number;
}

export interface PointConfig extends PointItemDetail {
  icon: string;
  name: string;
}
