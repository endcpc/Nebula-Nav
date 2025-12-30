
# 🌌 Nebula Nav (星云导航)

Nebula Nav 是一个基于 **Cloudflare Pages** 和 **Cloudflare KV** 构建的现代化、高颜值个人导航页。它采用 React + Vite 开发，拥有磨砂玻璃（Glassmorphism）的 UI 风格，支持全端适配、服务端数据存储、以及强大的书签管理功能。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages%20%26%20KV-orange.svg)

## ✨ 核心亮点

### 🎨 极致 UI 与个性化
*   **磨砂玻璃设计**: 全局动态渐变背景 + 半透明卡片，视觉效果现代、通透。
*   **视图自定义**: 
    *   支持切换 **标准卡片** (图标+文字) 或 **仅图标** 模式。
    *   支持调节图标大小 (小/中/大)。
    *   **智能天气动态壁纸**: 
        *   支持根据实时天气（晴、雨、雪、夜等）自动切换精美壁纸。
        *   **动态视效**: 支持 Ken Burns 效果（缓慢缩放平移），让静态壁纸栩栩如生。
        *   **极致性能**: 天气壁纸 URL 自动缓存至 KV，拒绝加载闪烁。
    *   支持 **自定义背景壁纸** (手动输入图片 URL)。
    *   **全局字体设置**: 支持自定义字体缩放比例、文字颜色及阴影强度。
*   **沉浸式体验**: 首页集成大屏时钟与日期显示，支持动态背景遮罩。

### 🚀 强大的交互体验
*   **全功能拖拽**:
    *   **书签排序**: 自由拖拽书签改变位置。
    *   **跨分组拖拽**: 将书签拖入其他分组自动归类。
    *   **分组排序**: 支持拖拽调整分组（分类）的上下顺序。
    *   **快捷栏排序**: 顶部置顶图标也支持横向拖拽。
*   **移动端优化**: 完美适配手机/平板，支持 **长按呼出菜单** (带震动反馈)，解决移动端右键难题。

### 🛠️ 深度书签管理
*   **书签治理**:
    *   **查重工具**: 内置强大的查重功能，支持按 **URL**、**标题** 或 **主域名** 查找并批量清理重复书签。
    *   **分组管理**: 支持新建、重命名分组，以及点击分组标题进行折叠/展开。
*   **搜索增强**: 集成聚合搜索栏，支持自定义搜索引擎（Google/Bing/Baidu/DDG），支持直接打开搜索结果。
*   **数据导入/导出**:
    *   支持导入 Chrome/Edge 导出的 HTML 书签文件。
    *   支持导入/导出项目专属的 JSON 全量备份（包含配置信息）。
    *   添加书签时自动提取网站 Favicon 图标，支持图片压缩上传。

### 🧩 智能小组件 (Widgets)
*   **天气组件**:
    *   **免配置定位**: 集成 IP 定位功能，无需浏览器授权即可自动获取当前城市天气。
    *   **位置优化**: 支持显示精确的城市名称（通过反向地理编码）。
    *   **本地化**: 完美支持中文天气描述（如“晴”、“多云”），显示实时温度、湿度、风速。
*   **市场组件 (TradingView)**:
    *   **专业图表**: 引入 TradingView Mini Symbol Overview，默认展示 **上证指数** (SSE:000001) 走势。
    *   **美观**: 支持暗色模式，动态交互。

### 🔐 安全与架构
*   **Serverless 架构**: 前端托管于 Cloudflare Pages，数据存储于 Cloudflare KV，全球低延迟。
*   **隐私保护**: 访问、编辑、管理均需通过密码验证 (KV 鉴权)。

## 🛠️ 技术栈

*   **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
*   **Interaction**: @dnd-kit (Core, Sortable, Utilities)
*   **Backend**: Cloudflare Pages Functions (Edge Runtime)
*   **Database**: Cloudflare KV

## 🔄 最近更新 (Changelog)

### v1.2.0 - Visual & Experience Upgrade
*   **动态背景系统**: 
    *   新增 **Ken Burns** 动态效果开关，使天气壁纸具备电影级的缓慢移动视效。
    *   新增 **壁纸 KV 缓存** 机制，首次加载后记录 URL，再次访问时秒开无闪烁。
