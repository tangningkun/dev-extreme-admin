export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

/**
 * 请求选项
 */
export interface RequestOptions {
    /**
     * 拼接请求参数到url
     * Splicing request parameters to url
     */
    joinParamsToUrl?: boolean;
    /**
     * 格式化请求参数时间
     * Format request parameter time
     */
    formatDate?: boolean;
    /**
     * 是否处理请求结果
     * Whether to process the request result
     */
    isTransformResponse?: boolean;
    /**
     * 是否返回原生响应头
     * 例如：当你需要获取响应头时使用这个属性
     * Whether to return native response headers
     * For example: use this attribute when you need to get the response headers
     */

    isReturnNativeResponse?: boolean;
    /**
     * 是否加入url
     * Whether to join url
     */
    joinPrefix?: boolean;
    /**
     * 接口地址，不填则使用默认的apiUrl
     * Interface address, use the default apiUrl if you leave it blank
     */
    apiUrl?: string;
    /**
     *请求拼接路径
     */
    urlPrefix?: string;
    /**
     * 错误信息提示类型
     *Error message prompt type
     */
    errorMessageMode?: ErrorMessageMode;
    /**
     * 是否添加时间戳
     * Whether to add a timestamp
     */
    joinTime?: boolean;
    /**
     * 忽略取消令牌
     */
    ignoreCancelToken?: boolean;
    /**
     * 是否在header中发送token
     * Whether to send token in header
     */
    withToken?: boolean;
    /**
     * 请求重试机制
     */
    retryRequest?: RetryRequest;
}

export interface RetryRequest {
    isOpenRetry: boolean;
    count: number;
    waitTime: number;
}
export interface Result<T = any> {
    code: number;
    type: 'success' | 'error' | 'warning';
    message: string;
    result: T;
}

/**
 * 文件上传参数
 * multipart/form-data: upload file
 */
export interface UploadFileParams {
    // 其他参数
    data?: Recordable;
    /**
     * 文件名
     */
    name?: string;
    // 文件信息
    file: File | Blob;
    // 文件名称
    filename?: string;
    [key: string]: any;
}
