import axios from 'axios'

let token = document.head.querySelector('meta[name="csrf-token"]');
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;

axios.interceptors.response.use(
    response => response,
    (error) => {
        if(error.response.status === 401 ) {
            console.log('401');
        }
        return Promise.reject(error);
    }
);
export default axios;