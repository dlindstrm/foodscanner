angular.module('foodscan.articleController', [])


.controller("ArticleController", function($stateParams, $scope, $ionicLoading, $ionicNavBarDelegate, Articles, Favorite) {
  Articles.getArticle($stateParams.gtin, function(error, data) {
    if(error !== null) {
      $ionicNavBarDelegate.back();
    }
    $ionicLoading.hide();
    $scope.item = data;
    console.log($scope.item);
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
  $scope.favorite = Favorite.isFavorite($stateParams.gtin);
  $scope.toggleFav = function(id, title, producer, country, img) {
    $scope.favorite = Favorite.toggleFavorite(id, title, producer, country, img);
  }
})