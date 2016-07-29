
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
