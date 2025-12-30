import { useState, useEffect } from 'react';

export interface WeatherData {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
}

interface UseWeatherResult {
    weather: WeatherData | null;
    locationName: string;
    loading: boolean;
    weatherCode: number | null; // 便于外部获取 code
    isDay: boolean;
}

// 简单的缓存机制
let cachedWeather: WeatherData | null = null;
let cachedLocation = '定位中...';
let lastFetchTime = 0;
// 记录上次请求的自定义位置，如果位置变了需要强制刷新
let lastCustomLocation: string | undefined = undefined;

export const useWeather = (enabled: boolean = true, customLocation?: string): UseWeatherResult => {
    const [weather, setWeather] = useState<WeatherData | null>(cachedWeather);
    const [locationName, setLocationName] = useState(cachedLocation);
    const [loading, setLoading] = useState(!cachedWeather);

    useEffect(() => {
        if (!enabled) return;

        // 如果有缓存，且时间小于10分钟，且自定义位置没有发生变化，则使用缓存
        const isSameLocation = customLocation === lastCustomLocation;
        if (cachedWeather && (Date.now() - lastFetchTime < 1000 * 60 * 10) && isSameLocation) {
            setWeather(cachedWeather);
            setLocationName(cachedLocation);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                let lat: number, lon: number, city: string = '未知位置';

                // 1. 优先处理自定义位置 (Geocoding Search)
                if (customLocation && customLocation.trim() !== '') {
                    try {
                        const searchRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(customLocation)}&count=1&language=zh&format=json`);
                        const searchData = await searchRes.json();
                        
                        if (searchData.results && searchData.results.length > 0) {
                            lat = searchData.results[0].latitude;
                            lon = searchData.results[0].longitude;
                            city = searchData.results[0].name;
                        } else {
                            // 搜索不到，抛错进入 fallback 或显示错误
                            throw new Error('City not found');
                        }
                    } catch (e) {
                        console.warn("Custom location failed, falling back to auto.");
                        city = '位置无效';
                        // 防止无限重试，设置默认坐标 (北京) 或终止
                        lat = 39.9042;
                        lon = 116.4074;
                    }
                } else {
                    // 2. 自动定位逻辑
                    try {
                        // 2.1 浏览器定位
                        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
                        });
                        lat = pos.coords.latitude;
                        lon = pos.coords.longitude;
                        
                        // 反向地理编码获取城市名
                        try {
                            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=zh`);
                            const geoData = await geoRes.json();
                            if (geoData.results && geoData.results.length > 0) {
                                city = geoData.results[0].name;
                            } else {
                                city = '当前位置';
                            }
                        } catch (e) {
                            city = '本地';
                        }

                    } catch (geoError) {
                        // 2.2 IP 定位降级
                        const ipRes = await fetch('https://ipapi.co/json/');
                        const ipData = await ipRes.json();
                        lat = ipData.latitude;
                        lon = ipData.longitude;
                        city = ipData.city || ipData.region || '网络定位';
                    }
                }

                // 3. 获取天气数据
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day&timezone=auto`);
                const weatherData = await weatherRes.json();

                if (weatherData.current) {
                    cachedWeather = weatherData.current;
                    cachedLocation = city;
                    lastFetchTime = Date.now();
                    lastCustomLocation = customLocation;
                    
                    setWeather(weatherData.current);
                    setLocationName(city);
                }
            } catch (e) {
                console.error("Weather hook failed", e);
                setLocationName('离线');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [enabled, customLocation]);

    return {
        weather,
        locationName,
        loading,
        weatherCode: weather?.weather_code ?? null,
        isDay: weather?.is_day === 1
    };
};