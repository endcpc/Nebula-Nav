// Add missing type definitions for Cloudflare Pages
interface EventContext<Env, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}

type PagesFunction<Env = unknown, Params extends string = any, Data extends Record<string, unknown> = Record<string, unknown>> = (context: EventContext<Env, Params, Data>) => Response | Promise<Response>;

interface Env {
  REDIRECTS: string; // JSON string in environment variables
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  
  // 1. 解析重定向配置 (从环境变量 REDIRECTS 读取 JSON)
  let redirects: Record<string, string> | null = null;
  try {
    if (context.env.REDIRECTS) {
      redirects = JSON.parse(context.env.REDIRECTS);
    }
  } catch (e) {
    // console.error("Failed to parse REDIRECTS json");
  }

  // 如果没有配置，直接放行
  if (!redirects || Object.keys(redirects).length === 0) {
    return context.next();
  }

  // 2. 模式一：路径重定向 (Path-based) - 优先级高，支持所有域名 (包括 pages.dev)
  // 示例: 访问 https://nav.pages.dev/emby -> 跳转到 https://emby.xxx.com
  // 逻辑: 提取路径的第一段作为 Key
  
  // 排除系统路径和资源
  if (!url.pathname.startsWith('/api/') && !url.pathname.startsWith('/assets/')) {
    // 提取 Key: /emby/some-path -> emby
    const pathKey = decodeURIComponent(url.pathname.slice(1).split('/')[0]);
    
    if (pathKey && redirects[pathKey]) {
      return Response.redirect(redirects[pathKey], 302);
    }
  }

  // 3. 模式二：子域名重定向 (Subdomain-based) - 仅限自定义域名
  // 示例: 访问 https://emby.your-domain.com -> 跳转到 https://emby.xxx.com
  // 注意: Cloudflare Pages 的默认域名 (*.pages.dev) 不支持随意使用子域名，因此此处将其排除，避免与项目名冲突。
  
  if (!url.hostname.includes('pages.dev')) {
    const hostnameParts = url.hostname.split('.');
    // 简单的判断逻辑：至少有三段 (sub.domain.com)
    if (hostnameParts.length >= 3) {
      const prefix = hostnameParts[0].toLowerCase();
      
      // 排除 www 和 nav 等常见前缀
      if (prefix !== 'www' && prefix !== 'nav') {
        if (redirects[prefix]) {
           return Response.redirect(redirects[prefix], 302);
        }
      }
    }
  }

  // 没有命中规则，继续处理请求（返回前端页面）
  return context.next();
}