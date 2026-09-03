import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  // GitHub Pages 部署路径：
  // - 未绑定自定义域名时保持 '/sls-icanhelp/'（即 github.io 子路径访问）
  // - 绑定自定义域名后，在仓库 Settings → Secrets → Actions 添加环境变量
  //   或直接修改 deploy.yml 中 build 步骤为: npm run build -- --base=/
  //   也可以把下面一行改为 base: '/'
  base: process.env.PAGES_BASE || '/sls-icanhelp/',
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
