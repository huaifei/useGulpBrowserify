
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
            // var element = elem;   //tip;: There are some difference between elem and elem[0] when I borrow it from the Project.
            var element = elem[0];
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