(function() {
    app.controller('utenti-controller', ['$scope', '$rootScope', '$http',
        function ($scope, $rootScope, $http) {
            $http.get('/bank/getUsers')
                .then(function (response) {
                    $scope.users = JSON.parse(response.data);
                });
        }]);
})();