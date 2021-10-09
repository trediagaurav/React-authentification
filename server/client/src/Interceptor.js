import fetchIntercept from 'fetch-intercept';

export const unregister = fetchIntercept.register({
    request: function (url, config) {
        setTimeout(function(){
            console.log("config",config);
            if (!config.headers.authorization) {
                console.log("not has token")
            }else return 
        }, 5000);
        
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