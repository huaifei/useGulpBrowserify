var filterModalCtl = require('./filterModalCtl.js');
var columnsModalCtl = require('./columnsModalCtl.js');

var finalizeCtl = function ($rootScope, $scope, $log, $uibModal, $http, $filter) {

    var vm = this;
    var currentFilters,tempEmployees;
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
            tempEmployees = vm.employees;
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
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'columnsModal.html',
            controller: columnsModalCtl,
            controllerAs: 'vm',
            resolve: {
                item: function () {
                    // return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (item) {

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


    $rootScope.$on('filtersUpdated',function (event,data) {
        debugger
        currentFilters = data;
        console.log(currentFilters);
        filterCurrentData(currentFilters);

        // showFilterResultInPage();
        showFilterResultBackgroundInPage();
    });

    // var theFilter = $filter('filter')(vm.employees,{"name":currentName});

    function filterCurrentData(currentFilters) {
        var filterName;
        var filterValue;
        var displayText;
        var temp;
        vm.displayFilters = [];
        debugger
        for(filterName in currentFilters){

            for (filterValue in currentFilters[filterName]) {
                // if (currentFilters[filterName][filterValue] === 'number' || currentFilters[filterName][filterValue] === 'string' || currentFilters[filterName][filterValue] === 'boolean') {
                    if (filterName === 'LineManager') {
                        temp = $filter('filter')(vm.filtersData.LineManager, {LineManagerPeopleKey: currentFilters[filterName][filterValue]})[0];
                        displayText = temp.FirstName + " "  + temp.LastName;
                        //refresh vm.displayFilters when the second time
                        vm.displayFilters.push({name:"Talent Lead", displayText: displayText, lastName:temp.LastName, filterValue: filterValue, filterName: filterName});
                        // we use "Talent Lead" to filter
                    } else if(filterName === 'Country'){
                        temp = $filter('filter')(vm.filtersData.Country, {CountryName: currentFilters[filterName][filterValue]})[0];
                        displayText = temp.CountryName;
                        //refresh vm.displayFilters when the second time
                        vm.displayFilters.push({name:"Talent Lead", CountryName: displayText, filterValue: filterValue, filterName: filterName});
                        // we use "Talent Lead" to filter
                    }
                // }
            }

        }//for
    }

    function showFilterResultInPage() {
        var dis,theFilter,theFilterFinal,tempFilter=[];
        var display = vm.displayFilters;
        for(dis in display){
            debugger
            theFilter = $filter('filter')(tempEmployees,{"LineManager":display[dis].lastName});
            theFilterFinal = tempFilter.concat(theFilter);
            tempFilter = theFilterFinal;
        }

        vm.employees = theFilterFinal;
        if(!theFilter){
            vm.employees = tempEmployees;
        }

    }


    function showFilterResultBackgroundInPage() {
        var dis,theFilter,theFilterFinal,theTempFilterFinal,tempFilter=[];
        var display = vm.displayFilters;
        var filterFlag = [false,false];
        debugger
        for(dis in display){
            debugger
            if(display[dis].lastName != undefined){
                theFilter = $filter('filter')(tempEmployees,{"LineManager":display[dis].lastName});
                theFilterFinal = tempFilter.concat(theFilter);
                tempFilter = theFilterFinal;
                filterFlag[0] = true;
            }
            if (display[dis].CountryName != undefined) {
                tempFilter=[];
                if(filterFlag[0] == true){
                    theTempFilterFinal = theFilterFinal;
                } else {
                    theTempFilterFinal = tempEmployees;
                }
                theFilter = $filter('filter')(theTempFilterFinal,{"country":display[dis].CountryName});
                theFilterFinal = tempFilter.concat(theFilter);
                tempFilter = theFilterFinal;
                filterFlag[1] = true;
            }
        }

        vm.employees = theFilterFinal; // maybe useless,just in case vm.employees is duplicate.
        if(!theFilter){ // used during coding
            vm.employees = tempEmployees;
        } 
        
        
        
        
    }



};//finalizeCtl

module.exports = finalizeCtl;