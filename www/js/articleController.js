angular.module('foodscan.articleController', [])


.controller("ArticleController", function($stateParams, $scope, $http, $ionicLoading, $timeout, $ionicNavBarDelegate, $ionicScrollDelegate, Articles, Favorite, ExternalLink) {

  $scope.relatedArticles = [];
  Articles.getArticle($stateParams.gtin, function(error, data) {
    if(error !== null) {
      $ionicNavBarDelegate.back();
    }
    $ionicLoading.hide();
    $scope.item = data;
    $scope.relatedArticles = $scope.item.related;
  });

  $scope.accordion = {
    ingredients: false,
    information: false,
    carbon: false,
    labels: false,
    categories: false
  }

  $scope.toggleGroup = function(property) {
    if ($scope.isGroupShown(property)) {
      $scope.accordion[property] = false;
    } 
    else {
      $scope.accordion[property] = true;
    }
    $timeout(function () {
      $ionicScrollDelegate.resize();
    }, 150);
  };
  $scope.isGroupShown = function(property) {
    return $scope.accordion[property] === true;
  };

  $scope.favorite = Favorite.isFavorite($stateParams.gtin);
  $scope.toggleFav = function(id, title, producer, country, img) {
    $scope.favorite = Favorite.toggleFavorite(id, title, producer, country, img);
  }

  this.goto = function(gtin) {
     Articles.goTo(gtin);
  }

  $scope.gotoExternal = function(link) {
    ExternalLink.goTo(link);
  }
});