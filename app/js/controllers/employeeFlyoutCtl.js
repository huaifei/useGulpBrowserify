
var employeeFlyoutCtl = function ($rootScope, $scope ,localStorageItemsSvc) { //TODO-- this stuff is definitely being called a second time... somewhere there's a ghost or zombie....

    "ngInject";
    var vm = this;
    vm.groups = localStorageItemsSvc.toGet();

    vm.addEmployeeToGroup = function (index) {

        var employeeName = $scope.employee;
        var localStore = localStorageItemsSvc.toGet();
        // console.log('employeeName: ' + employeeName + ' , index: ' + index);
        // localStore[index].content.push(employeeName);  // TODO-- use this when it's formal
        localStore[index].content = employeeName;
        localStorageItemsSvc.toSet(localStore);
        
        console.log(employeeName);

        vm.removeFlyout(true);
    };

    vm.showOrHide = function () {
        var styleObject = {};
        // if(false){
        //     styleObject = {display:'none'};
        // }
        return styleObject;
        
    };
    
    function doesFlyoutClearBottomOfScreen() {
        var employeeCard = $scope.employeecard;
        var employeeCardDimensions = employeeCard.getBoundingClientRect();
        // var flyoutHeight = vm.getFlyoutHeight();
        var employeeCardDistFromBottom = window.innerHeight - employeeCardDimensions.top; //the distance from the top of the employeeCard to the bottom of the window
        return (employeeCardDistFromBottom > 200);
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
                top: ((employeeCardBounds.top + scrollY) - (200-37)) +'px',
                position: 'absolute'
            };
        }

        return styleObject;
    };

    
    // vm.addEmployeeToGroup = function (employeePeopleKey, groupId) {
    //     if ($rootScope.app.roleAccessInfo.EditModeling) {
    //         $rootScope.app.broadcastEvent('addEmployeeToGroup', {employeePeopleKey: employeePeopleKey, groupId: groupId});
    //         vm.removeFlyout(true);
    //     }
    // };
    //
    // vm.openIndividualView = function (employee) {
    //     $rootScope.app.showEmployeedetailsModal(employee.FirstName, employee.LastName, employee.PeopleKey, employee.EnterpriseId);
    //     vm.removeFlyout();
    // };

    // modelGroupsLoadedDebinder = $rootScope.$on('modelGroupsLoaded', function(event, data) {
    // $rootScope.$on('modelGroupsLoadedProcessed', function(event, data) {
    //     vm.groups = data.modelGroups;
    // });
    //
    //
    // if (PlanningGroupSvc.getModelGroups() !== null) {
    //     vm.groups = PlanningGroupSvc.getModelGroups();
    // }
};

module.exports = employeeFlyoutCtl;