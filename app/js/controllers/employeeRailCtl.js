var showLocalStorageItemsSvc = require('./../services/showLocalStorageItemsSvc.js');

var employeeRailCtl = function($rootScope,$scope,$interval,$http,$compile,$timeout,$filter,localStorageItemsSvc){

    console.log("$scope.selected : " + $scope.selected); //it can get the current selected in rootCtl
    var vm = this;
    var firstInit = true;
    var currentStorage;
    var defaultColors = ['turquoise','blue','violet','orange','purple','red','green'];
    vm.currentType = true;
    vm.showFront = [];
    vm.showFrontExtend = [];
    vm.defaultGroups = [];
    var url = "../data/PeopleInformation.json";
    var defaultGroupUrl = "../data/defaultGroup.json"; //it's not been used

    console.log(window.innerHeight);

    $http.get(url).success(
        function(response) {
            vm.employees = response.employees;
            vm.planner = response.planner;
            vm.extended = response.extended;
            for(var j = 0; j < vm.employees.length; j++){
                vm.showFront[j] = true;
            }
            for(var ext = 0; ext < vm.extended.length; ext++){
                vm.showFrontExtend[ext] = true;
            }
        }
    );
    $http.get(defaultGroupUrl).success(
        function(response) {
            vm.defaultGroups = response.defaultGroups;
            // console.log(vm.defaultGroups);
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
    
    function getCurrentSelectedResult() {
        if ($scope.selected == 'planners'){
            currentStorage = 'local_list_2';
            vm.show_name = localStorageItemsSvc.toGet(currentStorage);
        } else {
            currentStorage = 'local_list';
            vm.show_name = localStorageItemsSvc.toGet(currentStorage);
        }
    }
    getCurrentSelectedResult();  // to get current selected first.
    // vm.show_name = localStorageItemsSvc.toGet(cu);
    $scope.$on('selectedHasChanged', function (data) {
        getCurrentSelectedResult();
        getNumberOfEachGroup(vm.show_name);
        vm.currentType = false;
    });

    vm.numberOfEachGroup = [];
    function getNumberOfEachGroup(arr) {
        if(arr != null && arr != undefined){
            for (var num = 0;num < arr.length;num++){
                vm.numberOfEachGroup[num] =  arr[num].addedPeople.length;
            }
        }
    }
    getNumberOfEachGroup(vm.show_name);
    // console.log('vm.show_name : '+vm.show_name);

    vm.addGroup = function(){
        // debugger
        var name_list = localStorageItemsSvc.toGet(currentStorage) || [];
        var randomNumber = Math.floor(Math.random()*7);
        if(vm.add_GroupName != null && vm.add_GroupName != undefined){
            var single = {
                types: vm.add_GroupName,
                addedPeople : [],
                backgroundColor: {'background-color':defaultColors[randomNumber]}
            };
            name_list.push(single);
            vm.add_GroupName = null;
            localStorageItemsSvc.toSet(currentStorage,name_list);
            
            var tempShowName = localStorageItemsSvc.toGet(currentStorage);
            vm.numberOfEachGroup[tempShowName.length-1] = 0;
            vm.show_name = tempShowName;
            tempShowName = null;
        }
        initShowNameIndex();
    };
    
    //TODO: remove-group function calls several bugs (done)
    vm.removeGroup = function(index){
        var idx;
        if(vm.show_name[index].addedPeople[0] == undefined){
            removeGroupKeySteps(vm.show_name,index);
            vm.show_name = localStorageItemsSvc.toGet(currentStorage);
        } else { //should release all the added people

            var currentName = vm.show_name[index].addedPeople;
            // console.log(currentName);
            var stored = JSON.parse(window.localStorage.getItem("storeAddedPeople")); //those have been added to group
            var currentIndexInStored;
            for(var c = 0;c < currentName.length;c++){
                if(stored != null && stored != 'undefined' && stored != []){ // maybe 'if' judgement sentence it's unnecessary
                    for (var i = 0;i < stored.length;i++){
                        if (currentName[c][0].name == stored[i]){
                            currentIndexInStored = i;
                            stored.splice(currentIndexInStored,1);
                            if($scope.selected == 'planners'){
                                idx = filterIndexFromName(vm.planner,currentName[c][0].name);
                                vm.planner[idx].backgroundStyle = {"background-color":"black"};
                            } else {
                                idx = filterIndexFromName(vm.employees,currentName[c][0].name);
                                if(idx == null){
                                    idx = filterIndexFromName(vm.extended,currentName[c][0].name);
                                    vm.extended[idx].backgroundStyle = {"background-color":"black"};
                                } else {
                                    vm.employees[idx].backgroundStyle = {"background-color":"black"};
                                }
                            }
                            idx = null;
                            break;
                        }
                    }
                }
            }
            localStorageItemsSvc.toSet("storeAddedPeople",stored); //handle flag in flyout
            removeGroupKeySteps(vm.show_name,index);
            vm.show_name = localStorageItemsSvc.toGet(currentStorage);

            currentIndexInStored = null;
            stored = null;
            currentName = null;
        }
        vm.numberOfEachGroup.splice(index,1);
    };
    function removeGroupKeySteps(arr,idx) { //remove the current group,and restore the local_list (currentStorage)
        arr.splice(idx,1);
        var arrayTemps = [];
        for(var p = 0;p < arr.length;p++){
            arrayTemps.push(arr[p]);
        }
        localStorageItemsSvc.toSet(currentStorage,arrayTemps);
        arrayTemps = null;
    }

    vm.showPaneContent = function(){
        vm.if_left_pane_content = (vm.if_left_pane_content == false);
    };

    // vm.showFront = [];
    vm.radiosEmp = [true,false];
    vm.selectOptions = [true,false];

    vm.flip = function(index){
        vm.showFront[index] = vm.showFront[index] ? false : true;
    };
    vm.flipExtended = function(index){
        vm.showFrontExtend[index] = vm.showFrontExtend[index] ? false : true;
    };

    vm.flagOfExtendedTeam = false;
    vm.upperPartOfLeftPane = true;
    vm.turnExtendedTeam = function () {
        vm.flagOfExtendedTeam = vm.flagOfExtendedTeam ? false : true;
        if(vm.upperPartOfLeftPane == true){
            var counts = 0;
            vm.setInterval = $interval(function () {
                window.scrollBy(0,5);
                counts++;
                if(counts > 100){
                    $interval.cancel(vm.setInterval);
                }
            },5);
            counts = null;
        } else {}
    };
    vm.controlTheEmployee = function () { //left pane , upper part
        vm.upperPartOfLeftPane = vm.upperPartOfLeftPane ? false : true;
    };
    
    vm.flyoutFunction =function (index,$event) {
        var employeeFlyoutElementString;
        vm.selectIcon = $scope.selected; // to sign the current role,planner or employee

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
        
        employeeFlyoutElementString = '<employee-flyout employee="vm.employeeName" employeecard="vm.employeeCard" selected="vm.selectIcon"></employee-flyout>';
        
        angular.element(document.querySelector('body')).append( $compile(employeeFlyoutElementString)($scope) );
        
    };
    
    vm.ExtendedFlyOutFunction =function (index,$event) {
        var employeeFlyoutElementString;
        vm.selectIcon = $scope.selected; // to sign the current role,planner or employee

        function getContainingEmployeeCard(nodeToCheck) {
            var el = nodeToCheck;
            var extendedTeam;

            while (el.parentNode) {
                if ( angular.element(el).hasClass('extendedTeam') ) {
                    extendedTeam = el;
                    break;
                }
                el = el.parentNode;
            }

            return extendedTeam;
        }

        if (jQuery && $event instanceof jQuery.Event) {
            $event = $event.originalEvent;
        }
        
        vm.extendedTeam = getContainingEmployeeCard($event.target);
        vm.extendedTeamMemberName = vm.extendedTeam.querySelector('.employeeCard_name_extended').innerHTML;
        
        employeeFlyoutElementString = '<employee-flyout employee="vm.extendedTeamMemberName" employeecard="vm.extendedTeam" selected="vm.selectIcon"></employee-flyout>';
        
        angular.element(document.querySelector('body')).append( $compile(employeeFlyoutElementString)($scope) );
        
    };

    vm.removeFromGroup =function (parent,index) {

        //console.log(vm.show_name[parent].addedPeople[index]);
        //console.log(JSON.parse(window.localStorage.getItem("storeAddedPeople")));
debugger
        var currentName = vm.show_name[parent].addedPeople[index];
        var stored = JSON.parse(window.localStorage.getItem("storeAddedPeople")); //those have been added to group
        var currentIndexInStored, thisIndex;

        if(stored != null && stored != 'undefined' && stored != []){
            for (var i = 0;i < stored.length;i++){
                if (currentName[0].name == stored[i]){
                    currentIndexInStored = i;
                    stored.splice(currentIndexInStored,1);
                    break;
                }
            }
        }
        localStorageItemsSvc.toSet("storeAddedPeople",stored); //handle flag in flyout

        console.log('log - currentStorage is : ' + currentStorage);
        var GroupContent = localStorageItemsSvc.toGet(currentStorage);
        if(GroupContent != null && GroupContent != 'undefined'){
            for(var j = 0;j < GroupContent.length;j++){
                for (var k = 0;k < GroupContent[j].addedPeople.length; k++){
                    if (currentName[0].name == GroupContent[j].addedPeople[k][0].name){
                        GroupContent[j].addedPeople.splice(k,1);
                        localStorageItemsSvc.toSet(currentStorage,GroupContent);
                    }
                }
            }
        }

        vm.show_name = GroupContent; // handle right part shows in the page
        vm.numberOfEachGroup[parent] -= 1;

        // var theFilter = $filter('filter')(vm.employees,{"name":currentName});

        if($scope.selected == 'planners'){
            thisIndex = filterIndexFromName(vm.planner,currentName[0].name);
            vm.planner[thisIndex].backgroundStyle = {"background-color":"black"};
        } else {
            thisIndex = filterIndexFromName(vm.employees,currentName[0].name);
            if(thisIndex == null){
                thisIndex = filterIndexFromName(vm.extended,currentName[0].name);
                vm.extended[thisIndex].backgroundStyle = {"background-color":"black"};
            }else {
                vm.employees[thisIndex].backgroundStyle = {"background-color":"black"};
            }
        }

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
            vm.addGroup();
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

    function initShowNameIndex() {
        vm.ifShowAddedName = [];
        vm.ifShowEmployeesAddedName = [];
        vm.ifShowPlannersAddedName = [];

        if(!vm.show_name){}
        else{
            if($scope.selected == 'planner'){
                var store1 = localStorageItemsSvc.toGet(currentStorage);
                for(var p1 = 0;p1 < store1.length;p1++){
                    vm.ifShowPlannersAddedName[p1] = false;
                }
                vm.ifShowAddedName =  vm.ifShowPlannersAddedName;
            } else {
                var store2 = localStorageItemsSvc.toGet(currentStorage);
                for(var p2 = 0;p2 < store2.length;p2++){
                    vm.ifShowEmployeesAddedName[p2] = false;
                }
                vm.ifShowAddedName =  vm.ifShowEmployeesAddedName;
            }
        }
    }
    initShowNameIndex();

    vm.showGroupPeople = function (index) {
        var groupContent = vm.show_name;

        if(groupContent !== localStorageItemsSvc.toGet(currentStorage)){
            vm.show_name = localStorageItemsSvc.toGet(currentStorage);
        }
        if($scope.selected == 'planner'){
            vm.ifShowPlannersAddedName[index] = (vm.ifShowPlannersAddedName[index] == false);
            vm.ifShowAddedName[index] = vm.ifShowPlannersAddedName[index];
        } else {
            vm.ifShowEmployeesAddedName[index] = (vm.ifShowEmployeesAddedName[index] == false);
            vm.ifShowAddedName[index] = vm.ifShowEmployeesAddedName[index];
        }

    };

    $scope.$on('addToGroup',function (event,data) {
        var theIndex;
        // console.log('index : '+ date);
        vm.numberOfEachGroup[data[0]] += 1;
        vm.show_name = localStorageItemsSvc.toGet(currentStorage);
debugger
        if($scope.selected == 'planners'){
            theIndex = filterIndexFromName(vm.planner,data[1]);
            vm.planner[theIndex].backgroundStyle = vm.show_name[data[0]].backgroundColor;
        } else {
            theIndex = filterIndexFromName(vm.employees,data[1]);
            if(theIndex == null){
                theIndex = filterIndexFromName(vm.extended,data[1]);
                vm.extended[theIndex].backgroundStyle = vm.show_name[data[0]].backgroundColor;
            } else {
                vm.employees[theIndex].backgroundStyle = vm.show_name[data[0]].backgroundColor;
            }
        }

    });

    function filterIndexFromName(arr,dataName) {
        var theIndex = null;
        for(var th = 0;th < arr.length;th++){
            if(arr[th].name == dataName){
                theIndex = th;
                break;
            }
        }
        return theIndex;
    }


};


module.exports = employeeRailCtl;
