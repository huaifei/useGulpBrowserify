
var employeeRailCtl = require('./../controllers/employeeRailCtl.js');
var finalizeCtl = require('./../controllers/finalizeCtl.js');
var reportCtl = require('./../controllers/reportCtl.js');

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
			templateUrl:'finalize.html',
			controller:finalizeCtl,
			controllerAs: 'vm'
		})
		.state('report',{
			url:'/report',
			templateUrl:'report.html',
			controller:reportCtl,
			controllerAs: 'vm'
		});
}

module.exports = config;
