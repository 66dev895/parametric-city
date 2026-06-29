/**
 * 确定性伪随机数生成器（Mulberry32）
 * 同一 seed 始终产生相同的随机序列 —— PCG 核心概念
 */
export function createRNG(seed: number) {
  let state = seed | 0;

  function next(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    /** 返回 [0, 1) 的随机浮点数 */
    next,

    /** 返回 [min, max) 的随机浮点数 */
    range(min: number, max: number): number {
      return min + next() * (max - min);
    },

    /** 返回 [min, max] 的随机整数 */
    int(min: number, max: number): number {
      return Math.floor(min + next() * (max - min + 1));
    },

    /** 从数组中随机选一个元素 */
    pick<T>(arr: readonly T[]): T {
      return arr[Math.floor(next() * arr.length)];
    },

    /** 按概率返回 true */
    chance(probability: number): boolean {
      return next() < probability;
    },
  };
}
