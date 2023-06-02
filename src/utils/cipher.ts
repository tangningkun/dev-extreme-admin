import { encrypt, decrypt } from 'crypto-js/aes';
import { parse } from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import md5 from 'crypto-js/md5';
import UTF8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

/**
 * 加密参数
 */
export interface EncryptionParams {
    key: string;
    iv: string;
}

/**
 * Aes加密
 */
export class AesEncryption {
    private key;
    private iv;

    constructor(opt: Partial<EncryptionParams> = {}) {
        const { key, iv } = opt;
        if (key) {
            this.key = parse(key);
        }
        if (iv) {
            this.iv = parse(iv);
        }
    }

    get getOptions() {
        return {
            mode: ECB,
            padding: pkcs7,
            iv: this.iv,
        };
    }
    /**
     * AES加密
     * @param cipherText
     * @returns
     */
    encryptByAES(cipherText: string) {
        return encrypt(cipherText, this.key, this.getOptions).toString();
    }
    /**
     * AES解密
     * @param cipherText
     * @returns
     */
    decryptByAES(cipherText: string) {
        return decrypt(cipherText, this.key, this.getOptions).toString(UTF8);
    }
}

/**
 * 加密方式Base64
 * @param cipherText
 * @returns
 */
export function encryptByBase64(cipherText: string) {
    return UTF8.parse(cipherText).toString(Base64);
}
/**
 * 解码Base64
 * @param cipherText
 * @returns
 */
export function decodeByBase64(cipherText: string) {
    return Base64.parse(cipherText).toString(UTF8);
}
/**
 * 加密方式Md5
 * @param password
 * @returns
 */
export function encryptByMd5(password: string) {
    return md5(password).toString();
}
