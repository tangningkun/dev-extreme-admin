export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const EXCEPTION_COMPONENT = () => import('/@/views/sys/exception/Exception.vue');

/**
 * @description: default layout  默认布局
 */
export const LAYOUT = () => import('/@/layouts/default/index.vue');

/**
 * @description: parent-layout 父布局
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export const getParentLayout = (_name?: string) => {
    return () =>
        new Promise((resolve) => {
            resolve({
                name: PARENT_LAYOUT_NAME,
            });
        });
};
