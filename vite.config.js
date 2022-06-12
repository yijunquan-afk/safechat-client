import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { loadEnv } from 'vite'
const path = require('path')

export default ({ command, mode }) => {
    const env = loadEnv(mode, process.cwd());//获取（在.env 文件中配置的）环境变量
    return defineConfig({
        plugins: [vue()],
        base: env.VITE_BASE_URL, //项目的基础路径由环境变量 VITE_BASE_URL 指定
        resolve: {
            alias: { '@': path.resolve(__dirname, './src') } //使用“@”表示项目的 src 目录
        },

        //vite 开发服务器配置
        server: {
            // host: '106.15.91.23',
            host: 'localhost', //主机名
            port: 3000, //端口
            open: true, //启动项目时是自动打开浏览器
            strictPort: false, //如果 port 指定端口被占用，是否仍然使用此端口（而不自动使用其它可用端口）
            https: false,//是否使用 https 访问
            //服务端代理设置
            proxy: {
                //如果访问地址以"/api"开头，则自动代理到服务端地址 http://localhost:8080,同时将"/api"替换为""
				'/api': {
					target: 'http://localhost:8000',
					changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, '')
				},
				'/socket.io': {
					target: 'http://localhost:8000',
					changeOrigin: true,
					rewrite: path => path.replace(/^\/socket\.io/, '')
				}
            }
        },

        build: {
            outDir: env.VITE_OUTPUT_DIR //项目打包输出目录由环境变量 VITE_BASE_URL 指定
        },
    })
}

// https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [vue()]
// })



// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import { loadEnv } from 'vite'
// const path = require('path')

// export default ({ command, mode }) => {
//     const env = loadEnv(mode, process.cwd());//获取（在.env 文件中配置的）环境变量
//     return defineConfig({
//         plugins: [vue()],
//         base: env.VITE_BASE_URL, //项目的基础路径由环境变量 VITE_BASE_URL 指定
//         resolve: {
//             alias: { '@': path.resolve(__dirname, './src') } //使用“@”表示项目的 src 目录
//         },

//         //vite 开发服务器配置
//         server: {
//             host: 'localhost', //主机名
//             port: 3000, //端口
//             open: true, //启动项目时是自动打开浏览器
//             strictPort: false, //如果 port 指定端口被占用，是否仍然使用此端口（而不自动使用其它可用端口）
//             https: false,//是否使用 https 访问
//             //服务端代理设置
//             proxy: {
//                 //如果访问地址以"/api"开头，则自动代理到服务端地址 http://localhost:8080,同时将"/api"替换为""
//                 '/api': {
//                     target: 'http://localhost:8080',
//                     changeOrigin: true,
//                     rewrite: path => path.replace(/^\/api/, '')
//                 }
//             }
//         },

//         build: {
//             outDir: env.VITE_OUTPUT_DIR //项目打包输出目录由环境变量 VITE_BASE_URL 指定
//         }
//     })
// }
