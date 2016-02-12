(function() {
    app.controller('conto-controller', ['$scope', '$rootScope', '$http',
        function ($scope, $rootScope, $http) {
            $http.get('/bank/getUsers')
                .then(function (response) {
                    $scope.users = JSON.parse(response.data);
                });

            $scope.accountSum = function() {
                var sum = 0;
                for (var idx in $scope.entries) {
                    sum += $scope.entries[idx].VALUE;
                }

                $scope.positiveAccount = sum >= 0;

                return sum;
            };

            $scope.activeSum = function() {
                var sum = 0;
                for (var idx in $scope.entries) {
                    if ($scope.entries[idx].VALUE > 0)
                        sum += $scope.entries[idx].VALUE;
                }

                return sum;
            };

            $scope.passiveSum = function() {
                var sum = 0;
                for (var idx in $scope.entries) {
                    if ($scope.entries[idx].VALUE < 0)
                        sum -= $scope.entries[idx].VALUE;
                }

                return sum;
            };

            /**
             *
             * @param ownerId
             */
            $scope.getUserAccounts = function() {
                $scope.accounts = [];
                $scope.entries = [];
                $scope.selectedAccount = '';

                $http({
                    url: '/bank/getAccounts',
                    method: 'GET',
                    params: {USER_ID: $scope.selectedUser.ID},

                }).then(function (response) {
                    var accounts = JSON.parse(response.data);
                    $scope.accounts = accounts ? accounts : [];
                });
            };

            /**
             *
             * @param userId
             * @param accountId
             */
            $scope.getUserAccountEntries = function() {
                $scope.entries = [];

                $http({
                    url: '/bank/getEntries',
                    method: 'GET',
                    params: {USER_ID: $scope.selectedUser.ID, ACCOUNT_ID: $scope.selectedAccount.ID},

                }).then(function (response) {
                    $scope.entries = JSON.parse(response.data);
                });
            };

            /**
             *
             */
            $scope.addEntry = function() {
                $scope.addEntryModel.entry.USER_ID = $scope.selectedUser.ID;
                $scope.addEntryModel.entry.ACCOUNT_ID = $scope.selectedAccount.ID;

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
                        document.getElementById('addEntryForm').reset();
                    } else if (response.data == 'EMPTY') {
                        alert('Problemi durante l\'inserimento.');
                    }
                });
            };

            $scope.deleteEntry = function(id) {
                var data = '{ "ENTRY_ID": "' + id + '", "USER_ID": "' + $scope.selectedUser.ID + '", "ACCOUNT_ID": "' + $scope.selectedAccount.ID + '" }';

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
                        document.getElementById('addEntryForm').reset();
                    } else if (response.data == 'EMPTY') {
                        alert('Problemi durante la rimozione.');
                    }
                });
            }

            /**
             *
             * @param id
             */
            $scope.modifyEntry = function(id) {
                alert('Entry da modificare: ' + id);
            };
        }]);
})();