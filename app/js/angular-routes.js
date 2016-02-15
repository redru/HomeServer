(function() {
    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/Home', {
                templateUrl: '/bank/views/home.html',
                controller: 'home-controller'
            }).
            when('/Utenti', {
                templateUrl: '/bank/views/utenti.html',
                controller: 'utenti-controller'
            }).
            when('/Conto', {
                templateUrl: '/bank/views/conto.html',
                controller: 'conto-controller'
            }).
            when('/Complessivo', {
                templateUrl: '/bank/views/complessivo.html',
                controller: 'complessivo-controller'
            }).
            otherwise({
                redirectTo: '/Home'
            });
        }]);
})();