(function() {
    app.controller('conto-controller', ['$scope', '$rootScope', '$http',
        function ($scope, $rootScope, $http) {
            $http.get('/bank/getUsers')
                .then(function (response) {
                    $scope.users = JSON.parse(response.data);
                });

            $http.get('/bank/getEntries')
                .then(function (response) {
                    $scope.entries = JSON.parse(response.data);
                });

            /**
             *
             * @param ownerId
             */
            $scope.getAccountsByUser = function(ownerId) {
                $http({
                    url: '/bank/getAccounts',
                    method: 'GET',
                    params: {OWNER_ID: ownerId},

                }).then(function (response) {
                    var accounts = JSON.parse(response.data);
                    $scope.accounts = accounts ? accounts : [];
                });
            }

            /**
             *
             */
            $scope.addEntry = function() {
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