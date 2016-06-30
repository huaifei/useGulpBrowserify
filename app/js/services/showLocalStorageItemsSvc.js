
var localStorageItemsSvc = require('./localStorageItemsSvc.js');

var showLocalStorageItems = function () {
    var showArray = [];
    if ( window.localStorage.local_list != null && window.localStorage.local_list !== 'undefined' ) {

        for(var k = 0;k < localStorageItemsSvc.toGet().length;k++){

            var single = {
                types: null,
                contents : []
            };

            single.types = localStorageItemsSvc.toGet()[k];
            showArray.push(single);

        }
    }

    return {
        showArray : showArray
    };

};


module.exports = showLocalStorageItems;
