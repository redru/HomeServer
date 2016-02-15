(function() {

    var ContoController = function($scope, $rootScope, $http) {
        var _this = this;
        _this.$scope = $scope;
        _this.$rootScope = $rootScope;
        _this.$http = $http;

        // $scope definition objects --------------------------------------------------
        $scope.balance = {
            total: 0,
            active: 0,
            passive: 0,
            isActive: true,

            reset: function() {
                this.total = 0;
                this.active = 0;
                this.passive = 0;
                this.isActive = true;
            }
        };

        $scope.addEntryModel.entry = {
            VALUE: 0,
            CODE: '',
            CAUSAL: '',
            DATE: '',
            isUpdate: false,

            reset: function() {
                this.VALUE = 0;
                this.CODE = '';
                this.CAUSAL = '';
                this.DATE = '';
            }
        };

        $scope.select = {
            selectedUser: {},
            selectedAccount: {}
        };
        // ----------------------------------------------------------------------------

        $scope.processBalance = function() {
            _this.processBalance();
        };

        $scope.getUserAccounts = function() {
            _this.getUserAccounts();
        };

        $scope.getUserAccountEntries = function() {
            _this.getUserAccountEntries();
        };

        $scope.addEntry = function() {
            _this.addEntry();
        };

        $scope.deleteEntry = function(id) {
            _this.deleteEntry(id);
        };

        $scope.modifyEntry = function(id) {
            _this.modifyEntry(id);
        };

        $http.get('/bank/getUsers')
            .then(function (response) {
                $scope.users = JSON.parse(response.data);
            });

    };

    ContoController.prototype.processBalance = function() {
        var $scope = this.$scope;
        $scope.balance.reset();

        for (var idx in $scope.entries) {
            if ($scope.entries[idx].VALUE > 0)
                $scope.balance.active += $scope.entries[idx].VALUE;
            else
                $scope.balance.passive += $scope.entries[idx].VALUE;

            $scope.balance.total += $scope.entries[idx].VALUE;
        }

        $scope.balance.isActive = $scope.balance.total >= 0;
    };

    ContoController.prototype.getUserAccounts = function() {
        var $scope = this.$scope;
        var $http = this.$http;

        $scope.accounts = [];
        $scope.entries = [];
        $scope.select.selectedAccount = '';
        $scope.balance.reset();

        if (!$scope.select.selectedUser)
            return;

        $http({
            url: '/bank/getAccounts',
            method: 'GET',
            params: {USER_ID: $scope.select.selectedUser.ID},

        }).then(function (response) {
            var accounts = JSON.parse(response.data);
            $scope.accounts = accounts ? accounts : [];
        });
    };

    ContoController.prototype.getUserAccountEntries = function() {
        var $scope = this.$scope;
        var $http = this.$http;

        $scope.entries = [];
        $scope.balance.reset();

        if (!$scope.select.selectedUser || !$scope.select.selectedAccount)
            return;

        $http({
            url: '/bank/getEntries',
            method: 'GET',
            params: {USER_ID: $scope.select.selectedUser.ID, ACCOUNT_ID: $scope.select.selectedAccount.ID},

        }).then(function (response) {
            $scope.entries = JSON.parse(response.data);
            $scope.processBalance();
        });
    };

    ContoController.prototype.addEntry = function() {
        var $scope = this.$scope;
        var $http = this.$http;

        $scope.addEntryModel.entry.USER_ID = $scope.select.selectedUser.ID;
        $scope.addEntryModel.entry.ACCOUNT_ID = $scope.select.selectedAccount.ID;

        $http({
            method: 'POST',
            url: '/bank/addEntry',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify($scope.addEntryModel)
        }).then(function (response) {
            if (response.data) {
                $scope.entries = JSON.parse(response.data);
                $scope.processBalance();
                document.getElementById('addEntryForm').reset();
            } else if (response.data == 'EMPTY') {
                alert('Problemi durante l\'inserimento.');
            }
        });
    };

    ContoController.prototype.deleteEntry = function(id) {
        var $scope = this.$scope;
        var $http = this.$http;
        var data = '{ "ENTRY_ID": "' + id + '", "USER_ID": "' + $scope.select.selectedUser.ID + '", "ACCOUNT_ID": "' + $scope.select.selectedAccount.ID + '" }';

        if (!confirm('Confermare eliminazione?')) {
            return;
        }

        $http({
            method: 'POST',
            url: '/bank/deleteEntry',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }).then(function (response) {
            if (response.data) {
                $scope.entries = JSON.parse(response.data);
                $scope.processBalance();
            } else if (response.data == 'EMPTY') {
                alert('Problemi durante la rimozione.');
            }
        });
    };

    ContoController.prototype.modifyEntry = function(id) {
        var $scope = this.$scope;
        var $http = this.$http;
        alert('Entry da modificare: ' + id);
    };

    // AngularJS, controller Class initialization
    ContoController.$inject = [ '$scope', '$rootScope', '$http' ];
    app.controller('conto-controller', ContoController);

})();