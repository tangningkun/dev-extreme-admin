import type { GlobEnvConfig } from '/#/config';
import pkg from '../../package.json';

const getVariableName = (title: string) => {
    return `__PRODUCTION__${title.replace(/\s/g, '_') || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
};

export function getCommonStoragePrefix() {
    const { VITE_GLOB_APP_TITLE } = getAppEnvConfig();
    return `${VITE_GLOB_APP_TITLE.replace(/\s/g, '_')}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
    return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
    const ENV_NAME = getVariableName(import.meta.env.VITE_GLOB_APP_TITLE);

    const ENV = (import.meta.env.DEV
        ? // Get the global configuration (the configuration will be extracted independently when packaging)
          (import.meta.env as unknown as GlobEnvConfig)
        : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

    const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL } = ENV;

    return {
        VITE_GLOB_APP_TITLE,
        VITE_GLOB_API_URL,
        VITE_GLOB_API_URL_PREFIX,
        VITE_GLOB_UPLOAD_URL,
    };
}

/**
 * @description: Development mode 开发模式
 */
export const devMode = 'development';

/**
 * @description: Production mode 生产模式
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * 获取环境变量
 * @returns:
 * @example:
 */
export function getEnv(): string {
    return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * 是否开发模式
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
    return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * 是否生产模式
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
    return import.meta.env.PROD;
}
