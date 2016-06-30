
    function flyoutTrigger () {

        // "ngInject";

        var directive = {};
        directive.transclude = false;
        directive.restrict = "E";
        directive.templateUrl = "./../html/flyoutTriggerTpl.html";
        // directive.scope = {
        //     employee: '='
        // };
        directive.controller = '';

        return directive;
    }

module.exports = flyoutTrigger;
