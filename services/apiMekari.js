const axios = require('axios')

const apiMekari = axios.create({
    baseURL: process.env.MEKARI_API || "https://sandbox-api.mekari.com",
    timeout: 8000, //8s
})

//Request Interceptor before
apiMekari.interceptors.request.use((config) => {
    console.log(`[API REQUEST (Interceptor)] ${config.method.toUpperCase()} ${config.url}`)
    return config
})

//Request Interceptor After
apiMekari.interceptors.response.use(
    (response) => {
        console.log('[API RESPONSE (Interceptor)]', response.status)
        return response
    },
    (error) => {
        console.error(`[API ERROR (Interceptor)] ${error.config?.url}:`, error.message)
        return Promise.reject(error)
    }
)

module.exports = apiMekari