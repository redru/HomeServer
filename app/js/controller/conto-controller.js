(function() {
    app.controller('conto-controller', ['$scope', '$rootScope', '$http',
        function ($scope, $rootScope, $http) {
            $http.get('/bank/getUsers')
                .then(function (response) {
                    $scope.users = JSON.parse(response.data);
                });

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
                    if (response.data == 'OK') {
                        document.getElementById('addEntryForm').reset();
                        alert('Inserimento avvenuto correttamente.');
                    } else {
                        alert('Problemi durante l\'inserimento.');
                    }
                });
            };

            /**
             *
             * @param id
             */
            $scope.modifyEntry = function(id) {
                alert('Entry da modificare: ' + id);
            };
        }]);
})();