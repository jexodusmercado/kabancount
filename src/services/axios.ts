import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.clear()
        }
        return Promise.reject(error)
    },
)

export default axiosInstance
