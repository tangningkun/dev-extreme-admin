import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { RequestOptions, Result, UploadFileParams } from '/#/axios';
import type { CreateAxiosOptions } from './axiosTransform';
import axios from 'axios';
import qs from 'qs';
import { AxiosCanceler } from './axiosCancel';
import { isFunction } from '/@/utils/is';
import { cloneDeep } from 'lodash-es';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { RequestEnum } from '/@/enums/httpEnum';

export * from './axiosTransform';

/**
 * @description:  axios module
 */
export class VAxios {
    private axiosInstance: AxiosInstance;
    private readonly options: CreateAxiosOptions;

    constructor(options: CreateAxiosOptions) {
        this.options = options;
        this.axiosInstance = axios.create(options);
        this.setupInterceptors();
    }

    /**
     * @description:  创建 axios 实例
     */
    private createAxios(config: CreateAxiosOptions): void {
        this.axiosInstance = axios.create(config);
    }

    private getTransform() {
        const { transform } = this.options;
        return transform;
    }

    getAxios(): AxiosInstance {
        return this.axiosInstance;
    }

    /**
     * @description: 重新配置 axios
     */
    configAxios(config: CreateAxiosOptions) {
        if (!this.axiosInstance) {
            return;
        }
        this.createAxios(config);
    }

    /**
     * @description: 设置通请求Header
     */
    setHeader(headers: any): void {
        if (!this.axiosInstance) {
            return;
        }
        Object.assign(this.axiosInstance.defaults.headers, headers);
    }

    /**
     * @description: Interceptor configuration
     */
    private setupInterceptors() {
        const transform = this.getTransform();
        if (!transform) {
            return;
        }
        const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform;

        const axiosCanceler = new AxiosCanceler();

        // TODO:请求拦截器配置处理||Request interceptor configuration processing
        this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            //TODO：如果打开取消重复请求，则禁止取消重复请求
            //TODO：If cancel repeat request is turned on, then cancel repeat request is prohibited
            // @ts-ignore
            const { ignoreCancelToken } = config.requestOptions;
            const ignoreCancel = ignoreCancelToken !== undefined ? ignoreCancelToken : this.options.requestOptions?.ignoreCancelToken;

            !ignoreCancel && axiosCanceler.addPending(config);
            if (requestInterceptors && isFunction(requestInterceptors)) {
                config = requestInterceptors(config, this.options);
            }
            return config;
        }, undefined);

        //TODO: 请求拦截器错误捕获||Request interceptor error capture
        requestInterceptorsCatch && isFunction(requestInterceptorsCatch) && this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

        // TODO:响应结果拦截器处理||Response result interceptor processing
        this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
            res && axiosCanceler.removePending(res.config);
            if (responseInterceptors && isFunction(responseInterceptors)) {
                res = responseInterceptors(res);
            }
            return res;
        }, undefined);

        // TODO:响应结果拦截器错误捕获
        responseInterceptorsCatch &&
            isFunction(responseInterceptorsCatch) &&
            this.axiosInstance.interceptors.response.use(undefined, (error) => {
                // @ts-ignore
                responseInterceptorsCatch(this.axiosInstance, error);
            });
    }

    /**
     * @description:  上传文件||File Upload
     */
    uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
        const formData = new window.FormData();
        const customFilename = params.name || 'file';

        if (params.filename) {
            formData.append(customFilename, params.file, params.filename);
        } else {
            formData.append(customFilename, params.file);
        }

        if (params.data) {
            Object.keys(params.data).forEach((key) => {
                const value = params.data![key];
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(`${key}[]`, item);
                    });
                    return;
                }

                formData.append(key, params.data![key]);
            });
        }

        return this.axiosInstance.request<T>({
            ...config,
            method: 'POST',
            data: formData,
            headers: {
                'Content-type': ContentTypeEnum.FORM_DATA,
                // @ts-ignore
                ignoreCancelToken: true,
            },
        });
    }
    /**
     * 支持表单数据
     * @param config
     * @returns
     */
    supportFormData(config: AxiosRequestConfig) {
        const headers = config.headers || this.options.headers;
        const contentType = headers?.['Content-Type'] || headers?.['content-type'];

        if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(config, 'data') || config.method?.toUpperCase() === RequestEnum.GET) {
            return config;
        }

        return {
            ...config,
            data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
        };
    }
    /**
     *Get请求
     * @param config
     * @param options
     * @returns
     */
    get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'GET' }, options);
    }
    /**
     * POST
     * @param config
     * @param options
     * @returns
     */
    post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'POST' }, options);
    }

    /**
     * PUT
     * @param config
     * @param options
     * @returns
     */
    put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'PUT' }, options);
    }

    /**
     * DELETE
     * @param config
     * @param options
     * @returns
     */
    delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'DELETE' }, options);
    }

    request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        let conf: CreateAxiosOptions = cloneDeep(config);
        const transform = this.getTransform();

        const { requestOptions } = this.options;

        const opt: RequestOptions = Object.assign({}, requestOptions, options);

        const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
        if (beforeRequestHook && isFunction(beforeRequestHook)) {
            conf = beforeRequestHook(conf, opt);
        }
        conf.requestOptions = opt;

        conf = this.supportFormData(conf);

        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request<any, AxiosResponse<Result>>(conf)
                .then((res: AxiosResponse<Result>) => {
                    if (transformRequestHook && isFunction(transformRequestHook)) {
                        try {
                            const ret = transformRequestHook(res, opt);
                            resolve(ret);
                        } catch (err) {
                            reject(err || new Error('request error!'));
                        }
                        return;
                    }
                    resolve(res as unknown as Promise<T>);
                })
                .catch((e: Error | AxiosError) => {
                    if (requestCatchHook && isFunction(requestCatchHook)) {
                        reject(requestCatchHook(e, opt));
                        return;
                    }
                    if (axios.isAxiosError(e)) {
                        // rewrite error message from axios in here
                    }
                    reject(e);
                });
        });
    }
}
