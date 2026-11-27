import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

// Custom dev middleware plugin to save menu image URLs directly to src/data/menuData.js during local dev
function menuSavePlugin() {
  return {
    name: 'paramount-menu-save',
    configureServer(server) {
      server.middlewares.use('/api/save-menu', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { images } = JSON.parse(body)
              if (!images || typeof images !== 'object') {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Invalid payload' }))
                return
              }

              const filePath = resolve(__dirname, 'src/data/menuData.js')
              let content = fs.readFileSync(filePath, 'utf8')
              let count = 0

              for (const [id, url] of Object.entries(images)) {
                // Matches the item's image field by ID
                const escapedId = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
                const regex = new RegExp(`(id:\\s*["']${escapedId}["'][\\s\\S]*?image:\\s*)["'].*?["']`)
                if (regex.test(content)) {
                  content = content.replace(regex, `$1${JSON.stringify(url || '')}`)
                  count++
                }
              }

              fs.writeFileSync(filePath, content, 'utf8')
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, count }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 405
          res.end('Method Not Allowed')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), menuSavePlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        menuDir: resolve(__dirname, 'menu/index.html'),
        admin: resolve(__dirname, 'admin.html'),
        adminDir: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})
