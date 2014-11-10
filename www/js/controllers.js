angular.module('foodscan.controllers', [])

.controller('FormController', function ($location, $scope, $ionicLoading, Articles) {
  this.submit = function() {
      $ionicLoading.show();
      $scope.input = this.gtinInpt.toString();
      while($scope.input.length < 14) {
        $scope.input = "0" + $scope.input;
      }
      Articles.goTo($scope.input);
  };
})

.controller("ScanController", function($scope, $cordovaBarcodeScanner) { 
  $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
          alert(imageData.text);
          console.log("Barcode Format -> " + imageData.format);
          console.log("Cancelled -> " + imageData.cancelled);
      }, function(error) {
          console.log("An error happened -> " + error);
      });
  }; 
})

.controller("ArticleController", function($stateParams, $scope, $ionicLoading, $ionicNavBarDelegate, Articles) {
  Articles.getArticle($stateParams.gtin, function(error, data) {
    if(error !== null) {
      $ionicNavBarDelegate.back();
      return alert("Något fel med servern.");
    }
    $ionicLoading.hide();
    $scope.item = data;
  })
  $scope.accordion = {
    ingredients: 0,
    carbon: 0,
    labels: 0,
    categories: 0
  }
  $scope.show = function(property) {
    if($scope.accordion[property] === 1) {
      $scope.accordion[property] = 0;
    }
    else {
      $scope.accordion[property] = 1;
    }
  }
})

.controller("SearchController", function($scope, $http, $location, $timeout, $ionicNavBarDelegate, _, Articles) {
  
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
    $http.get('http://fsserver.kspri.se/api/get?searchRegex='+$scope.input+"&limit=10")
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
    $location.path('/app/search/'+$scope.input)
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