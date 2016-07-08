(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var mainApp = angular.module('app',['ui.router','ui.bootstrap','Services','ngAnimate']);

module.exports = mainApp;

},{}],2:[function(require,module,exports){
var serviceModule = angular.module('Services',[]);

module.exports = serviceModule;
},{}],3:[function(require,module,exports){

var employeeFlyoutCtl = function ($rootScope, $scope ,localStorageItemsSvc) { //TODO-- this stuff is definitely being called a second time... somewhere there's a ghost or zombie....

    "ngInject";
    var vm = this;
    var employeeName = $scope.employee;
    var compareResult = localStorageItemsSvc.toCompare(employeeName);
    console.log('compareResult:'+compareResult);
    vm.groups = localStorageItemsSvc.toGet('local_list');
    vm.showOrHideFlag = false;

    // console.log(employeeName);

    vm.addEmployeeToGroup = function (index) {
debugger
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
},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

    // vm.moveToRightList = function(index,parentIndex){
    //     vm.show_name[index].contents.push(vm.employees[parentIndex].name);
    // };

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
    
    
};

module.exports = modelCtl;

},{"./../services/showLocalStorageItemsSvc.js":12}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){

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
},{}],8:[function(require,module,exports){
(function () {

    var appModule = require('./app/appModule.js');
    var serviceModule = require('./app/serviceModule.js');

    var rootCtl = require('./controllers/rootCtl.js');
    var modalInstanceCtl = require('./controllers/modalInstanceCtl.js');
    var modelCtl = require('./controllers/modelCtl.js');
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
        .controller('modelCtl',modelCtl)
        .controller('modalInstanceCtl',modalInstanceCtl)
        .controller('employeeFlyoutCtl',employeeFlyoutCtl)

        // .directive('flyoutTriggerDirective',flyoutTriggerDirective)
        .directive('employeeFlyout',employeeFlyoutDirective);
    
    
    
})();

},{"./app/appModule.js":1,"./app/serviceModule.js":2,"./controllers/employeeFlyoutCtl.js":3,"./controllers/modalInstanceCtl.js":4,"./controllers/modelCtl.js":5,"./controllers/rootCtl.js":6,"./directives/employeeFlyout.js":7,"./route/routeConfig.js":9,"./services/localstorageItemsSvc.js":11,"./services/showLocalStorageItemsSvc.js":12}],9:[function(require,module,exports){

var modelCtl = require('./../controllers/modelCtl.js');

// angular.module('angular.route',[])
	
function config($stateProvider,$urlRouterProvider){

	// $urlRouterProvider.when("", "/model");
	$urlRouterProvider.otherwise('/model');
	$stateProvider
		.state('model',{
			url:'/model',
			// view:{
				templateUrl:'model.html',
				controller:modelCtl,
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

},{"./../controllers/modelCtl.js":5}],10:[function(require,module,exports){
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
        debugger
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

    return {
        toSet: toSet,
        toGet: toGet,
        toCompare: toCompare,
        toStorePerson: toStorePerson
    }

};



module.exports = localStorageItemsSvc;

},{}],11:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],12:[function(require,module,exports){

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

},{"./localStorageItemsSvc.js":10}]},{},[8]);
