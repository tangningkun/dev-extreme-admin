import { getStorageShortName } from '/@/utils/env';
import { createStorage as create, CreateStorageParams } from './storageCache';
import { enableStorageEncryption } from '/@/settings/encryptionSetting';
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';

export type Options = Partial<CreateStorageParams>;

const createOptions = (storage: Storage, options: Options = {}): Options => {
    return {
        // No encryption in debug mode
        hasEncrypt: enableStorageEncryption,
        storage,
        prefixKey: getStorageShortName(),
        ...options,
    };
};

export const WebStorage = create(createOptions(sessionStorage));

export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => {
    return create(createOptions(storage, options));
};

/**
 * 创建SESSION缓存
 * @param options
 * @returns
 */
export const createSessionStorage = (options: Options = {}) => {
    return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

/**
 * 创建本地存储
 * @param options
 * @returns
 */
export const createLocalStorage = (options: Options = {}) => {
    return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export default WebStorage;
