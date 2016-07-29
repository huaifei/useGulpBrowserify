var showLocalStorageItemsSvc = require('./../services/showLocalStorageItemsSvc.js');

var employeeRailCtl = function($rootScope,$scope,$interval,$http,$compile,$timeout,localStorageItemsSvc){

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
    console.log('vm.show_name : '+vm.show_name);
    
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
    
    vm.addNames = function(){
        var name_list = localStorageItemsSvc.toGet('local_list') || [];
        if(vm.add_GroupName != null && vm.add_GroupName != undefined){
            var single = {
                types: vm.add_GroupName,
                addedPeople : []
            };
            name_list.push(single);
            vm.add_GroupName = null;
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

    vm.removeFromGroup =function (parent,index) {

        //console.log(vm.show_name[parent].addedPeople[index]);
        //console.log(JSON.parse(window.localStorage.getItem("storeAddedPeople")));

        var currentName = vm.show_name[parent].addedPeople[index];
        var stored = JSON.parse(window.localStorage.getItem("storeAddedPeople")); //those have been added to group
        var currentIndexInStored;

        if(stored != null && stored != 'undefined' && stored != []){
            for (var i = 0;i < stored.length;i++){
                if (currentName == stored[i]){
                    currentIndexInStored = i;
                    stored.splice(currentIndexInStored,1);
                    break;
                }
            }
        }
        localStorageItemsSvc.toSet("storeAddedPeople",stored); //handle flag in flyout

        var GroupContent = localStorageItemsSvc.toGet('local_list');
        if(GroupContent != null && GroupContent != 'undefined'){
            for(var j = 0;j < GroupContent.length;j++){
                for (var k = 0;k < GroupContent[j].addedPeople.length; k++){
                    if (currentName == GroupContent[j].addedPeople[k]){
                        GroupContent[j].addedPeople.splice(k,1);
                        localStorageItemsSvc.toSet("local_list",GroupContent);
                    }
                }
            }
        }
        vm.show_name = GroupContent; // handle right part shows in the page
        
    };


    vm.createGroupClicked = function () {
        vm.showCreateGroupInput = true;
        $timeout(function () {
            document.querySelector('.create-planning-group-name-input').focus();
        }, 1);
    };
    
    vm.createGroupCanceled = function () {
        vm.showCreateGroupInput = false;
        // vm.add_GroupName = null;
    };
    
    
    vm.validateKeyInput = function($event) {
        var regex = /^[a-zA-Z0-9 ]*$/gm;

        var key = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);

        if (!regex.test(key)) {
            $event.preventDefault();
            return false;
        }
    };

    vm.handleKeyInput = function ($event) { 
        // TODO-- ideally, this uses the "acat click to edit" directive, but at the time of coding this portion it was not ready for wide use.
        var pressedKey;
        var evt = $event;

        if (evt instanceof jQuery.Event) {
            evt = evt.originalEvent;
        }

        //although deprecated, the below have far greater browser support than the recommended evt.key. 
        //until .key is better supported, this implementation is far easier, and ought not be disappearing any time soon
        pressedKey = evt.keyCode || evt.charCode || evt.which;
        pressedKey = parseInt(pressedKey, 10);

        if (pressedKey === 13) {
            vm.createGroup();
        }

        if (pressedKey === 27) {
            vm.createGroupCanceled();
        }

    };
    
    vm.validatePaste = function (evt) {
        var pastedText;
        var regex = /^[a-zA-Z0-9 ]*$/gm;

        if (evt instanceof jQuery.Event) {
            evt = evt.originalEvent;
        }

        // http://stackoverflow.com/questions/6035071/intercept-paste-event-in-javascript
        if (window.clipboardData && window.clipboardData.getData) { // IE
            pastedText = window.clipboardData.getData('Text');
        } else if (evt.clipboardData && evt.clipboardData.getData) {
            pastedText = evt.clipboardData.getData('text/plain');
        }

        if (!regex.test(pastedText)) {
            evt.preventDefault();
            return false;
        }
    };

    //console.log('Groups : ' + vm.show_name);

    function initShowNameIndex() {
        vm.ifShowAddedName = [];
        if(!vm.show_name){}
        else{
            for(var p = 0;p < vm.show_name.length;p++){
                vm.ifShowAddedName[p] = false;
            }
        }
    }
    initShowNameIndex();
    
    vm.showGroupPeople = function (index) {
        var groupContent = vm.show_name;
        if(groupContent !== localStorageItemsSvc.toGet('local_list')){
            vm.show_name = localStorageItemsSvc.toGet('local_list');
        }
        vm.ifShowAddedName[index] = (vm.ifShowAddedName[index] == false);
    };

    
};



module.exports = employeeRailCtl;
