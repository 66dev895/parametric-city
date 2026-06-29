import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { BuildingData } from '../city/types';

interface BuildingProps {
  data: BuildingData;
}

/** 单个建筑 3D 模型 —— 根据 style 生成不同的几何体 */
export function Building({ data }: BuildingProps) {
  const { x, z, width, depth, height, style, color, roofColor, hasRoofDecor } = data;
  const groupRef = useRef<THREE.Group>(null);

  const bodyColor = useMemo(() => new THREE.Color(color), [color]);
  const roofCol = useMemo(() => new THREE.Color(roofColor), [roofColor]);

  const halfW = width / 2;
  const halfD = depth / 2;

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {/* 建筑主体 */}
      {style === 'box' && <BoxBody halfW={halfW} halfD={halfD} height={height} color={bodyColor} />}
      {style === 'stepped' && <SteppedBody halfW={halfW} halfD={halfD} height={height} color={bodyColor} />}
      {style === 'cylinder' && <CylinderBody halfW={halfW} halfD={halfD} height={height} color={bodyColor} />}
      {style === 'pyramid' && <PyramidBody halfW={halfW} halfD={halfD} height={height} color={bodyColor} />}

      {/* 屋顶装饰（空调外机 / 水箱等） */}
      {hasRoofDecor && style !== 'pyramid' && (
        <RoofDecor
          x={halfW * 0.7}
          z={halfD * 0.5}
          roofY={height}
          width={width * 0.15}
          height={0.25}
          depth={depth * 0.12}
          color={roofCol}
        />
      )}
    </group>
  );
}

/** 标准长方体建筑 */
function BoxBody({ halfW, halfD, height, color }: { halfW: number; halfD: number; height: number; color: THREE.Color }) {
  return (
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[halfW * 2, height, halfD * 2]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

/** 阶梯式建筑 —— 逐层缩小的长方体堆叠 */
function SteppedBody({ halfW, halfD, height, color }: { halfW: number; halfD: number; height: number; color: THREE.Color }) {
  const steps = 3;
  const stepHeight = height / steps;
  const segments = Array.from({ length: steps }, (_, i) => {
    const scale = 1 - i * 0.15;
    return {
      w: halfW * 2 * scale,
      d: halfD * 2 * scale,
      h: stepHeight,
      y: stepHeight * i + stepHeight / 2,
    };
  });

  return (
    <>
      {segments.map((seg, i) => (
        <mesh key={i} position={[0, seg.y, 0]} castShadow>
          <boxGeometry args={[seg.w, seg.h, seg.d]} />
          <meshStandardMaterial color={color} roughness={0.55} metalness={0.1} />
        </mesh>
      ))}
    </>
  );
}

/** 圆柱形建筑（高层塔楼） */
function CylinderBody({ halfW, halfD, height, color }: { halfW: number; halfD: number; height: number; color: THREE.Color }) {
  const radius = Math.min(halfW, halfD) * 0.9;
  return (
    <mesh position={[0, height / 2, 0]} castShadow>
      <cylinderGeometry args={[radius, radius, height, 16]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
    </mesh>
  );
}

/** 金字塔形建筑（地标） */
function PyramidBody({ halfW, halfD, height, color }: { halfW: number; halfD: number; height: number; color: THREE.Color }) {
  const baseW = halfW * 2 * 0.9;
  const baseD = halfD * 2 * 0.9;
  return (
    <mesh position={[0, height / 2, 0]} castShadow>
      <coneGeometry args={[Math.max(baseW, baseD) / 2, height, 4]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
    </mesh>
  );
}

/** 屋顶装饰（简化空调外机/水箱） */
function RoofDecor({ x, z, roofY, width, height, depth, color }: {
  x: number; z: number; roofY: number; width: number; height: number; depth: number; color: THREE.Color;
}) {
  const decorColor = color.clone().multiplyScalar(0.7);
  return (
    <group position={[x, roofY + height / 2, z]}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={decorColor} roughness={0.7} metalness={0.3} />
      </mesh>
      {/* 小管道 */}
      <mesh position={[0, height * 0.6, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.015, 0.015, 0.08, 6]} />
        <meshStandardMaterial color="#666" roughness={0.5} />
      </mesh>
    </group>
  );
}
