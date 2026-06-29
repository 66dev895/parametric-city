import type { ColorPalette } from './types';

/** 建筑主体颜色调色板 */
const PALETTES: Record<ColorPalette, string[]> = {
  warm: [
    '#e8c9a0', '#d4a574', '#c4956a', '#b8845a',
    '#e0b88a', '#cc9966', '#dbb080', '#c89070',
    '#f0d8b8', '#dab890', '#c8a878', '#b89868',
  ],
  cool: [
    '#a8c8e8', '#8898b8', '#7890a8', '#6a8298',
    '#b0c8d8', '#98a8c0', '#88a0b8', '#7898b0',
    '#c0d4e4', '#a0b8d0', '#90a8c0', '#8098b0',
  ],
  mixed: [
    '#e8c9a0', '#a8c8e8', '#c4956a', '#8898b8',
    '#e0b88a', '#b0c8d8', '#dbb080', '#98a8c0',
    '#f0d8b8', '#a0b8d0', '#c8a878', '#8098b0',
  ],
};

/** 玻璃/窗户颜色 */
const GLASS_COLORS = [
  '#7eb8da', '#8cc4e0', '#6aa8c8', '#9ed0e8',
  '#72b4d4', '#84c0dc', '#78bcd8', '#92cce4',
];

/** 屋顶颜色 */
const ROOF_COLORS = [
  '#4a4a5a', '#3a3a4a', '#5a5a6a', '#444454',
  '#383848', '#505060', '#404050', '#484858',
];

/** 屋顶装饰颜色 */
const DECOR_COLORS = [
  '#8a8a9a', '#7a7a8a', '#9a9aaa', '#6a6a7a',
];

export type MaterialSet = ReturnType<typeof createMaterialSet>;

/**
 * 为城市生成创建一套材质配置
 * 同一 palette + seed 产生相同的材质方案
 */
export function createMaterialSet(palette: ColorPalette, seed: number) {
  // 使用基础 seed 衍生出材质种子
  const bodySeed = seed * 3 + 1;
  const glassSeed = seed * 5 + 2;
  const roofSeed = seed * 7 + 3;
  const decorSeed = seed * 11 + 4;

  const colors = PALETTES[palette];

  function pickBySeed<T>(arr: readonly T[], s: number, index: number): T {
    const i = (s * 13 + index * 17) % arr.length;
    return arr[Math.abs(i)];
  }

  return {
    getBodyColor(index: number): string {
      return pickBySeed(colors, bodySeed, index);
    },
    getGlassColor(index: number): string {
      return pickBySeed(GLASS_COLORS, glassSeed, index);
    },
    getRoofColor(index: number): string {
      return pickBySeed(ROOF_COLORS, roofSeed, index);
    },
    getDecorColor(index: number): string {
      return pickBySeed(DECOR_COLORS, decorSeed, index);
    },
  };
}
