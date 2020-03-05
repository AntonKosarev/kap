class Parse {
    constructor() {}
    //get query parameter value by given key
    getAllParams(format = 'json') {
        var obj = {};
        var array = [];
        var query = window.location.search.substring(1);
        var queryArray = query.split('&');
        for (var i = 0; i < queryArray.length; i++) {
            array[i] = queryArray[i].split('=');
            obj[array[i][0]] = array[i][1];
        }
        if (format === 'json') {
            return JSON.stringify(obj);
        }
        if (format === 'object') {
            return obj;
        }
        if (format === 'array') {
            return array;
        }
        return 'define formats: array, object or json.';
    }
    //get all query parameters as array or json
    getParam(key) {
        var obj = this.getAllParams('object');
        return obj[key];
    }
    //check if given parameter present in the query string, return boolean
    isParamExist(key) {
        var obj = this.getAllParams('object');
        if (typeof obj[key] === 'undefined') {
            return false;
        }else{
            return true;
        }
    }
}