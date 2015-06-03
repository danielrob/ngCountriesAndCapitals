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

app.controller('countryCtrl', ['$http', '$scope', '$q', 'country', function($http, $scope, $q, country) {
  $scope.loading = true;

  function getCountry(country){
    return $http.get('http://api.geonames.org/countryInfoJSON?country='+country+'&username=danielrob', {cache: true});
  }

  function getNeighbours(countryGeonameId) {
    return $http.get('http://api.geonames.org/neighboursJSON?geonameId='+$scope.ctry.geonameId+'&username=danielrob', {cache: true});
  }

  function getCapital(countryGeonameId) {
    return $http.get('http://api.geonames.org/searchJSON?q='+$scope.ctry.capital+'&username=danielrob', {cache: true});
  }

  getCountry(country).then(function(response) {
    console.log(response)
    $scope.ctry = response.data.geonames[0];
    $q.all([getNeighbours(),getCapital()]).then(function(responses){
      console.log(responses[0])
      console.log(responses[1])
      $scope.ctry.neighbours = responses[0].geonames;
      $scope.ctry.capitalresolved = responses[1].data.geonames[0];
      $scope.loading = false;
    });
  })


}]);

app.controller('default', ['$scope', '$http', '$location', function($scope, $http, $location){ 
  $scope.loading = true;
  $http.get('http://api.geonames.org/countryInfoJSON?&username=danielrob', { cache: true}).success(function(data) {
     console.log(data.geonames);
     $scope.countries = data.geonames;
     $scope.loading = false;
  });
  $scope.showCountry = function(country) {
    $location.path('countries/' + country.countryCode);
  };
}]);