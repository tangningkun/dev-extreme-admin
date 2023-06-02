import { cacheCipher } from '/@/settings/encryptionSetting';
import type { EncryptionParams } from '/@/utils/cipher';
import { AesEncryption } from '/@/utils/cipher';
import { isNullOrUnDef } from '/@/utils/is';

export interface CreateStorageParams extends EncryptionParams {
    prefixKey: string;
    storage: Storage;
    hasEncrypt: boolean;
    timeout?: Nullable<number>;
}
export const createStorage = ({ prefixKey = '', storage = sessionStorage, key = cacheCipher.key, iv = cacheCipher.iv, timeout = null, hasEncrypt = true }: Partial<CreateStorageParams> = {}) => {
    if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
        throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
    }

    const encryption = new AesEncryption({ key, iv });

    /**
     * 缓存类
     * 构造参数可以传入sessionStorage,localStorage,
     * @class 缓存
     * @例子
     */
    const WebStorage = class WebStorage {
        private storage: Storage;
        private prefixKey?: string;
        private encryption: AesEncryption;
        private hasEncrypt: boolean;
        /**
         *
         * @param {*} 存储
         */
        constructor() {
            this.storage = storage;
            this.prefixKey = prefixKey;
            this.encryption = encryption;
            this.hasEncrypt = hasEncrypt;
        }

        private getKey(key: string) {
            return `${this.prefixKey}${key}`.toUpperCase();
        }

        /**
         * 设置缓存
         * @param {string} 键
         * @param {*} 值
         * @param {*} expire 过期时间，单位秒
         * @memberof 缓存
         */
        set(key: string, value: any, expire: number | null = timeout) {
            const stringData = JSON.stringify({
                value,
                time: Date.now(),
                expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null,
            });
            const stringifyValue = this.hasEncrypt ? this.encryption.encryptByAES(stringData) : stringData;
            this.storage.setItem(this.getKey(key), stringifyValue);
        }

        /**
         * 读取缓存
         * @param {string} 键
         * @param {*} 定义
         * @memberof 缓存
         */
        get(key: string, def: any = null): any {
            const val = this.storage.getItem(this.getKey(key));
            if (!val) {
                return def;
            }

            try {
                const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;
                const data = JSON.parse(decVal);
                const { value, expire } = data;
                if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
                    return value;
                }
                this.remove(key);
            } catch (e) {
                return def;
            }
        }

        /**
         * 根据key删除缓存
         * @param {string} 键
         * @memberof 缓存
         */
        remove(key: string) {
            this.storage.removeItem(this.getKey(key));
        }

        /**
         * 删除本实例的所有缓存
         */
        clear(): void {
            this.storage.clear();
        }
    };
    return new WebStorage();
};
