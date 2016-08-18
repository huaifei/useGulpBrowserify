var filterModalCtl = require('./filterModalCtl.js');

var finalizeCtl = function ($rootScope, $scope, $log, $uibModal, $http, $filter) {

    var vm = this;
    var currentFilters;
    vm.displayFilters  = [];
    vm.jumpLinksShowing = true;

    vm.hideJumpLinks = function () {
        vm.jumpLinksShowing = false;
    };
    vm.showJumpLinks = function () {
        vm.jumpLinksShowing = true;
    };

    var url = "../data/PeopleInformation.json";
    var filterUrl = "../data/finalizeFilter.json";

    $http.get(url).success(
        function(response) {
            vm.employees = response.employees;
            vm.planners = response.planner;
            vm.extended = response.extended;
        }
    ).error(function (data) {
        alert(data);
    });
    $http.get(filterUrl).success(
        function(response) {
            vm.filtersData = response;
        }
    ).error(function (data) {
        alert(data);
    });

    vm.launchFilterModal = function () {
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


    $rootScope.$on('filtersUpdated',function (event,data) {
        debugger
        currentFilters = data;
        console.log(currentFilters);
        filterCurrentData(currentFilters);

        showFilterResultInPage();

    });

    // var theFilter = $filter('filter')(vm.employees,{"name":currentName});

    function filterCurrentData(currentFilters) {
        var filterName;
        var filterValue;
        var displayText;
        var temp;
        
        debugger
        for(filterName in currentFilters){

            for (filterValue in currentFilters[filterName]) {
                // if (currentFilters[filterName][filterValue] === 'number' || currentFilters[filterName][filterValue] === 'string' || currentFilters[filterName][filterValue] === 'boolean') {
                    if (filterName === 'LineManager') {
                        temp = $filter('filter')(vm.filtersData.LineManager, {LineManagerPeopleKey: currentFilters[filterName][filterValue]})[0];
                        displayText = temp.FirstName + " "  + temp.LastName;
                        vm.displayFilters.push({name:"Talent Lead", displayText: displayText, lastName:temp.LastName, filterValue: filterValue, filterName: filterName});
                        // we use "Talent Lead" to filter in the future.
                    } else {

                    }
                // }
            }

        }//for
    }

    function showFilterResultInPage() {
        var dis,theFilter,temp,theFilterFinal,tempFilter=[];
        var display = vm.displayFilters;
        for(dis in display){
            debugger
            theFilter = $filter('filter')(vm.employees,{"LineManager":display[dis].lastName});
            theFilterFinal = tempFilter.concat(theFilter);
        }
        
        temp = vm.employees;
        vm.employees = theFilterFinal;
        if(!theFilter){
            vm.employees = temp;
        }

    }



};//finalizeCtl

module.exports = finalizeCtl;