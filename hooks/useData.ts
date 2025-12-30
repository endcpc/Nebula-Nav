import { useState, useEffect } from 'react';
import { Bookmark, KVData } from '../types';
import { StorageService } from '../services/storage';
import { parseBackupData } from '../utils/importer';

export const useData = (isAuthenticated: boolean, password: string) => {
  const [data, setData] = useState<KVData | null>(null);
  const [loading, setLoading] = useState(false);

  // Authenticated 时获取数据
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      StorageService.getData()
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  // 通用保存方法，暴露给 App.tsx 用于拖拽等直接数据更新
  const persist = async (newData: KVData) => {
    setData(newData);
    await StorageService.saveData(newData, password);
  };

  const addOrUpdateBookmark = async (partial: Partial<Bookmark>, editingId?: string) => {
    if (!data) return;
    
    let newBookmarks = [...data.bookmarks];
    
    if (editingId) {
      newBookmarks = newBookmarks.map(b => 
        b.id === editingId ? { ...b, ...partial } as Bookmark : b
      );
    } else {
      const newBookmark: Bookmark = {
        id: crypto.randomUUID(),
        title: partial.title || '新站点',
        url: partial.url || '#',
        category: partial.category || '未分类',
        icon: partial.icon,
        createdAt: Date.now(),
        isPinned: false
      };
      newBookmarks.push(newBookmark);
    }

    await persist({ ...data, bookmarks: newBookmarks });
  };

  const deleteBookmark = async (id: string) => {
    if (!data) return;
    if (!window.confirm('确定要删除这个收藏吗？')) return;
    await persist({
      ...data,
      bookmarks: data.bookmarks.filter(b => b.id !== id)
    });
  };

  const togglePin = async (bookmark: Bookmark) => {
    if (!data) return;
    await persist({
      ...data,
      bookmarks: data.bookmarks.map(b => 
        b.id === bookmark.id ? { ...b, isPinned: !b.isPinned } : b
      )
    });
  };

  const moveCategory = async (bookmark: Bookmark, newCategory: string) => {
    if (!data) return;
    await persist({
      ...data,
      bookmarks: data.bookmarks.map(b => 
        b.id === bookmark.id ? { ...b, category: newCategory } : b
      )
    });
  };

  const renameGroup = async (oldName: string, newName: string) => {
    if (!data) return;

    // 1. Update bookmarks
    const newBookmarks = data.bookmarks.map(b => 
      b.category === oldName ? { ...b, category: newName } : b
    );

    // 2. Update group order
    const newGroupOrder = (data.config.groupOrder || []).map(g => 
      g === oldName ? newName : g
    );

    // 3. Update collapsed groups if needed
    const currentCollapsed = new Set(data.config.collapsedGroups || []);
    if (currentCollapsed.has(oldName)) {
        currentCollapsed.delete(oldName);
        currentCollapsed.add(newName);
    }

    await persist({
        ...data,
        bookmarks: newBookmarks,
        config: { 
            ...data.config, 
            groupOrder: newGroupOrder,
            collapsedGroups: Array.from(currentCollapsed)
        }
    });
  };

  const reorderGroups = async (newOrder: string[]) => {
    if (!data) return;
    await persist({
      ...data,
      config: { ...data.config, groupOrder: newOrder }
    });
  };

  const toggleGroupCollapse = async (groupName: string) => {
      if (!data) return;
      const currentSet = new Set(data.config.collapsedGroups || []);
      if (currentSet.has(groupName)) {
          currentSet.delete(groupName);
      } else {
          currentSet.add(groupName);
      }
      
      await persist({
          ...data,
          config: { ...data.config, collapsedGroups: Array.from(currentSet) }
      });
  };

  const updateConfig = async (partialConfig: Partial<typeof data.config>) => {
    if (!data) return;
    await persist({
      ...data,
      config: { ...data.config, ...partialConfig }
    });
  };

  const importData = async (content: string) => {
    if (!data) return;
    
    const parsed = parseBackupData(content);
    if (!parsed) {
        alert("无法识别文件格式。请上传 .html 书签文件或 .json 备份文件。");
        return;
    }

    // 全量恢复
    if ('config' in parsed && 'bookmarks' in parsed) {
        const backup = parsed as KVData;
        if (window.confirm(`确定要恢复备份吗？这将覆盖当前所有数据。\n包含 ${backup.bookmarks.length} 个书签。`)) {
            await persist(backup);
        }
        return;
    }

    // 仅书签导入
    if (Array.isArray(parsed)) {
        const newBookmarks = parsed as Bookmark[];
        if (window.confirm(`准备导入 ${newBookmarks.length} 个书签到当前列表？`)) {
            // Merge logic: append new ones
            await persist({
                ...data,
                bookmarks: [...data.bookmarks, ...newBookmarks]
            });
        }
        return;
    }
  };

  return { 
    data, 
    loading, 
    persist, 
    addOrUpdateBookmark, 
    deleteBookmark, 
    togglePin, 
    updateConfig, 
    importData, 
    moveCategory, 
    renameGroup,
    reorderGroups,
    toggleGroupCollapse
  };
};