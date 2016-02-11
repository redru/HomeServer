(function() {
    app.controller('conto-controller', ['$scope', '$rootScope', '$http',
        function ($scope, $rootScope, $http) {
            $http.get('/bank/getEntries')
                .then(function (response) {
                    $scope.entries = JSON.parse(response.data);
                });

            // Definizione delle funzioni dello $scope
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

            $scope.modifyEntry = function(id) {
                alert('Entry da modificare: ' + id);
            };
        }]);
})();