
var employeeFlyoutCtl = function ($rootScope, $scope, $uibModal, $log, $http, $filter, localStorageItemsSvc) { //TODO-- this stuff is definitely being called a second time... somewhere there's a ghost or zombie....

    "ngInject";
    debugger
    var vm = this;
    var employees, planners, extended, currentStorage;
    var employeeName = $scope.employee;
    var compareResult = localStorageItemsSvc.toCompare(employeeName);
    var url = "../data/PeopleInformation.json";
    $http.get(url).success(
        function(response) {
            employees = response.employees;
            planners = response.planner;
            extended = response.extended;
        }
    );
    function getCurrentSelectedResult() {
        if ($scope.selected == 'planners'){
            currentStorage = 'local_list_2';
            vm.groups = localStorageItemsSvc.toGet(currentStorage);
        } else {
            currentStorage = 'local_list';
            vm.groups = localStorageItemsSvc.toGet(currentStorage);
        }
    }
    getCurrentSelectedResult();  // to get current selected first.

    vm.showOrHideFlag = false;

    console.log('compareResult: ' + compareResult);
    console.log(employeeName);

    vm.addEmployeeToGroup = function (index) {
        // console.log($scope.selected);
debugger
        if(!compareResult){ //not found
            var storeAdded = localStorageItemsSvc.toGet('storeAddedPeople') || [];
            // console.log(storeAdded);
            storeAdded.push(employeeName);

            localStorageItemsSvc.toSet('storeAddedPeople',storeAdded);
        }
        var re = localStorageItemsSvc.toCompare(employeeName); //just to verify the compared result
        console.log(re);
        
        var localStore = localStorageItemsSvc.toGet(currentStorage);
        if(localStore[index].addedPeople == null){
            localStore[index].addedPeople = [];
        }
        
        // console.log('employeeName: ' + employeeName + ' , index: ' + index);
        var theResult = findPersonByName(employeeName);
        localStore[index].addedPeople.push(theResult);  // TODO-- use this when it's formal
        localStorageItemsSvc.toSet(currentStorage,localStore);

        // var theFilter = $filter('filter')(vm.employees,{"name":employeeName});
        var dateThings = [index,employeeName];
        $scope.$emit('addToGroup',dateThings);
        vm.removeFlyout(true);
    };
 
    function findPersonByName(theName) {
        var result;
        var thePlannerFilter = $filter('filter')(planners,{"name":theName});
        var theEmployeeFilter = $filter('filter')(employees,{"name":theName});
        if (thePlannerFilter[0] == undefined && theEmployeeFilter[0] == undefined){
            result = $filter('filter')(extended,{"name":theName});
        } else if (thePlannerFilter[0] == undefined) {
            result = theEmployeeFilter;
        } else {
            result = thePlannerFilter;
        }
        return result;
    }

    vm.showOrHide = function () {
        var styleObject = {};
        if(compareResult){
            vm.showOrHideFlag = true;
        }
        if(vm.showOrHideFlag){
            styleObject = {display:'none'};
        }
        return styleObject;
    };
    
    function doesFlyoutClearBottomOfScreen() {
        var employeeCard = $scope.employeecard;
        var employeeCardDimensions = employeeCard.getBoundingClientRect();
        var flyoutHeight = vm.getFlyoutHeight();
        var employeeCardDistFromBottom = window.innerHeight - employeeCardDimensions.top; //the distance from the top of the employeeCard to the bottom of the window
        return (employeeCardDistFromBottom > flyoutHeight);
    }

    vm.positionFlyout = function () { //TODO - This may allow the flyout to scroll with the employeecard.... //TODO-- refactor? this was a rush job
        var employeeCard = $scope.employeecard;
        
        var scrollY = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0); //courtesy of http://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome
        var employeeCardBounds = employeeCard.getBoundingClientRect();
        var styleObject;

        var flyoutClearsBottomOfTheScreen = doesFlyoutClearBottomOfScreen();

        if (flyoutClearsBottomOfTheScreen) {
            styleObject = {
                left: (employeeCardBounds.right + 5) + 'px',
                top: (employeeCardBounds.top + scrollY) +'px',
                position: 'absolute'
            };
        } else {
            styleObject = {
                left: (employeeCardBounds.right + 5) + 'px',
                // top: ((employeeCardBounds.top + scrollY) - (200-37)) +'px', //200px is the height of flyout , 37px maybe is a suitable number
                top: ((employeeCardBounds.top + scrollY) - (vm.getFlyoutHeight()-111)) +'px',
                position: 'absolute'
            };
        }

        return styleObject;
    };

    vm.openIndividualView = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl : 'profileDetails.html',
            controller: 'profileDetailsCtl',
            resolve: {
                employeeName: function () {
                    return $scope.employee;
                }
            }
        });
        modalInstance.result.then(function(){
        },function(){
            $log.info('Modal dismissed at: '+ new Date());
        });

        vm.removeFlyout();
    };


};

module.exports = employeeFlyoutCtl;