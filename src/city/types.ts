/** 建筑风格 */
export type BuildingStyle = 'box' | 'stepped' | 'cylinder' | 'pyramid';

/** 颜色方案 */
export type ColorPalette = 'warm' | 'cool' | 'mixed';

/** 单个建筑数据 */
export interface BuildingData {
  id: number;
  row: number;
  col: number;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  style: BuildingStyle;
  color: string;
  roofColor: string;
  hasRoofDecor: boolean;
}

/** 城市参数 */
export interface CityParams {
  gridSize: number;
  buildingDensity: number;
  minHeight: number;
  maxHeight: number;
  seed: number;
  colorPalette: ColorPalette;
  roadWidth: number;
  blockSize: number;
}

/** 默认参数 */
export const DEFAULT_PARAMS: CityParams = {
  gridSize: 8,
  buildingDensity: 0.75,
  minHeight: 0.6,
  maxHeight: 5,
  seed: 42,
  colorPalette: 'mixed',
  roadWidth: 0.25,
  blockSize: 2,
};
