var app = angular.module('cac', ['ngRoute', 'ngAnimate']);

app.factory('requestService', ['$http', function($http){
  function buildUrl(query) {
    return 'http://api.geonames.org/' + query + '&username=danielrob'
  }
  return {
    getCountries : function(){return $http.get(buildUrl('countryInfoJSON?'), { cache: true})},
    getCountry : function(country){return $http.get(buildUrl('countryInfoJSON?country='+country), {cache: true});},
    getNeighbours : function(countryGeonameId){return $http.get(buildUrl('neighboursJSON?geonameId='+countryGeonameId), {cache: true});},
    getCapital : function(capital){return $http.get(buildUrl('searchJSON?q='+capital), {cache: true});}
  }
}]);

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

app.controller('countryCtrl', ['$http', '$scope', '$q', 'country', 'requestService', function($http, $scope, $q, country, requestService) {
  $scope.loading = true;

  requestService.getCountry(country).then(function(response) {
    console.log(response)
    $scope.ctry = response.data.geonames[0];
    var p1 = requestService.getNeighbours($scope.ctry.geonameId); 
    var p2 = requestService.getCapital($scope.ctry.capital);

    $q.all([p1,p2]).then(function(responses){
      console.log(responses[0])
      console.log(responses[1])
      $scope.ctry.neighbours = responses[0].geonames;
      $scope.ctry.capitalresolved = responses[1].data.geonames[0];
      $scope.loading = false;
    });
  })


}]);

app.controller('default', ['$scope', '$http', '$location', 'requestService', function($scope, $http, $location, requestService){ 
  $scope.loading = true;
  requestService.getCountries().then(function(data) {
     console.log(data.data.geonames);
     $scope.countries = data.data.geonames;
     $scope.loading = false;
  });
  $scope.showCountry = function(country) {
    $location.path('countries/' + country.countryCode);
  };
}]);