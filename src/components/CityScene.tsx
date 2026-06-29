import { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Building } from './Building';
import { RoadGrid } from './RoadGrid';
import { generateCity, getSceneSize } from '../city/generator';
import type { CityParams } from '../city/types';

interface CitySceneContentProps {
  params: CityParams;
}

/** 场景内容 */
function SceneContent({ params }: CitySceneContentProps) {
  const buildings = useMemo(() => generateCity(params), [params]);
  const totalSpan = useMemo(
    () => getSceneSize(params.gridSize, params.roadWidth, params.blockSize),
    [params.gridSize, params.roadWidth, params.blockSize],
  );

  // 动态调整相机距离
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const dist = totalSpan * 1.2;
    camera.position.set(dist * 0.7, dist * 0.8, dist * 0.7);
    camera.lookAt(0, 0, 0);
  }, [totalSpan, camera]);

  return (
    <>
      {/* 灯光 */}
      <ambientLight intensity={2.5} color="#8899bb" />
      <directionalLight
        position={[15, 25, 10]}
        intensity={4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#88aacc', '#334422', 1.5]} />

      {/* 地面 + 道路 */}
      <RoadGrid
        gridSize={params.gridSize}
        roadWidth={params.roadWidth}
        blockSize={params.blockSize}
        totalSpan={totalSpan}
      />

      {/* 建筑群 */}
      {buildings.map((building) => (
        <Building key={building.id} data={building} />
      ))}

      {/* 轨道控制 */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        minDistance={3}
        maxDistance={totalSpan * 3}
        maxPolarAngle={Math.PI / 2.3}
        target={[0, 1, 0]}
      />
    </>
  );
}

interface CitySceneProps {
  params: CityParams;
}

/** 3D 场景容器 */
export function CityScene({ params }: CitySceneProps) {
  return (
    <div className="city-scene">
      <Canvas
        shadows
        camera={{ position: [15, 15, 15], fov: 45, near: 0.5, far: 200 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: 'linear-gradient(180deg, #1a1a3a 0%, #2a3a5a 40%, #4a5a7a 100%)' }}
      >
        <SceneContent params={params} />
      </Canvas>

      {/* 建筑计数叠加层 */}
      <div className="scene-overlay">
        <span className="overlay-badge">
          {generateCity(params).length} 栋建筑
        </span>
        <span className="overlay-badge">
          Seed: {params.seed}
        </span>
      </div>
    </div>
  );
}
