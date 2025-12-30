
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  createdAt: number;
  isPinned?: boolean; // 是否置顶/快捷访问
}

export interface RedirectRule {
  prefix: string;
  target: string;
}

export type WidgetType = 'none' | 'weather' | 'quote' | 'notes' | 'crypto' | 'calendar' | 'clock' | 'market';

export interface AppConfig {
  siteTitle: string;
  redirects: RedirectRule[];
  groupOrder?: string[]; // 分组排序列表
  collapsedGroups?: string[]; // 已折叠的分组名称列表
  backgroundImage?: string; // 自定义背景图片 URL
  searchEngineUrl?: string; // 自定义搜索引擎前缀
  
  // View Settings (Synced)
  cardSize?: 'small' | 'medium' | 'large';
  cardMode?: 'standard' | 'icon-only';
  bgOverlayOpacity?: number; // 背景遮罩透明度 (0-100)
  bgBlur?: number; // 背景模糊度 px
  
  // New: Background Motion & Caching
  enableBgMotion?: boolean; // 是否开启背景动态效果 (Ken Burns Effect)
  cachedWeatherBgUrl?: string; // 缓存的自动天气背景 URL (存入 KV)

  // Font & Appearance Settings (New)
  fontScale?: number; // 字体大小缩放 (0.8 - 1.5, 默认为 1)
  fontColor?: string; // 全局字体颜色 (Hex)
  textShadowStrength?: number; // 字体阴影强度 (0 - 100)

  // Widgets
  leftWidget?: WidgetType;
  rightWidget?: WidgetType;
  widgetNote?: string; // 便签内容
  
  // New Feature
  autoWeatherBg?: boolean; // 是否根据天气自动切换背景
  customLocation?: string; // 自定义天气位置 (城市名)
}

// Represents the data structure stored in Cloudflare KV
export interface KVData {
  bookmarks: Bookmark[];
  config: AppConfig;
}