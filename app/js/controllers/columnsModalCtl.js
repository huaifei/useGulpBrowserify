var columnsModalCtl = function ($rootScope, $scope, $uibModalInstance, $http, $filter) {
    
    var vm = this;

    $scope.submit = function () {

        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    
    
    
};


module.exports = columnsModalCtl;