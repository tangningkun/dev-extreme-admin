import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * 是否开发环境
 * @param mode
 * @returns
 */
export function isDevFn(mode: string): boolean {
    return mode === 'development';
}
/**
 * 是否生产环境
 * @param mode
 * @returns
 */
export function isProdFn(mode: string): boolean {
    return mode === 'production';
}

/**
 * 是否生成包预览
 */
export function isReportMode(): boolean {
    return process.env.REPORT === 'true';
}

/**
 * Read all environment variable configuration files to process.env
 * 读取所有环境变量配置文件到process.env
 * @param envConf
 * @returns
 */
export function wrapperEnv(envConf: Recordable): ViteEnv {
    const ret: any = {};
    for (const envName of Object.keys(envConf)) {
        let realName = envConf[envName].replace(/\\n/g, '\n');
        realName = realName === 'true' ? true : realName === 'false' ? false : realName;

        if (envName === 'VITE_PORT') {
            realName = Number(realName);
        }
        if (envName === 'VITE_PROXY' && realName) {
            try {
                realName = JSON.parse(realName.replace(/'/g, '"'));
            } catch (error) {
                realName = '';
            }
        }
        ret[envName] = realName;
    }
    return ret;
}

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
    const script = process.env.npm_lifecycle_script;
    const reg = new RegExp('--mode ([a-z_\\d]+)');
    const result = reg.exec(script as string) as any;
    if (result) {
        const mode = result[1] as string;
        return ['.env', `.env.${mode}`];
    }
    return ['.env', '.env.production'];
}

/**
 * Get the environment variables starting with the specified prefix
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export function getEnvConfig(match = 'VITE_GLOB_', confFiles = getConfFiles()) {
    let envConfig = {};
    confFiles.forEach((item) => {
        try {
            const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
            envConfig = { ...envConfig, ...env };
        } catch (e) {
            console.error(`Error in parsing ${item}`, e);
        }
    });
    const reg = new RegExp(`^(${match})`);
    Object.keys(envConfig).forEach((key) => {
        if (!reg.test(key)) {
            Reflect.deleteProperty(envConfig, key);
        }
    });
    return envConfig;
}

/**
 * Get user root directory
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
    return path.resolve(process.cwd(), ...dir);
}

export function pathResolve(dir: string) {
    return path.resolve(process.cwd(), '.', dir);
}
