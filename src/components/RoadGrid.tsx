import { useMemo } from 'react';
import * as THREE from 'three';

interface RoadGridProps {
  gridSize: number;
  roadWidth: number;
  blockSize: number;
  totalSpan: number;
}

/** 地面 + 道路网格 —— 区分马路和建筑地块 */
export function RoadGrid({ gridSize, roadWidth, blockSize, totalSpan }: RoadGridProps) {
  // 地面
  const groundSize = totalSpan + 2;

  // 道路材质
  const roadMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3a3a4a',
    roughness: 0.9,
  }), []);

  const sidewalkMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#5a5a6a',
    roughness: 0.85,
  }), []);

  const blockMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a3a2a',
    roughness: 1,
  }), []);

  // 生成地块平面
  const blocks = useMemo(() => {
    const result: { x: number; z: number }[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = (col + 0.5) * blockSize + (col + 1) * roadWidth - totalSpan / 2;
        const z = (row + 0.5) * blockSize + (row + 1) * roadWidth - totalSpan / 2;
        result.push({ x, z });
      }
    }
    return result;
  }, [gridSize, blockSize, roadWidth, totalSpan]);

  // 生成道路线条
  const roadLines = useMemo(() => {
    const halfSpan = totalSpan / 2;
    const lines: { start: [number, number, number]; end: [number, number, number] }[] = [];

    // 横向道路
    for (let i = 0; i <= gridSize; i++) {
      const z = i * blockSize + i * roadWidth - halfSpan;
      lines.push({
        start: [-halfSpan, 0.005, z],
        end: [halfSpan, 0.005, z],
      });
    }

    // 纵向道路
    for (let i = 0; i <= gridSize; i++) {
      const x = i * blockSize + i * roadWidth - halfSpan;
      lines.push({
        start: [x, 0.005, -halfSpan],
        end: [x, 0.005, halfSpan],
      });
    }

    return lines;
  }, [gridSize, blockSize, roadWidth, totalSpan]);

  return (
    <group>
      {/* 大地基底 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial color="#1a2a1a" roughness={1} />
      </mesh>

      {/* 道路面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[totalSpan, totalSpan]} />
        <meshStandardMaterial color="#383848" roughness={0.9} />
      </mesh>

      {/* 建筑地块（绿色） */}
      {blocks.map((block, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[block.x, 0.001, block.z]}
          receiveShadow
        >
          <planeGeometry args={[blockSize * 0.95, blockSize * 0.95]} />
          <meshStandardMaterial color="#2a3a2a" roughness={1} />
        </mesh>
      ))}

      {/* 人行道（道路边缘亮色） */}
      {roadLines.map((line, i) => (
        <mesh key={`sidewalk-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
          <planeGeometry args={[
            line.start[2] === line.end[2] ? totalSpan : roadWidth * 0.6,
            line.start[0] === line.end[0] ? totalSpan : roadWidth * 0.6,
          ]} />
          <primitive object={sidewalkMat} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
