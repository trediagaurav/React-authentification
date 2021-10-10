import fetchIntercept from 'fetch-intercept';

export const unregister = fetchIntercept.register({
    request: function (url, config) {

        if(localStorage.getItem('login')){
            let store = JSON.parse(localStorage.getItem('login'))
            let token = store.token
            console.log("store token",token)
            config.headers.Authorization = `Bearer ${token}`
        }
        console.log("Config",config)
        console.log("Url",url)
        return [url, config];
    },

    requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        return Promise.reject(error);
    },

    response: function (response) {
        // Modify the reponse object
        console.log(response)
        if (response.message === 'Token expire') {
           console.log('Its expire')
        }
        return response;
    },

    responseError: function (error) {
        // Handle an fetch error
        return Promise.reject(error);
    }
});

// Call fetch to see your interceptors in action.
// fetch('http://google.com');

// Unregister your interceptor
// unregister();