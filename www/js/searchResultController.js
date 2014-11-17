angular.module('foodscan.searchResultController', [])

.controller("SearchResultController", function($scope, $http, $stateParams, Articles, SearchResult) {
	$scope.articles = SearchResult.get();
	$scope.limit = 10;
	$scope.key = $stateParams.key;

	this.loadMore = function() {
		$scope.limit = $scope.limit+10;
		$scope.loader = true;
    $http.get('http://fsserver.kspri.se/api/get?search='+$scope.key+"&limit="+$scope.limit)
    .success(function(data, status) {
      $scope.loader = false;
      data = data.slice($scope.limit-10, data.length);

      if(data.length < 10) {
        $scope.noResult = true;
      }
      SearchResult.append(data);
      $scope.articles = SearchResult.get();

    })
    .error(function(data, status) {
      $scope.loader = false;
    })
	}

	this.goto = function(gtin) {
	   Articles.goTo(gtin);
	}
});