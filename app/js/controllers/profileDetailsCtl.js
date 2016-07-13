
var profileDetailsCtl = function($scope, $uibModalInstance ,employeeName){

    console.log(employeeName);

    $scope.items = employeeName;
   
    $scope.ok = function(){
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

};


module.exports = profileDetailsCtl;