
var finalizeCtl = function () {
    
    var vm = this;
    vm.jumpLinksShowing = true;

    vm.hideJumpLinks = function () {
        vm.jumpLinksShowing = true;
    };
    vm.showJumpLinks = function () {
        vm.jumpLinksShowing = false;
    };
    
};

module.exports = finalizeCtl;