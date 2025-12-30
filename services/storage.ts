import { Bookmark, KVData } from '../types';

// Set to true for Cloudflare Pages deployment
const USE_CLOUD_API = true; 
const STORAGE_KEY = 'nebula_nav_data';

// 获取环境变量中的标题，默认为 '星云导航'
// Safely access import.meta.env
export const DEFAULT_SITE_TITLE = (import.meta as any).env?.VITE_SITE_TITLE || '星云导航';

// Initial Data for Demo (Fallback)
const DEFAULT_DATA: KVData = {
  config: {
    siteTitle: DEFAULT_SITE_TITLE,
    redirects: [],
    groupOrder: ['开发', '媒体', '常用', '未分类'],
    collapsedGroups: [],
    cardSize: 'medium',
    cardMode: 'standard',
    leftWidget: 'weather',
    rightWidget: 'quote',
    widgetNote: '在这里记下你的待办事项...'
  },
  bookmarks: [
    { id: '1', title: 'GitHub', url: 'https://github.com', category: '开发', createdAt: Date.now(), isPinned: true },
    { id: '2', title: 'YouTube', url: 'https://youtube.com', category: '媒体', createdAt: Date.now() },
  ]
};

export const StorageService = {
  async verifyPassword(password: string): Promise<boolean> {
    if (USE_CLOUD_API) {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        return res.ok;
      } catch (e) {
        return false;
      }
    } else {
      return password === 'admin';
    }
  },

  async getData(): Promise<KVData> {
    if (USE_CLOUD_API) {
      try {
        const res = await fetch('/api/data');
        if (res.status === 404) return DEFAULT_DATA; 
        if (!res.ok) throw new Error('Failed to fetch data');
        
        const data = await res.json();
        
        // 关键修复：数据完整性检查
        if (data && (!data.config || !data.bookmarks)) {
           return {
             ...DEFAULT_DATA,
             ...data,
             config: {
                ...DEFAULT_DATA.config,
                ...data.config,
                groupOrder: data.config?.groupOrder || DEFAULT_DATA.config.groupOrder,
                collapsedGroups: data.config?.collapsedGroups || [],
                cardSize: data.config?.cardSize || 'medium',
                cardMode: data.config?.cardMode || 'standard',
                leftWidget: data.config?.leftWidget || 'none',
                rightWidget: data.config?.rightWidget || 'none',
                widgetNote: data.config?.widgetNote || '',
                siteTitle: DEFAULT_SITE_TITLE
             },
             bookmarks: data.bookmarks || []
           };
        }
        
        // 确保 config 对象存在
        if (!data.config) {
            data.config = { ...DEFAULT_DATA.config };
        }

        // 默认值填充
        data.config.siteTitle = DEFAULT_SITE_TITLE;
        if (!data.config.groupOrder) data.config.groupOrder = [];
        if (!data.config.collapsedGroups) data.config.collapsedGroups = [];
        if (!data.config.cardSize) data.config.cardSize = 'medium';
        if (!data.config.cardMode) data.config.cardMode = 'standard';
        if (!data.config.leftWidget) data.config.leftWidget = 'none';
        if (!data.config.rightWidget) data.config.rightWidget = 'none';

        return data;
      } catch (error) {
        console.error("Data fetch error, using default", error);
        return DEFAULT_DATA;
      }
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return DEFAULT_DATA;
      }
      const parsed = JSON.parse(stored);
      if (parsed.config) {
          parsed.config.siteTitle = DEFAULT_SITE_TITLE;
      }
      return parsed;
    }
  },

  async saveData(data: KVData, password?: string): Promise<void> {
    const dataToSave = {
        ...data,
        config: {
            ...data.config,
            siteTitle: DEFAULT_SITE_TITLE
        }
    };

    if (USE_CLOUD_API) {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}` 
        },
        body: JSON.stringify(dataToSave)
      });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      await new Promise(r => setTimeout(r, 500));
    }
  },

  getFavicon(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    } catch (e) {
      return '';
    }
  }
};