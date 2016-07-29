(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var mainApp = angular.module('app',['ui.router','ui.bootstrap','Services','ngAnimate']);

module.exports = mainApp;

},{}],2:[function(require,module,exports){
var serviceModule = angular.module('Services',[]);

module.exports = serviceModule;
},{}],3:[function(require,module,exports){

var employeeFlyoutCtl = function ($rootScope, $scope, $uibModal, localStorageItemsSvc) { //TODO-- this stuff is definitely being called a second time... somewhere there's a ghost or zombie....

    "ngInject";
    var vm = this;
    var employeeName = $scope.employee;
    var compareResult = localStorageItemsSvc.toCompare(employeeName);
    vm.groups = localStorageItemsSvc.toGet('local_list');
    vm.showOrHideFlag = false;
    console.log('compareResult: ' + compareResult);

    console.log(employeeName);

    vm.addEmployeeToGroup = function (index) {

        if(!compareResult){
            var storeAdded = localStorageItemsSvc.toGet('storeAddedPeople') || [];
            console.log(storeAdded);
            storeAdded.push(employeeName);
            
            localStorageItemsSvc.toSet('storeAddedPeople',storeAdded);
        }
        var re = localStorageItemsSvc.toCompare(employeeName);
        console.log(re);
        
        var localStore = localStorageItemsSvc.toGet('local_list');
        if(localStore[index].addedPeople == null){
            localStore[index].addedPeople = [];
        }
        // console.log('employeeName: ' + employeeName + ' , index: ' + index);
        localStore[index].addedPeople.push(employeeName);  // TODO-- use this when it's formal
        // localStore[index].addedPeople = employeeName;   // convenient to debugger
        localStorageItemsSvc.toSet('local_list',localStore);

        vm.removeFlyout(true);
    };

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
},{}],4:[function(require,module,exports){
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
    
    //TODO: remove-group function calls several bugs (done)
    vm.removeGroup = function(index){
        if(vm.show_name[index].addedPeople[0] == undefined){
            removeGroupKeySteps(vm.show_name,index);
        } else { //should release all the added people
            var currentName = vm.show_name[index].addedPeople;
            console.log(currentName);
            var stored = JSON.parse(window.localStorage.getItem("storeAddedPeople")); //those have been added to group
            var currentIndexInStored;
            for(var c = 0;c < currentName.length;c++){
                if(stored != null && stored != 'undefined' && stored != []){ // maybe 'if' judgement sentence it's unnecessary
                    for (var i = 0;i < stored.length;i++){
                        if (currentName[c] == stored[i]){
                            currentIndexInStored = i;
                            stored.splice(currentIndexInStored,1);
                            break;
                        }
                    }
                }
            }
            localStorageItemsSvc.toSet("storeAddedPeople",stored); //handle flag in flyout
            removeGroupKeySteps(vm.show_name,index);
            currentIndexInStored = null;
            stored = null;
            currentName = null;
        }
    };
    function removeGroupKeySteps(arr,idx) {
        arr.splice(idx,1);
        var arrayTemps = [];
        for(var p = 0;p < arr.length;p++){
            arrayTemps.push(arr[p]);
        }
        localStorageItemsSvc.toSet('local_list',arrayTemps);
        arrayTemps = null;
    }

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

},{"./../services/showLocalStorageItemsSvc.js":13}],5:[function(require,module,exports){
var modalInstanceCtl = function($scope, $uibModalInstance ,items){
    console.log(items);
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function(){
        $uibModalInstance.close($scope.selectedOption);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};



module.exports = modalInstanceCtl;

},{}],6:[function(require,module,exports){

var profileDetailsCtl = function($scope, $uibModalInstance ,employeeName){

    console.log(employeeName);

    $scope.items = employeeName;
   
    $scope.ok = function(){
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

};


module.exports = profileDetailsCtl;
},{}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

function EmployeeFlyout () {

    "ngInject";

    var directive = {};

    directive.restrict = "E";

    directive.templateUrl = "./../html/employeeFlyoutTpl.html";

    directive.scope = {
        employee: '=',
        employeecard: '='
    };

    directive.controller = 'employeeFlyoutCtl as vm';

    directive.link = function (scope, elem, attr) { //TODO: should strip elem of it's jqueryness right off the bat
      
        var vm = scope.vm;
        
        function buildEventPath (eventObject) { //TODO:  might be more efficient to incorporate this into the loop that is being done in removeIfAnyOtherElementClicked, rather than doing two loops.
            var el = eventObject.target;
            var pathArr = [el];
            while (el.parentNode) {
                pathArr.push(el.parentNode);
                el = el.parentNode;
            }
            return pathArr;
        }

        vm.getFlyoutHeight = function () {
            var element = elem;
            if (element instanceof jQuery) {
                element = element[0];
            }
            element = element.children[0];
            return element.clientHeight;
        };

        vm.removeIfAnyOtherElementClicked = function ($event) {

            var path = $event.path || buildEventPath($event);
            var flyoutInPath = false;
            var menuClickDetected = false;
            var i;

            for (i = 0; i < path.length; i++) {

                if (!menuClickDetected && path[i].attributes && path[i].attributes['employee-trigger-id'] && parseInt(path[i].attributes['employee-trigger-id'].value, 10) === scope.employee.PeopleKey ) {
                    $event.stopPropagation();
                    menuClickDetected = true;
                }

                if (!flyoutInPath && path[i] == elem[0] ) {
                    flyoutInPath = true;
                }

                if (flyoutInPath && menuClickDetected) {
                    break;
                }

            }

            if (!flyoutInPath) {
                vm.removeFlyout();
            }
        };

        vm.removeFlyout = function (returnFlag) {
            document.removeEventListener('click', vm.removeIfAnyOtherElementClicked, true);
            if (vm.debinder) {
                vm.debinder();
            }
            // if (returnFlag === true || returnFlag === 'true') { // because the acat-remove-on handler will only be able to pass it as a string
            //     scope.trigger.focus();
            // }
            if (elem && elem.remove) { // this is a hack to fix bizarre behavior in IE11
                elem.remove();
            }
            scope.$destroy();
        };


        vm.handleKeyDown = function ($event) {
            var pressedKey;
            var evt = $event;
            var ESC = 27;
            var TAB = 9;
            var element = evt.target;

            if (evt instanceof jQuery.Event) {
                evt = evt.originalEvent;
            }


            //although deprecated, the below have far greater browser support than the recommended evt.key.
            //until .key is better supported, this implementation is far easier, and ought not be disappearing any time soon
            pressedKey = evt.keyCode || evt.charCode || evt.which;
            pressedKey = parseInt(pressedKey, 10);

            if (pressedKey === ESC) {
                vm.removeFlyout(true);  // remove the flyout and return focus to the button that triggered the tab
            }

            if (pressedKey === TAB && !(evt.shiftKey) && element.classList.contains('flyout-last')) { // if the user forward tabs on the last element in the flyout...
                vm.removeFlyout(true);  // remove the flyout and return focus to the button that triggered the flyout
            }

            if (pressedKey === TAB && evt.shiftKey && element.classList.contains('flyout-first')) { // if the user shift+tabs on the first element in the flyout...
                evt.preventDefault();
                vm.removeFlyout(true);  // remove the flyout and return focus to the button that triggered the flyout
            }

        };

        document.addEventListener('click', vm.removeIfAnyOtherElementClicked, true);
    };

    return directive;
}

module.exports = EmployeeFlyout;
},{}],9:[function(require,module,exports){
(function () {

    var appModule = require('./app/appModule.js');
    var serviceModule = require('./app/serviceModule.js');

    var rootCtl = require('./controllers/rootCtl.js');
    var modalInstanceCtl = require('./controllers/modalInstanceCtl.js');
    var profileDetailsCtl = require('./controllers/profileDetailsCtl.js');
    var employeeRailCtl = require('./controllers/employeeRailCtl.js');
    var employeeFlyoutCtl = require('./controllers/employeeFlyoutCtl.js');

    var employeeFlyoutDirective = require('./directives/employeeFlyout.js');
    // var flyoutTriggerDirective = require('./directives/flyoutTrigger.js');

    var route = require('./route/routeConfig.js');

    var localStorageItemsSvc = require('./services/localstorageItemsSvc.js');
    var showLocalStorageItemsSvc = require('./services/showLocalStorageItemsSvc.js');
    
    serviceModule
        .service('localStorageItemsSvc', localStorageItemsSvc)
        .service('showLocalStorageItemsSvc', showLocalStorageItemsSvc)
        .config(route);

    appModule
        .controller('rootCtl',rootCtl)
        .controller('employeeRailCtl',employeeRailCtl)
        .controller('modalInstanceCtl',modalInstanceCtl)
        .controller('profileDetailsCtl',profileDetailsCtl)
        .controller('employeeFlyoutCtl',employeeFlyoutCtl)

        // .directive('flyoutTriggerDirective',flyoutTriggerDirective)
        .directive('employeeFlyout',employeeFlyoutDirective);
    
    
    
})();

},{"./app/appModule.js":1,"./app/serviceModule.js":2,"./controllers/employeeFlyoutCtl.js":3,"./controllers/employeeRailCtl.js":4,"./controllers/modalInstanceCtl.js":5,"./controllers/profileDetailsCtl.js":6,"./controllers/rootCtl.js":7,"./directives/employeeFlyout.js":8,"./route/routeConfig.js":10,"./services/localstorageItemsSvc.js":12,"./services/showLocalStorageItemsSvc.js":13}],10:[function(require,module,exports){

var employeeRailCtl = require('./../controllers/employeeRailCtl.js');

// angular.module('angular.route',[])
	
function config($stateProvider,$urlRouterProvider){

	// $urlRouterProvider.when("", "/model");
	
	$urlRouterProvider.otherwise('/model');
	$stateProvider
		.state('model',{
			url:'/model',
			// view:{
				templateUrl:'employeeRail.html',
				controller:employeeRailCtl,
				controllerAs: 'vm'
			// }
		})
		.state('finalize',{
			url:'/finalize',
			templateUrl:'finalize.html'
		})
		.state('report',{
			url:'/report',
			templateUrl:'report.html'
		});
}

module.exports = config;

},{"./../controllers/employeeRailCtl.js":4}],11:[function(require,module,exports){
var localStorageItemsSvc = function(){

    var toSet = function(whichStorage,item){
        var temp = JSON.stringify(item);
        window.localStorage.setItem(whichStorage,temp);
    };

    var toGet = function(str){
        var temp = window.localStorage.getItem(str); // to store groups information , including types and people in the group
        if(temp != null && temp != 'undefined'){
            return JSON.parse(temp);
        }
    };

    var toCompare = function (str) {
        var temp = window.localStorage.getItem("storeAddedPeople"); // it's made to store people added to groups
        var flag = false;
       
        if(temp != null && temp != 'undefined'){
            var arr = JSON.parse(temp);
            for (var i = 0;i < arr.length;i++){
                if(str == arr[i]){
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    };
    
    var toStorePerson = function (item) {
        var temp = JSON.stringify(item);
        window.localStorage.setItem('storeAddedPeople',temp);

        var va = window.localStorage.getItem("storeAddedPeople");  
        var vaa = JSON.parse(va);
        console.log(vaa);
    };
    
    var restorePersonAfterRemoved = function () {
        var stored = window.localStorage.getItem("storeAddedPeople");
        
    };

    return {
        toSet: toSet,
        toGet: toGet,
        toCompare: toCompare,
        toStorePerson: toStorePerson,
        restorePersonAfterRemoved: restorePersonAfterRemoved
    }

};



module.exports = localStorageItemsSvc;

},{}],12:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],13:[function(require,module,exports){

var localStorageItemsSvc = require('./localStorageItemsSvc.js');

var showLocalStorageItems = function () {
    var showArray = [];
    if ( window.localStorage.local_list != null && window.localStorage.local_list !== 'undefined' ) {

        for(var k = 0;k < localStorageItemsSvc.toGet().length;k++){

            var single = {
                types: null,
                contents : []
            };

            single.types = localStorageItemsSvc.toGet()[k];
            showArray.push(single);

        }
    }

    return {
        showArray : showArray
    };

};


module.exports = showLocalStorageItems;

},{"./localStorageItemsSvc.js":11}]},{},[9]);
