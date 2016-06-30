var localStorageItemsSvc = function(){

    var toSet = function(item){
        var temp = JSON.stringify(item);
        window.localStorage.setItem('local_list',temp);
    };

    var toGet = function(){
        var temp = window.localStorage.getItem("local_list");
        if(temp != null && temp != 'undefined'){
            return JSON.parse(temp);
        }
    };

    return {
        toSet:toSet,
        toGet:toGet
    }

};

module.exports = localStorageItemsSvc;
