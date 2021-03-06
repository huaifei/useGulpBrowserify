var filterModalCtl = require('./filterModalCtl.js');
var columnsModalCtl = require('./columnsModalCtl.js');

var finalizeCtl = function ($rootScope, $scope, $log, $uibModal, $http, $filter) {

    var vm = this;
    var currentFilters,tempEmployees,currentColumns;
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
        currentFilters = data;
        // console.log(currentFilters);
        filterCurrentData(currentFilters);

        // showFilterResultInPage();
        showFilterResultBackgroundInPage();
    });

    $rootScope.$on('columnsUpdated',function (event,data) {
        debugger
        currentColumns = data;
        // console.log(currentColumns);
        showColumnsResultBackgroundInPage(currentColumns);
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

        vm.gridOptions.api.setRowData(vm.employees);

    } //showFilterResultBackgroundInPage

    
    // columns part
    var disNone = {'opacity':0.2};
    vm.displayNone = [undefined,undefined,undefined];
    vm.ifDisplay = {
        Country : true,
        LineManager : true,
        CurrentLevel : true
    };
    function showColumnsResultBackgroundInPage(currentColumns) {
        debugger
        // console.log(currentColumns);
        vm.displayNone = [undefined,undefined,undefined];
        if(currentColumns.Country == undefined){
            vm.displayNone[0] = disNone;
        }
        if(currentColumns.LineManager == undefined){
            vm.displayNone[1] = disNone;
        }
        if(currentColumns.CurrentLevel == undefined){
            vm.displayNone[2] = disNone;
        }

        $scope.$digest();
    }



    //ag-grid
    $http.get("../data/PeopleInformation.json")
        .then(function(res){
            debugger;
            console.log(res);
            vm.employees = res.data.employees;
            // vm.gridOptions.api.setRowData(res.data.employees);
            vm.gridOptions.api.setRowData(vm.employees);
        });

    var columnDefs = [
        {headerName: '', width: 25, checkboxSelection: true, suppressSorting: true,
            suppressMenu: true, pinned: false},
        {headerName: "Name", field: "name", width: 150,cellStyle: {'margin': '0 auto'}},
        {headerName: "Country", field: "country", width: 150},
        {headerName: "LineManager", field: "LineManager", width: 150},
        {headerName: "CurrentLevel", field: "CurrentLevel", width: 150},
        {headerName: "Title", field: "title", width: 250},
        {headerName: "Salary", field: "salary", width: 150},
        {headerName: "Location", field: "location", width: 250}
    ];
    vm.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        angularCompileRows: true
    };



    function CountryClicked(age) {
        window.alert("Country clicked: " + age);
    }

    function countryCellRendererFunc(params) {
        params.$scope.CountryClicked = CountryClicked;
        return '<span ng-click="CountryClicked(data.country)" ng-model="data.country"></span>';
    }





};//finalizeCtl

module.exports = finalizeCtl;