angular.module('foodscan.articleController', [])


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