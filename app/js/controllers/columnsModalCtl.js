var columnsModalCtl = function ($rootScope, $scope, $uibModalInstance, $http, $filter) {
    
    var vm = this;
    var selectedColumns, columnsCache;
    debugger;

    $scope.submit = function () {

        setColumnsCache(selectedColumns);
        console.log(columnsCache);
        
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    function setSelections() {
        var i;
        var cachedColumns = getColumnsCache();
        for(i in cachedColumns){
            selectedColumns[i] = cachedColumns ? cachedColumns[i] : [];
        }
    }
    setSelections();
    
    function setColumnsCache(selectedColumns){
        columnsCache = selectedColumns;
    }
    
    function getColumnsCache() {
        return columnsCache;
    }
    
    $scope.items = ['Country','LineManager','CurrentLevel'];
    
    $scope.selected = [];
    selectedColumns = $scope.selected;
    
    
};



module.exports = columnsModalCtl;