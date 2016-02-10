(function() {
    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/Home', {
                templateUrl: '/app/views/home.html',
                controller: 'home-controller'
            }).
            when('/Utenti', {
                templateUrl: '/app/views/utenti.html',
                controller: 'utenti-controller'
            }).
            when('/Conto', {
                templateUrl: '/app/views/conto.html',
                controller: 'conto-controller'
            }).
            when('/Complessivo', {
                templateUrl: '/app/views/complessivo.html',
                controller: 'complessivo-controller'
            }).
            otherwise({
                redirectTo: '/Home'
            });
        }]);
})();