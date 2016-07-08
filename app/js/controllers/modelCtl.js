var showLocalStorageItemsSvc = require('./../services/showLocalStorageItemsSvc.js');


var modelCtl = function($scope,$interval,$http,$compile,localStorageItemsSvc){

    var vm = this;
    vm.showFront = [];
    var url="../data/PeopleInformation.json";
    $http.get(url).success(
        function(response) {
            vm.employees = response.employees;
            vm.planner = response.planner;

            for(var j = 0; j < vm.employees.length; j++){
                vm.showFront[j] = true;
            }
        }
    );

    vm.inputName = true;
    vm.clickShowName = function(){
        vm.inputName = (vm.inputName == false);
        event.target.onfocus = true;
    };
    vm.clickToHideName = function(){
        vm.inputName = true;
    };

    vm.sortOptions = [
        {key:'Name a-to-z',value:'name'},
        {key:'Name z-to-a',value:'-name'}
    ];
    vm.names = ['employees','planners'];
    $scope.the = { type: 'employees' };
    
    vm.show_name = localStorageItemsSvc.toGet('local_list');
    
    // var showLocalStorageItem = function () {
    //     if ( window.localStorage.local_list != null && window.localStorage.local_list !== 'undefined' ) {
    //         for(var k = 0;k < localStorageItemsSvc.toGet('local_list').length;k++){
    //             var single = {
    //                 types: null,
    //                 contents : []
    //             };
    //             single.types=localStorageItemsSvc.toGet('local_list')[k];
    //             vm.show_name.push(single);
    //         }
    //     }
    // };
    // showLocalStorageItem();

    // vm.moveToRightList = function(index,parentIndex){
    //     vm.show_name[index].contents.push(vm.employees[parentIndex].name);
    // };

    vm.addNames = function(){
        var name_list = localStorageItemsSvc.toGet('local_list') || [];
        if(vm.add_name != null && vm.add_name != undefined){
            var single = {
                types: vm.add_name,
                contents : []
            };
            name_list.push(single);
            vm.add_name = null;
            localStorageItemsSvc.toSet('local_list',name_list);
            vm.show_name = localStorageItemsSvc.toGet('local_list');
        }
    };

    vm.removeNames = function(index){
        vm.show_name.splice(index,1);
        var arrayTemp = [];
        for(var p = 0;p<vm.show_name.length;p++){
            arrayTemp.push(vm.show_name[p].types);
        }
        localStorageItemsSvc.toSet('local_list',arrayTemp);
        arrayTemp = null;
    };

    vm.showPaneContent = function(){
        vm.if_left_pane_content = (vm.if_left_pane_content == false);
    };

    vm.showFront = [];
    vm.radiosEmp = [true,false];
    vm.selectOptions = [true,false];

    vm.flip = function(index){
        vm.showFront[index] = vm.showFront[index] ? false : true;
    };
    
    vm.flyoutFunction =function (index,$event) {
        var employeeFlyoutElementString;

        function getContainingEmployeeCard(nodeToCheck) {
            var el = nodeToCheck;
            var employeeCard;

            while (el.parentNode) {
                if ( angular.element(el).hasClass('employeeCard') ) {
                    employeeCard = el;
                    break;
                }
                el = el.parentNode;
            }

            return employeeCard;
        }

        if (jQuery && $event instanceof jQuery.Event) {
            $event = $event.originalEvent;
        }
        
        
        vm.employeeCard = getContainingEmployeeCard($event.target);
        vm.employeeName = vm.employeeCard.querySelector('.employeeCard_name').innerHTML;
        
        employeeFlyoutElementString = '<employee-flyout employee="vm.employeeName" employeecard="vm.employeeCard"></employee-flyout>';
    
        angular.element(document.querySelector('body')).append( $compile(employeeFlyoutElementString)($scope) );
        
    };
    
    
};

module.exports = modelCtl;
