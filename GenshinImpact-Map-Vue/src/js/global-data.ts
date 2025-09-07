import type MapManager from './map-manager'

class GlobalData {
  private static instance: GlobalData
  private constructor() {}

  public static getInstance(): GlobalData {
    if (!GlobalData.instance) {
      GlobalData.instance = new GlobalData()
    }

    return GlobalData.instance
  }

  public mapManager!: MapManager
}

export const globalDataInstance = GlobalData.getInstance()
