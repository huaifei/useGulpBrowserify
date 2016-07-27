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
