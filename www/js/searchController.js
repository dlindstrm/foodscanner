angular.module('foodscan.searchController', [])

.controller("SearchController", function($scope, $http, $stateParams, $location, $timeout, $ionicNavBarDelegate, $ionicPopup, _, Articles, ArticleList) {
  
  $scope.noArticles = true;
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
      $scope.noArticles = false;
      $scope.inputChangedPromise = $timeout(getArticles,1000);
    }
    else {
      $scope.loader = false;
      $scope.noArticles = true;
      $scope.previousSearches = JSON.parse(window.localStorage.getItem('previous_searches'));
    }
  }

  getArticles = function() {
    $scope.loader = true;
    window.localStorage.setItem('recent', $scope.input);
    $http.get('http://fsserver.kspri.se/api/get/article?search='+$scope.input+"&limit=10")
    .success(function(data, status) {
      $scope.loader = false;
      if(data.length < 1) {
        $scope.noResult = true;
        return;
      }
      $scope.noResult = false;
      $scope.articles = data;
      window.localStorage.setItem('recent_articles', JSON.stringify($scope.articles));
      var previous = JSON.parse(window.localStorage.getItem('previous_searches'));
      if(previous) {
        if(!_.find(previous, function(key){ return key === $scope.input}))
          previous.unshift($scope.input);
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
    console.log("hej")
    ArticleList.goTo('http://fsserver.kspri.se/api/get/article?search='+this.searchInput);
  }

  this.setInput = function(key) {
    this.searchInput = key;
    search(key);
  }

  this.clearPrevious = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Radera sökhistorik',
     template: 'Är du säker på att du vill radera din sökhistorik?',
     scope: $scope,
     buttons: [
      {
        text: 'Avbryt',
        type: 'button-balanced',
      }, 
      {
        text: 'Ta bort',
        type: 'button-assertive',
        onTap: function(e) {
          $scope.previousSearches = [];
          window.localStorage.removeItem("previous_searches");
        }
      }
    ]
   });
  };

  $scope.recent = window.localStorage.getItem('recent');
  if($scope.recent) {
    this.searchInput = $scope.recent;
  }
  $scope.recentArticles = JSON.parse(window.localStorage.getItem('recent_articles'));
  if($scope.recentArticles) {
    $scope.articles = $scope.recentArticles;
    $scope.noArticles = false;
  }
});