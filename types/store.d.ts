import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { RoleInfo } from '/@/api/sys/model/userModel';

/**
 * 锁屏信息
 */
export interface LockInfo {
    // Password required 要求输入密码
    pwd?: string | undefined;
    // Is it locked? 是否上锁?
    isLock?: boolean;
}

// Error-log information 错误日志信息
export interface ErrorLogInfo {
    // Type of error 错误类型
    type: ErrorTypeEnum;
    // Error file
    file: string;
    // Error name
    name?: string;
    // Error message
    message: string;
    // Error stack
    stack?: string;
    // Error detail
    detail: string;
    // Error url
    url: string;
    // Error time
    time?: string;
}

export interface UserInfo {
    userId: string | number;
    username: string;
    realName: string;
    avatar: string;
    desc?: string;
    homePath?: string;
    roles: RoleInfo[];
}

export interface BeforeMiniState {
    menuCollapsed?: boolean;
    menuSplit?: boolean;
    menuMode?: MenuModeEnum;
    menuType?: MenuTypeEnum;
}
