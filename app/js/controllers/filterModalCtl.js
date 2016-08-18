var filterModalCtl = function ($rootScope, $scope, $uibModalInstance, $http, $filter) {
    
    var vm = this;
    var filtersCache, selectedFilters, filtersWatcherUnset;
    var filtersDirty = false;
    $rootScope.firstRun = true;

    if(filtersDirty === false){
        monitorFilters();
    }

    var url = "../data/finalizeFilter.json";
    $http.get(url).success(
        function(response) {
            $scope.res = response;
        }
    );

    $scope.submit = function () {
        if(filtersDirty || $rootScope.firstRun){
            setFiltersCache(selectedFilters);
            processUpdatedFilters(selectedFilters);
        }

        $rootScope.firstRun = false;
        $uibModalInstance.close();  //TODO: close first or not.
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    function setSelections() {
        var cachedFilters = getFiltersCache();
        // var planId = SettingsSvc.getCurrentPlanCode();
debugger
        // selectedFilters.PlanType = $filter('filter')($scope.filters.PlanTypes, {PlanId: planId })[0];  //TODO-- it is possible that the downstream submission process is already pulling the global values off of the services, rather than the passed object...  Or that that could be made to be the case....
        // selectedFilters.Country = SettingsSvc.getCurrentCountry();
        // selectedFilters.Currency = SettingsSvc.getCurrentCurrency();
        selectedFilters.LineManager = cachedFilters ? cachedFilters.LineManager : {};
        selectedFilters.CurrentLevel = cachedFilters ? cachedFilters.CurrentLevel : {};
        selectedFilters.NewZoneNbr = cachedFilters ? cachedFilters.NewZoneNbr : {};
        selectedFilters.TalentPriority = cachedFilters ? cachedFilters.TalentPriority : {};
        selectedFilters.CurrentSublevel = cachedFilters ? cachedFilters.CurrentSublevel : {};
        selectedFilters.NewRoleFamily = cachedFilters ? cachedFilters.NewRoleFamily : {};
        selectedFilters.NewLevel = cachedFilters ? cachedFilters.NewLevel : {};
        selectedFilters.Location = cachedFilters ? cachedFilters.Location : {};
        selectedFilters.Progressing = cachedFilters ? cachedFilters.Progressing : {};
        selectedFilters.Promotion = cachedFilters ? cachedFilters.Promotion : {};
        selectedFilters.TalentDecision = cachedFilters ? cachedFilters.TalentDecision : {};
        selectedFilters.nameText = cachedFilters ? cachedFilters.nameText : '';
    }
    
    $scope.isOpen = {
        LineManager: false,
        Promotion: false,
        CurrentLevel: false,
        Location: false,
        Progressing: false,
        NewLevel: false,
        NewZoneNbr: false,
        TalentDecision: false,
        CurrentSublevel: false,
        NewRoleFamily: false,
        TalentPriority: false
    };
    
    // $scope.isOpen = false;

    $scope.selected = {
        filters: {}
    };
    selectedFilters = $scope.selected.filters;

    $scope.typeOf = function (value) {
        var ret = typeof value;
        return ret;
    };

    setSelections();

    $scope.updateDropdownOpenState = function (evt, firstOrLast, dropdownName) {
        var pressedKey;
        var TAB = 9;
        var element = evt.target;

        if (evt instanceof jQuery.Event) {
            evt = evt.originalEvent;
        }

        //although deprecated, the below have far greater browser support than the recommended evt.key. 
        //until .key is better supported, this implementation is far easier, and ought not be disappearing any time soon
        pressedKey = evt.keyCode || evt.charCode || evt.which;
        pressedKey = parseInt(pressedKey, 10);

        if (firstOrLast === 'last' && (pressedKey === TAB && !(evt.shiftKey)) ) {
            $scope.dropdownIsOpenState[dropdownName] = false;
        } else if ( firstOrLast === 'first' && (pressedKey === TAB && evt.shiftKey) ) {
            // evt.preventDefault();
            $scope.dropdownIsOpenState[dropdownName] = false;
        } else if (firstOrLast === 'both' && (pressedKey === TAB) ) { // if it's both, we don't need to know if it's a tab or a shift-tab -- either means we're closing up shop
            $scope.dropdownIsOpenState[dropdownName] = false;
        }
    };

    $scope.bufferEscapeKeydown = function (evt) {
        var pressedKey;
        var ESC = 27;

        if (evt instanceof jQuery.Event) {
            evt = evt.originalEvent;
        }

        pressedKey = evt.keyCode || evt.charCode || evt.which;
        pressedKey = parseInt(pressedKey, 10);

        if (pressedKey === ESC) {
            evt.preventDefault();
        }

    };



    function setFiltersDirty() {
        // console.log('setting filters dirty');
        filtersDirty = true;
    }

    function monitorFilters() {
        debugger
        // console.log('monitoring filters...');
        if (filtersWatcherUnset) { //TODO: this is probably completely unnecessary...
            filtersWatcherUnset();
        }
        filtersWatcherUnset = $scope.$watch('$scope.selected.filters', function (newFilters, oldFilters) {
            debugger
            // console.log('filters watcher called');
            if (!angular.equals(newFilters, oldFilters)) {
                setFiltersDirty();
                filtersWatcherUnset();
            }
        }, true);
    }


    $scope.$watch('$scope.selected.filters', function (newFilters, oldFilters) {
        // console.log('filters watcher called');
        if (!angular.equals(newFilters, oldFilters)) {
            setFiltersDirty();
            filtersWatcherUnset();
        }
    }, true);

    function setFiltersCache(filtersObj) {
        filtersCache = filtersObj;
    }
    function getFiltersCache() {
        return filtersCache;
    }
 
    function buildUpdatedFilters (currentFilters) {
        var config = {
            LineManager: undefined,
            TalentPriority: undefined,
            CurrentLevel: undefined,
            CurrentSublevel: undefined,
            NewLevel: undefined,
            NewZoneNbr: undefined,
            NewRoleFamily: undefined,
            Location: undefined,
            Progressing: undefined,
            Promotion: undefined,
            TalentDecision: undefined
        };

        var key;

        function buildMultiSelectArray(selectionObj) {
            var key;
            var returnArray = [];
            var valParsedToNumber;
            for (key in selectionObj) {
                if (selectionObj.propertyIsEnumerable(key)) {
                    if (selectionObj[key] === 'number') {
                        valParsedToNumber = parseInt(key, 10);
                        returnArray.push(isFinite(valParsedToNumber) ? valParsedToNumber : key);
                    } else if (selectionObj[key] === 'string') {
                        returnArray.push(key);
                    } else if (selectionObj[key] === 'boolean') {
                        returnArray.push(JSON.parse(key));
                    }
                }
            }
            return returnArray;
        }

        if (currentFilters) {
            for (key in config) {
                if (config.propertyIsEnumerable(key)) {
                    config[key] = buildMultiSelectArray(currentFilters[key]);
                }
            }
        }

        config.NameText = undefined;

        if (currentFilters) {
            config.NameText = currentFilters.nameText;
        }

        return config;

    }

    function processUpdatedFilters (currentFilters) {
        var results = buildUpdatedFilters(currentFilters);
        $rootScope.$emit('filtersUpdated',results);
    }




};


module.exports = filterModalCtl;