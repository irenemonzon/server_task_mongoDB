import { CorsOptions } from 'cors'

function normalizeOrigin(o?: string) {
    if (!o) return o
    return o.replace(/\/$/, '')
}

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
    
        if (!origin) return callback(null, true)

        const envSingle = process.env.FRONTEND_URL
        const envList = process.env.FRONTEND_URLS 

        const whitelist = new Set<string>()
        if (envSingle) whitelist.add(normalizeOrigin(envSingle))
        if (envList) {
            envList.split(',').map(s => s.trim()).filter(Boolean).forEach(u => whitelist.add(normalizeOrigin(u)))
        }

        if (process.env.NODE_ENV !== 'production') {
            whitelist.add('http://localhost:5173')
            whitelist.add('http://127.0.0.1:5173')
            whitelist.add('http://localhost:3000')
            whitelist.add('http://127.0.0.1:3000')
        }

        const normalizedOrigin = normalizeOrigin(origin)

        if (whitelist.has(normalizedOrigin)) {
            return callback(null, true)
        }

      
        console.warn(`CORS blocked origin: ${origin}. Allowed: ${Array.from(whitelist).join(', ')}`)
        return callback(new Error('Error de cors'))
    }
}