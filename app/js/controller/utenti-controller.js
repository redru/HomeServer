(function() {

    var UtentiController = function($scope, $rootScope, $http) {
        var _this = this;

        $scope.getUsers = function() {
            _this.getUsers($scope, $http);
        }

        /*$scope.doStuff = function() {
            _this.doStuff();
        };*/

        _this.getUsers($scope, $http);
    };

    UtentiController.prototype.getUsers = function($scope, $http) {
        $http.get('/bank/getUsers')
            .then(function (response) {
                $scope.users = JSON.parse(response.data);
            });
    };

    UtentiController.prototype.doStuff = function() {

    };

    // AngularJS, controller Class initialization
    UtentiController.$inject = [ '$scope', '$rootScope', '$http' ];
    app.controller('utenti-controller', UtentiController);

})();