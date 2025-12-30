import React, { useState, useEffect } from 'react';
import { GlassButton, GlassInput } from './ui/Glass';
import { CardSize, CardMode } from './BookmarkCard';
import { AppConfig, WidgetType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  size: CardSize;
  setSize: (s: CardSize) => void;
  mode: CardMode;
  setMode: (m: CardMode) => void;
  currentBg?: string;
  config?: AppConfig; // 传入完整配置
  onUpdateConfig: (config: Partial<AppConfig>) => void;
}

export const ViewSettingsModal: React.FC<Props> = ({ 
  isOpen, onClose, size, setSize, mode, setMode, 
  currentBg = '', config, onUpdateConfig
}) => {
  const [bgUrl, setBgUrl] = useState(currentBg);
  const [leftWidget, setLeftWidget] = useState<WidgetType>('none');
  const [rightWidget, setRightWidget] = useState<WidgetType>('none');
  const [autoWeatherBg, setAutoWeatherBg] = useState(false);
  const [enableBgMotion, setEnableBgMotion] = useState(true); // 默认为 true
  const [customLocation, setCustomLocation] = useState('');
  
  // 背景高级设置
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(40);
  const [bgBlur, setBgBlur] = useState(0);
  
  const sizeMap: Record<CardSize, number> = { 'small': 0, 'medium': 1, 'large': 2 };
  const revSizeMap: Record<number, CardSize> = { 0: 'small', 1: 'medium', 2: 'large' };
  
  const [sliderVal, setSliderVal] = useState(1);

  // Sync state
  useEffect(() => {
    setBgUrl(currentBg);
    if (config) {
        setLeftWidget(config.leftWidget || 'none');
        setRightWidget(config.rightWidget || 'none');
        setAutoWeatherBg(config.autoWeatherBg || false);
        setEnableBgMotion(config.enableBgMotion !== false); // 默认为 true
        setCustomLocation(config.customLocation || '');
        setBgOverlayOpacity(config.bgOverlayOpacity !== undefined ? config.bgOverlayOpacity : 40);
        setBgBlur(config.bgBlur !== undefined ? config.bgBlur : 0);
    }
  }, [currentBg, config, isOpen]);

  useEffect(() => {
      if(isOpen) {
          setSliderVal(sizeMap[size]);
      }
  }, [size, isOpen]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10);
      setSliderVal(val);
      const newSize = revSizeMap[val];
      setSize(newSize);
  };

  const handleSave = () => {
    onUpdateConfig({
        backgroundImage: bgUrl,
        cardSize: size,
        cardMode: mode,
        leftWidget,
        rightWidget,
        autoWeatherBg,
        enableBgMotion,
        customLocation,
        bgOverlayOpacity,
        bgBlur
    });
    onClose();
  };

  if (!isOpen) return null;

  const widgetOptions = (
      <>
        <option value="none">关闭</option>
        <option value="weather">天气</option>
        <option value="market">股市/市场 (上证指数)</option>
        <option value="quote">每日一言</option>
        <option value="clock">数字时钟</option>
        <option value="calendar">迷你日历</option>
        <option value="notes">日程笔记</option>
      </>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1e293b]/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          视图设置
        </h2>
        
        <div className="space-y-8">
          
          {/* Widgets Section */}
          <div>
            <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider">小组件 (Widgets)</label>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">时间左侧</label>
                    <select 
                        value={leftWidget}
                        onChange={(e) => setLeftWidget(e.target.value as WidgetType)}
                        className="w-full bg-black/20 text-white text-sm rounded-lg p-2 border border-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        {widgetOptions}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">时间右侧</label>
                    <select 
                        value={rightWidget}
                        onChange={(e) => setRightWidget(e.target.value as WidgetType)}
                        className="w-full bg-black/20 text-white text-sm rounded-lg p-2 border border-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        {widgetOptions}
                    </select>
                </div>
            </div>

            {/* 自定义天气位置 */}
            {(leftWidget === 'weather' || rightWidget === 'weather') && (
                <div className="mt-3">
                    <label className="text-[10px] text-gray-500 mb-1 block">天气位置 (留空则自动定位)</label>
                    <GlassInput 
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        placeholder="例如: 北京, Shanghai, 100001"
                        className="text-sm py-2"
                    />
                </div>
            )}
          </div>

          <div className="border-t border-white/5 my-4"></div>

          {/* Display Mode */}
          <div>
            <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider">显示模式</label>
            <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-xl">
              <button 
                onClick={() => setMode('standard')}
                className={`py-2 rounded-lg text-sm transition-all ${mode === 'standard' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                标准卡片
              </button>
              <button 
                onClick={() => setMode('icon-only')}
                className={`py-2 rounded-lg text-sm transition-all ${mode === 'icon-only' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                仅图标
              </button>
            </div>
          </div>

          {/* Card Size Slider */}
          <div>
            <div className="flex justify-between items-end mb-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider">图标大小</label>
                <span className="text-sm font-medium text-purple-300">
                    {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                </span>
            </div>
            
            <div className="relative h-10 flex items-center px-2">
                 <div className="absolute left-2 right-2 h-1.5 bg-white/10 rounded-full"></div>
                 <div className="absolute left-2 w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                 <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                 <div className="absolute right-2 w-1.5 h-1.5 bg-gray-500 rounded-full"></div>

                 <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="1" 
                    value={sliderVal}
                    onChange={handleSliderChange}
                    className="w-full absolute inset-0 z-20 opacity-0 cursor-pointer"
                 />
                 
                 <div 
                    className="absolute h-5 w-5 bg-purple-500 rounded-full shadow-lg border-2 border-white pointer-events-none transition-all duration-150 ease-out"
                    style={{ left: `calc(${sliderVal * 50}% - 10px)` }} 
                 ></div>
            </div>
          </div>

          <div className="border-t border-white/5 my-4"></div>

          {/* Custom Wallpaper & Auto Weather */}
          <div>
            <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider">壁纸设置</label>
            
            <div className="space-y-3 mb-3 bg-white/5 p-3 rounded-lg border border-white/5">
                {/* 自动天气开关 */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-200">智能天气背景</span>
                        <span className="text-[10px] text-gray-500">根据当前天气自动切换壁纸</span>
                    </div>
                    <button 
                        onClick={() => setAutoWeatherBg(!autoWeatherBg)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${autoWeatherBg ? 'bg-purple-600' : 'bg-gray-600'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoWeatherBg ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>
                
                {/* 动态效果开关 */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-200">动态背景效果</span>
                        <span className="text-[10px] text-gray-500">Ken Burns 缓慢移动视效</span>
                    </div>
                    <button 
                        onClick={() => setEnableBgMotion(!enableBgMotion)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${enableBgMotion ? 'bg-purple-600' : 'bg-gray-600'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${enableBgMotion ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>

            <GlassInput 
                value={bgUrl} 
                onChange={(e) => setBgUrl(e.target.value)}
                placeholder="或输入图片 URL"
                className="text-sm mb-4"
                disabled={autoWeatherBg} // 互斥
            />

            {/* 背景遮罩透明度滑块 */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-gray-500">背景遮罩浓度</label>
                    <span className="text-[10px] text-purple-300">{bgOverlayOpacity}%</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="90" 
                    value={bgOverlayOpacity}
                    onChange={(e) => setBgOverlayOpacity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
            </div>

            {/* 背景模糊度滑块 */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-gray-500">背景模糊 (Blur)</label>
                    <span className="text-[10px] text-purple-300">{bgBlur}px</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={bgBlur}
                    onChange={(e) => setBgBlur(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
            </div>

            {!autoWeatherBg && !bgUrl && (
                <p className="text-xs text-gray-500 mt-2">
                    当前使用默认动态渐变。
                </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
          <GlassButton variant="ghost" onClick={onClose}>取消</GlassButton>
          <GlassButton onClick={handleSave}>保存视图设置</GlassButton>
        </div>
      </div>
    </div>
  );
};