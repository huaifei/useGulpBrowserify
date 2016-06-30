
var toolNameCtl = function($scope, $rootScope, $location, $uibModal, $log){
	$rootScope.appRoute = $location;
	$scope.showBg = [true,false,false];
	$scope.if_left_pane_content = true;
	$scope.showThis = function(index){
		for(var i = 0;i<$scope.showBg.length;i++){
			$scope.showBg[i] = (i == index);
		}
	};

	$scope.selected = 'employees';
	$scope.items = ['employees','planners'];
	$scope.openSettings = function () {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl : 'ModalSetting.html',
			controller: 'modalInstanceCtl',
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function(selectedItem){
			$scope.selected =selectedItem;
		},function(){
			$log.info('Modal dismissed at : '+ new Date());
		});
	};
};



module.exports = toolNameCtl;
