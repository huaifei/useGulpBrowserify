var modalInstanceCtl = function($scope, $uibModalInstance ,items){
    console.log(items);
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function(){
        $uibModalInstance.close($scope.selectedOption);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};



module.exports = modalInstanceCtl;
