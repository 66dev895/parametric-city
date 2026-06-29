import { Building2, Hash, Layers, Palette, Ruler, Sliders, Trees } from 'lucide-react';
import type { CityParams, ColorPalette } from '../city/types';

interface ParamPanelProps {
  params: CityParams;
  onChange(params: CityParams): void;
}

interface SliderDef {
  key: keyof CityParams;
  label: string;
  min: number;
  max: number;
  step: number;
  icon: typeof Sliders;
}

const sliders: SliderDef[] = [
  { key: 'gridSize', label: '街区网格', min: 3, max: 15, step: 1, icon: Hash },
  { key: 'buildingDensity', label: '建筑密度', min: 0.3, max: 1.0, step: 0.05, icon: Building2 },
  { key: 'minHeight', label: '最低高度', min: 0.3, max: 4, step: 0.1, icon: Layers },
  { key: 'maxHeight', label: '最高高度', min: 1, max: 10, step: 0.1, icon: Layers },
  { key: 'roadWidth', label: '道路宽度', min: 0.1, max: 0.6, step: 0.05, icon: Ruler },
  { key: 'blockSize', label: '街区尺寸', min: 1, max: 3, step: 0.1, icon: Ruler },
  { key: 'seed', label: '随机种子', min: 0, max: 9999, step: 1, icon: Hash },
];

const paletteOptions: { value: ColorPalette; label: string; colors: string[] }[] = [
  { value: 'warm', label: '暖色调', colors: ['#e8c9a0', '#d4a574', '#b8845a'] },
  { value: 'cool', label: '冷色调', colors: ['#a8c8e8', '#8898b8', '#6a8298'] },
  { value: 'mixed', label: '混合', colors: ['#e8c9a0', '#8898b8', '#c4956a'] },
];

export function ParamPanel({ params, onChange }: ParamPanelProps) {
  const handleSlider = (key: keyof CityParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  const handlePalette = (palette: ColorPalette) => {
    onChange({ ...params, colorPalette: palette });
  };

  return (
    <aside className="param-panel">
      <div className="param-panel__header">
        <Sliders size={20} />
        <h2>参数控制</h2>
        <span className="param-panel__subtitle">PCG 参数化生成</span>
      </div>

      <div className="param-panel__body">
        {/* 颜色方案 */}
        <div className="param-group">
          <label className="param-group__label">
            <Palette size={14} />
            颜色方案
          </label>
          <div className="palette-row">
            {paletteOptions.map((opt) => (
              <button
                key={opt.value}
                className={`palette-btn${params.colorPalette === opt.value ? ' is-active' : ''}`}
                onClick={() => handlePalette(opt.value)}
                title={opt.label}
              >
                <span className="palette-swatch">
                  {opt.colors.map((c, i) => (
                    <span key={i} className="palette-dot" style={{ background: c }} />
                  ))}
                </span>
                <span className="palette-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 滑块 */}
        {sliders.map(({ key, label, min, max, step, icon: Icon }) => (
          <div className="param-group" key={key}>
            <label className="param-group__label" htmlFor={`slider-${key}`}>
              <Icon size={14} />
              {label}
              <span className="param-value">
                {key === 'buildingDensity'
                  ? `${Math.round(params[key] as number * 100)}%`
                  : key === 'seed'
                    ? params[key]
                    : params[key]}
              </span>
            </label>
            <div className="slider-row">
              <span className="slider-min">{key === 'buildingDensity' ? '30%' : min}</span>
              <input
                id={`slider-${key}`}
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key] as number}
                onChange={(e) => handleSlider(key, parseFloat(e.target.value))}
                className="param-slider"
              />
              <span className="slider-max">
                {key === 'buildingDensity' ? '100%' : key === 'seed' ? '9999' : max}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="param-panel__footer">
        <Trees size={14} />
        <span>Parametric City Generator v1.0</span>
      </div>
    </aside>
  );
}
