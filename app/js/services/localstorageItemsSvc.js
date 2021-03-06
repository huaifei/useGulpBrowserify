var localStorageItemsSvc = function(){

    var toSet = function(whichStorage,item){
        var temp = JSON.stringify(item);
        window.localStorage.setItem(whichStorage,temp);
    };

    var toGet = function(str){
        var temp = window.localStorage.getItem(str); // to store groups information , including types and people in the group
        if(temp != null && temp != 'undefined'){
            return JSON.parse(temp);
        }
    };

    var toCompare = function (str) {
        var temp = window.localStorage.getItem("storeAddedPeople"); // it's made to store people added to groups
        var flag = false;
       
        if(temp != null && temp != 'undefined'){
            var arr = JSON.parse(temp);
            for (var i = 0;i < arr.length;i++){
                if(str == arr[i]){
                    flag = true;
                    break;
                }
            }
        }
        return flag;          // when flag is true,that means str exist in storeAddedPeople.
    };
    
    var toStorePerson = function (item) {
        var temp = JSON.stringify(item);
        window.localStorage.setItem('storeAddedPeople',temp);

        var va = window.localStorage.getItem("storeAddedPeople");
        var vaa = JSON.parse(va);
        console.log(vaa);
    };
    
    var restorePersonAfterRemoved = function () {
        var stored = window.localStorage.getItem("storeAddedPeople");
        console.log(stored);
    };

    return {
        toSet: toSet,
        toGet: toGet,
        toCompare: toCompare,
        toStorePerson: toStorePerson,
        restorePersonAfterRemoved: restorePersonAfterRemoved
    }

};



module.exports = localStorageItemsSvc;
