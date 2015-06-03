var app = angular.module('cac', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/', {
      templateUrl : 'views/home.html'
  })
  .when('/countries', {
      templateUrl : 'views/countries.html',
  })
  .when('/countries/:country', {
      templateUrl : 'views/country.html',
      controller: 'countryCtrl',
      resolve : {
          country: ['$route', function($route) {
              return $route.current.params.country;
          }]
      }
  })
}]);

app.controller('countryCtrl', ['$http', '$scope', 'country', function($http, $scope, country) {
  $http.get('http://api.geonames.org/countryInfoJSON?country='+country+'&username=danielrob', {cache: true}).success(function(data) {
    console.log(data.geonames[0]);
    $scope.ctry = data.geonames[0];
    $http.get('http://api.geonames.org/neighboursJSON?geonameId='+$scope.ctry.geonameId+'&username=danielrob', {cache: true}).success(function(data) {
      console.log(data)
      $scope.ctry.neighbours = data.geonames;
    });
    $http.get('http://api.geonames.org/searchJSON?q='+$scope.ctry.capital+'&username=danielrob', {cache: true}).success(function(data) {
      console.log(data.geonames[0])
      $scope.ctry.capitalresolved = data.geonames[0];
    });
  });
}]);

app.controller('default', ['$scope', '$http', '$location', function($scope, $http, $location){ 
  $http.get('http://api.geonames.org/countryInfoJSON?username=danielrob', { cache: true}).success(function(data) {
     console.log(data.geonames);
     $scope.countries = data.geonames;
  });
  $scope.showCountry = function(country) {
    $location.path('countries/' + country.countryCode);
  };
}]);