*   **字体个性化**:
    *   新增全局 **字体设置** 面板，可调节字体大小缩放、全局文字颜色及文字阴影强度。
    *   解决了书签文字颜色与 Tailwind 样式冲突的问题。
*   **UI 优化**:
    *   底部统计栏汉化为 "书签数量" 和 "KV 存储"。
    *   恢复编辑模式入口为标准的齿轮图标。
    *   优化了 Footer 的字体显示效果。
    *   新增底部 **Telegram** 联系方式链接，方便反馈问题。

### v1.1.0 - Weather & Market Optimization
*   **智能天气背景**: 新增根据实时天气自动切换背景图的功能。
*   **位置显示修正**: 天气组件现在能正确显示所在的城市名称，而非笼统的“当前位置”。
*   **市场组件修复**: 修复了 TradingView 组件加载失败的问题，改用稳定性更高的上证指数代码 (`SSE:000001`)。

### v1.0.0 - Widget & UI Upgrade
*   **重构天气组件**:
    *   引入 `ipapi.co` 实现 IP 自动定位。
    *   增加 WMO 天气代码到中文的映射。
    *   优化 UI 布局。
*   **移动端优化**:
    *   顶部时间/小组件区域在移动端支持横向滑动 (Snap Scroll)。

## 🚀 部署指南

本项目专为 Cloudflare Pages 设计，开箱即用。

### 1. 前置准备
*   一个 Cloudflare 账号。
*   GitHub 账号。

### 2. 部署到 Cloudflare Pages

1.  **Fork** 本仓库到你的 GitHub。
2.  登录 Cloudflare Dashboard，进入 **Pages**。
3.  点击 "Connect to Git"，选择你的仓库。
4.  **构建配置**:
    *   **Framework preset**: Vite
    *   **Build command**: `npm run build`
    *   **Output directory**: `dist`
5.  点击 "Save and Deploy"。

### 3. 必要的配置 (关键步骤)

部署完成后，你必须配置 KV 和环境变量才能正常使用。

#### A. 创建 KV 命名空间
在 Cloudflare Dashboard -> Workers & Pages -> KV 中，创建一个新的 Namespace，命名为 `nebula_kv` (或者任意你喜欢的名字)。

#### B. 绑定 KV 到 Pages
1.  进入你的 Pages 项目 -> **Settings** -> **Functions**。
2.  找到 **KV Namespace Bindings**。
3.  添加绑定:
    *   **Variable name**: `NAV_KV` (⚠️ 必须完全一致，代码中读取此变量)
    *   **KV Namespace**: 选择你刚才创建的 `nebula_kv`。

#### C. 设置环境变量
1.  进入你的 Pages 项目 -> **Settings** -> **Environment variables**。
2.  添加以下变量 (Production 和 Preview 都要加):
    *   `AUTH_PASSWORD`: 设置你的访问/管理密码 (例如 `your_secure_password`)。
    *   `VITE_SITE_TITLE`: (可选) 自定义网站标题，默认为 "星云导航"。
    *   `REDIRECTS`: (可选) 路由重定向配置，见下文。

#### D. 重新部署
配置修改后，需要**重新部署**一次（Retry deployment）才能生效。

## ⚙️ 进阶设置

### 路由重定向
项目位于 `functions/_middleware.ts` 中的中间件支持简易的短链接跳转功能。
你可以在环境变量 `REDIRECTS` 中配置 JSON 映射表。

**配置示例 (环境变量值):**
```json
{
  "emby": "https://emby.yourdomain.com",
  "blog": "https://blog.yourdomain.com",
  "monitor": "https://uptime.status.page"
}
```

**支持两种跳转模式：**

1.  **路径跳转 (推荐)**: 
    *   直接支持 `*.pages.dev` 域名。
    *   访问 `https://your-nav.pages.dev/emby` -> 自动跳转至 `https://emby.yourdomain.com`。

2.  **子域名跳转 (高级)**:
    *   仅在使用 **自定义域名** 时生效 (需在 DNS 配置泛解析或对应 CNAME)。
    *   访问 `https://emby.your-custom-domain.com` -> 自动跳转至 `https://emby.yourdomain.com`。

## 🤝 贡献

欢迎提交 Issue 或 Pull Request！

## 📄 License

MIT License.