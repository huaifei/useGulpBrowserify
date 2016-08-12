var filterModalCtl = require('./filterModalCtl.js');

var finalizeCtl = function ($rootScope, $scope, $log, $uibModal) {

    var vm = this;
    vm.jumpLinksShowing = true;

    vm.hideJumpLinks = function () {
        vm.jumpLinksShowing = false;
    };
    vm.showJumpLinks = function () {
        vm.jumpLinksShowing = true;
    };

    vm.launchFilterModal = function () {
        debugger;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'filterModal.html',
            controller: filterModalCtl,
            controllerAs: 'vm',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (item) {

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });


    };

    vm.launchColumnsModal = function () {

    };
    
};

module.exports = finalizeCtl;