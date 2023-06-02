import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import { ContentEnum, PermissionModeEnum, ThemeEnum, RouterTransitionEnum, SettingButtonPositionEnum, SessionTimeoutProcessingEnum } from '/@/enums/appEnum';

import { CacheTypeEnum } from '/@/enums/cacheEnum';

export type LocaleType = 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko';

export interface MenuSetting {
    bgColor: string;
    fixed: boolean;
    collapsed: boolean;
    siderHidden: boolean;
    canDrag: boolean;
    show: boolean;
    hidden: boolean;
    split: boolean;
    menuWidth: number;
    mode: MenuModeEnum;
    type: MenuTypeEnum;
    theme: ThemeEnum;
    topMenuAlign: 'start' | 'center' | 'end';
    trigger: TriggerEnum;
    accordion: boolean;
    closeMixSidebarOnChange: boolean;
    collapsedShowTitle: boolean;
    mixSideTrigger: MixSidebarTriggerEnum;
    mixSideFixed: boolean;
}

export interface MultiTabsSetting {
    cache: boolean;
    show: boolean;
    showQuick: boolean;
    canDrag: boolean;
    showRedo: boolean;
    showFold: boolean;
}
/**
 * 头部设置
 */
export interface HeaderSetting {
    /**
     * 背景颜色
     */
    bgColor: string;
    /**
     * 是否固定
     */
    fixed: boolean;
    /**
     * 是否显示
     */
    show: boolean;
    /**
     * 主题
     */
    theme: ThemeEnum;
    /**
     * 是否全屏
     */
    showFullScreen: boolean;
    /**
     * 是否显示锁屏
     */
    useLockPage: boolean;
    /**
     * 显示文件按钮
     */
    showDoc: boolean;
    /**
     * 显示消息中心按钮
     */
    showNotice: boolean;
    /**
     * 显示搜索
     */
    showSearch: boolean;
}

export interface LocaleSetting {
    showPicker: boolean;
    // 当前的语言
    locale: LocaleType;
    // 默认的语言
    fallback: LocaleType;
    // 可用的地区
    availableLocales: LocaleType[];
}

/**
 * 渲染动画
 */
export interface TransitionSetting {
    //  是否打开页面切换动画
    enable: boolean;
    // 路由基本切换动画
    basicTransition: RouterTransitionEnum;
    // 是否打开页面切换加载
    openPageLoading: boolean;
    // 是否打开顶部进度条
    openNProgress: boolean;
}

export interface ProjectConfig {
    // 权限相关信息的存储位置
    permissionCacheType: CacheTypeEnum;
    // 是否显示该配置按钮
    showSettingButton: boolean;
    // 是否显示主题切换按钮
    showDarkModeToggle: boolean;
    // 配置按钮的显示位置
    settingButtonPosition: SettingButtonPositionEnum;
    // 权限模式
    permissionMode: PermissionModeEnum;
    // Session 超时处理
    sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
    // 网站灰色模式，开放可能的哀悼日期
    grayMode: boolean;
    // 是否开启弱色模式
    colorWeak: boolean;
    // Theme color主题色
    themeColor: string;

    // The main interface is displayed in full screen, the menu is not displayed, and the top
    //主界面全屏显示，不显示菜单，置顶
    fullContent: boolean;
    // 内容宽度
    contentMode: ContentEnum;
    // 是否显示logo
    showLogo: boolean;
    // 是否显示全局页脚
    showFooter: boolean;
    // menuType: MenuTypeEnum;
    headerSetting: HeaderSetting;
    // menuSetting 菜单设置
    menuSetting: MenuSetting;
    // Multi-tab settings 多标签设置
    multiTabsSetting: MultiTabsSetting;
    // Animation configuration 动画配置
    transitionSetting: TransitionSetting;
    // pageLayout whether to enable keep-alive
    // pageLayout 是否开启保活
    openKeepAlive: boolean;
    // Lock screen time 锁屏时间
    lockTime: number;
    // Show breadcrumbs 显示面包屑
    showBreadCrumb: boolean;
    // Show breadcrumb icon 显示面包屑图标
    showBreadCrumbIcon: boolean;
    // Use error-handler-plugin
    // 使用错误处理程序插件
    useErrorHandle: boolean;
    // Whether to open back to top
    // 是否开启 回到顶部
    useOpenBackTop: boolean;
    // Is it possible to embed iframe pages
    // 是否可以嵌入iframe页面
    canEmbedIFramePage: boolean;
    // Whether to delete unclosed messages and notify when switching the interface
    // 切换界面时是否删除未关闭的消息并通知
    closeMessageOnSwitch: boolean;
    // Whether to cancel the http request that has been sent but not responded when switching the interface.
    // 切换界面时是否取消已发送但未响应的http请求。
    removeAllHttpPending: boolean;
}

export interface GlobConfig {
    // Site title
    // 网站标题
    title: string;
    // Service interface url 服务接口地址
    apiUrl: string;
    // Upload url 上传网址
    uploadUrl?: string;
    // Service interface url prefix 服务接口 url 前缀
    urlPrefix?: string;
    // Project abbreviation 项目简称
    shortName: string;
}
export interface GlobEnvConfig {
    // Site title 网站标题
    VITE_GLOB_APP_TITLE: string;
    // Service interface url 服务接口地址
    VITE_GLOB_API_URL: string;
    // Service interface url prefix 服务接口 url 前缀
    VITE_GLOB_API_URL_PREFIX?: string;
    // Upload url 传网址
    VITE_GLOB_UPLOAD_URL?: string;
}
