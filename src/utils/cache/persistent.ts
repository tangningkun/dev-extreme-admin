import type { LockInfo, UserInfo } from '/#/store';
import type { ProjectConfig } from '/#/config';
import type { RouteLocationNormalized } from 'vue-router';

import { createLocalStorage, createSessionStorage } from '/@/utils/cache';
import { Memory } from './memory';
import { TOKEN_KEY, USER_INFO_KEY, ROLES_KEY, LOCK_INFO_KEY, PROJ_CFG_KEY, APP_LOCAL_CACHE_KEY, APP_SESSION_CACHE_KEY, MULTIPLE_TABS_KEY } from '/@/enums/cacheEnum';
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';
import { toRaw } from 'vue';
import { pick, omit } from 'lodash-es';

interface BasicStore {
    [TOKEN_KEY]: string | number | null | undefined;
    [USER_INFO_KEY]: UserInfo;
    [ROLES_KEY]: string[];
    [LOCK_INFO_KEY]: LockInfo;
    [PROJ_CFG_KEY]: ProjectConfig;
    [MULTIPLE_TABS_KEY]: RouteLocationNormalized[];
}

type LocalStore = BasicStore;

type SessionStore = BasicStore;

export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;
type SessionKeys = keyof SessionStore;

const local = createLocalStorage();
const session = createSessionStorage();

const localMemory = new Memory(DEFAULT_CACHE_TIME);
const sessionMemory = new Memory(DEFAULT_CACHE_TIME);

/**
 * 初始化持久内存
 */
function initPersistentMemory() {
    const localCache = local.get(APP_LOCAL_CACHE_KEY);
    const sessionCache = session.get(APP_SESSION_CACHE_KEY);
    localCache && localMemory.resetCache(localCache);
    sessionCache && sessionMemory.resetCache(sessionCache);
}

export class Persistent {
    /**
     * 获取本地缓存值
     * @param key
     * @returns
     */
    static getLocal<T>(key: LocalKeys) {
        return localMemory.get(key)?.value as Nullable<T>;
    }
    /**
     * 给本地缓存赋值
     * @param key
     * @param value
     * @param immediate
     */
    static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
        localMemory.set(key, toRaw(value));
        immediate && local.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
    }
    /**
     *
     * @param key 删除本地缓存
     * @param immediate
     */
    static removeLocal(key: LocalKeys, immediate = false): void {
        localMemory.remove(key);
        immediate && local.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
    }
    /**
     * 清除本地缓存
     * @param immediate
     */
    static clearLocal(immediate = false): void {
        localMemory.clear();
        immediate && local.clear();
    }

    static getSession<T>(key: SessionKeys) {
        return sessionMemory.get(key)?.value as Nullable<T>;
    }

    static setSession(key: SessionKeys, value: SessionStore[SessionKeys], immediate = false): void {
        sessionMemory.set(key, toRaw(value));
        immediate && session.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
    }

    static removeSession(key: SessionKeys, immediate = false): void {
        sessionMemory.remove(key);
        immediate && session.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
    }
    static clearSession(immediate = false): void {
        sessionMemory.clear();
        immediate && session.clear();
    }

    static clearAll(immediate = false) {
        sessionMemory.clear();
        localMemory.clear();
        if (immediate) {
            local.clear();
            session.clear();
        }
    }
}

window.addEventListener('beforeunload', function () {
    // TOKEN_KEY 在登录或注销时已经写入到storage了，此处为了解决同时打开多个窗口时token不同步的问题
    // LOCK_INFO_KEY 在锁屏和解锁时写入，此处也不应修改
    local.set(APP_LOCAL_CACHE_KEY, {
        ...omit(localMemory.getCache, LOCK_INFO_KEY),
        ...pick(local.get(APP_LOCAL_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
    });
    session.set(APP_SESSION_CACHE_KEY, {
        ...omit(sessionMemory.getCache, LOCK_INFO_KEY),
        ...pick(session.get(APP_SESSION_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
    });
});

function storageChange(e: any) {
    const { key, newValue, oldValue } = e;

    if (!key) {
        Persistent.clearAll();
        return;
    }

    if (!!newValue && !!oldValue) {
        if (APP_LOCAL_CACHE_KEY === key) {
            Persistent.clearLocal();
        }
        if (APP_SESSION_CACHE_KEY === key) {
            Persistent.clearSession();
        }
    }
}

window.addEventListener('storage', storageChange);

initPersistentMemory();
