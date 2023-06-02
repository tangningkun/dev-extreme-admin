/**
 * @ Author: Tank
 * @ Create Time: 2023-03-29 11:45:02
 * @ Modified by: Tank
 * @ Modified time: 2023-03-30 14:56:03
 * @ Description:vite-plugin配置
 */

import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VitePluginCertificate from 'vite-plugin-mkcert';
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
    console.log('isBuild==>', isBuild);
    const {} = viteEnv;

    const vitePlugins: (PluginOption | PluginOption[])[] = [
        // have to
        vue(),
        // have to
        vueJsx(),
        // support name
        //vueSetupExtend(),
        VitePluginCertificate({
            source: 'coding',
        }),
    ];

    return vitePlugins;
}
