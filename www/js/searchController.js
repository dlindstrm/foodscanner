angular.module('foodscan.searchController', [])

.controller("SearchController", function($scope, $http, $stateParams, $location, $timeout, $ionicNavBarDelegate, _, Articles, ArticleList) {
  
  $scope.showPrevious = true;
  $scope.previousSearches = JSON.parse(window.localStorage.getItem('previous_searches'));

  this.change = function() {
    search(this.searchInput.toString());
  }

  search = function(key) {
    if($scope.inputChangedPromise){
        $timeout.cancel($scope.inputChangedPromise);
    }

    $scope.articles = [];
    $scope.noResult = false;
    $scope.input = key;
    if($scope.input.length > 0) {
      $scope.loader = true;
      $scope.showPrevious = false;
      $scope.inputChangedPromise = $timeout(getArticles,1000);
    }
    else {
      $scope.loader = false;
      $scope.showPrevious = true;
      $scope.previousSearches = JSON.parse(window.localStorage.getItem('previous_searches'));
    }
  }

  getArticles = function() {
    $scope.loader = true;
    $http.get('http://fsserver.kspri.se/api/get/article?search='+$scope.input+"&limit=10")
    .success(function(data, status) {
      $scope.loader = false;
      if(data.length < 1) {
        $scope.noResult = true;
        return;
      }
      $scope.articles = data;

      var previous = JSON.parse(window.localStorage.getItem('previous_searches'));
      if(previous) {
        if(!_.find(previous, function(key){ return key === $scope.input}))
          previous.push($scope.input);
      }
      else {
        var previous = [];
        previous.push($scope.input);
      }
      window.localStorage.setItem('previous_searches', JSON.stringify(previous));
    })
    .error(function(data, status) {
      $scope.loader = false;
      $scope.noResult = true;
    })
  }

  this.goto = function(gtin) {
    Articles.goTo(gtin);
  }

  this.cancel = function() {
    $ionicNavBarDelegate.back();
  }

  this.showAll = function() {
    ArticleList.goTo('http://fsserver.kspri.se/api/get/article?search='+$scope.input);
  }

  this.setInput = function(key) {
    this.searchInput = key;
    search(key);
  }

  this.clearPrevious = function() {
    $scope.showPrevious = false;
    $scope.previousSearches = [];
    window.localStorage.removeItem("previous_searches");
  }
});