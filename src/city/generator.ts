import { createRNG } from '../utils/random';
import { createMaterialSet } from './materials';
import type { BuildingData, BuildingStyle, CityParams } from './types';

const BUILDING_STYLES: BuildingStyle[] = ['box', 'stepped', 'cylinder', 'pyramid'];

/**
 * PCG 核心：根据参数生成城市建筑数据
 * 相同参数 → 完全相同的城市（确定性生成）
 */
export function generateCity(params: CityParams): BuildingData[] {
  const rng = createRNG(params.seed);
  const materials = createMaterialSet(params.colorPalette, params.seed);
  const buildings: BuildingData[] = [];
  const { gridSize, buildingDensity, minHeight, maxHeight, roadWidth, blockSize } = params;

  let id = 0;

  // 计算总跨度：gridSize 个街区 + (gridSize+1) 条道路
  const totalSpan = gridSize * blockSize + (gridSize + 1) * roadWidth;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // 按概率决定该地块是否建楼
      if (!rng.chance(buildingDensity)) continue;

      // 地块中心坐标（考虑道路偏移）
      const x = (col + 0.5) * blockSize + (col + 1) * roadWidth - totalSpan / 2;
      const z = (row + 0.5) * blockSize + (row + 1) * roadWidth - totalSpan / 2;

      // 建筑尺寸（留出地块内边距）
      const maxBuildingWidth = blockSize * 0.85;
      const maxBuildingDepth = blockSize * 0.85;
      const width = rng.range(maxBuildingWidth * 0.5, maxBuildingWidth);
      const depth = rng.range(maxBuildingDepth * 0.5, maxBuildingDepth);

      // 建筑高度（越高越稀有）
      const heightT = rng.next();
      const height = minHeight + heightT * heightT * (maxHeight - minHeight);

      // 随机风格（越高越可能是 cylinder/pyramid）
      const style = height > (maxHeight - minHeight) * 0.6 + minHeight
        ? rng.pick(['cylinder', 'pyramid', 'stepped', 'box'] as BuildingStyle[])
        : rng.pick(BUILDING_STYLES);

      buildings.push({
        id: id++,
        row,
        col,
        x,
        z,
        width,
        depth,
        height: Math.round(height * 10) / 10,
        style,
        color: materials.getBodyColor(id),
        roofColor: materials.getRoofColor(id),
        hasRoofDecor: rng.chance(0.4),
      });
    }
  }

  return buildings;
}

/** 根据 gridSize 计算场景总尺寸 */
export function getSceneSize(gridSize: number, roadWidth: number, blockSize: number): number {
  return gridSize * blockSize + (gridSize + 1) * roadWidth;
}
