var filterModalCtl = function ($scope, $uibModalInstance) {
    $scope.submit = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.isOpen = false;
};


module.exports = filterModalCtl;