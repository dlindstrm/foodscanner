angular.module('foodscan.articleController', [])


.controller("ArticleController", function($stateParams, $scope, $http, $ionicLoading, $ionicNavBarDelegate, $ionicScrollDelegate, Articles, Favorite) {

  Articles.getArticle($stateParams.gtin, function(error, data) {
    if(error !== null) {
      $ionicNavBarDelegate.back();
    }
    $ionicLoading.hide();
    $scope.item = data;
  });

  $scope.accordion = {
    ingredients: 0,
    information: 0,
    carbon: 0,
    labels: 0,
    categories: 0
  }
  
  $scope.show = function(property) {
    if($scope.accordion[property] === 1) {
      $scope.accordion[property] = 0;
      setTimeout(function () {
      $ionicScrollDelegate.resize();
      },150);
    }
    else {
      $scope.accordion[property] = 1;
      setTimeout(function () {
      $ionicScrollDelegate.resize();
      },150);
    }
  }
  $scope.favorite = Favorite.isFavorite($stateParams.gtin);
  $scope.toggleFav = function(id, title, producer, country, img) {
    $scope.favorite = Favorite.toggleFavorite(id, title, producer, country, img);
  }
  related = function(cat1, cat2, cat3) {
  var url = 'http://fsserver.kspri.se/api/get/article?limit=5&cat1=';
  
  if(cat1 == undefined) {
    $scope.relatedArticles = [];
  }

  else if(cat2 == undefined) {
    $http.get(url+cat1.no)
      .success(function(data, status) {
            $scope.relatedArticles = data;
      });
  }

  else if(cat3 == undefined) {
    $http.get(url+cat1.no+'&cat2='+cat2.no)
      .success(function(data, status) {
            $scope.relatedArticles = data;
      });
  }

  else {
    $http.get(url+cat1.no+'&cat2='+cat2.no+'&cat3='+cat3.no)
      .success(function(data, status) {
            $scope.relatedArticles = data;
    });
  }
}
related($scope.item.productgroup.vendingArea,$scope.item.productgroup.majorGroup,$scope.item.productgroup.vendingGroup);

  this.goto = function(gtin) {
     Articles.goTo(gtin);
  }
});