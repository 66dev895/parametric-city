import { useState, useCallback } from 'react';
import { CityScene } from './components/CityScene';
import { ParamPanel } from './components/ParamPanel';
import { DEFAULT_PARAMS, type CityParams } from './city/types';

export default function App() {
  const [params, setParams] = useState<CityParams>(DEFAULT_PARAMS);

  const handleParamsChange = useCallback((next: CityParams) => {
    setParams(next);
  }, []);

  return (
    <div className="app-shell">
      {/* 顶部标题栏 */}
      <header className="app-header">
        <div className="app-header__title">
          <span className="app-header__icon">🏙️</span>
          <div>
            <h1>参数化城市生成器</h1>
            <p className="app-header__subtitle">Parametric City Generator — 程序化 PCG 演示</p>
          </div>
        </div>
        <div className="app-header__badges">
          <span className="tech-badge">Three.js</span>
          <span className="tech-badge">React</span>
          <span className="tech-badge">PCG</span>
        </div>
      </header>

      {/* 主区域：3D 场景 + 参数面板 */}
      <div className="app-main">
        <CityScene params={params} />
        <ParamPanel params={params} onChange={handleParamsChange} />
      </div>
    </div>
  );
}
