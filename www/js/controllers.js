angular.module('foodscan.controllers', [])

.controller('FormController', function ($location, $scope, $ionicLoading, Articles) {
  this.submit = function() {
      $ionicLoading.show();
      $scope.input = this.gtinInpt.toString();
      while($scope.input.length < 14) {
        $scope.input = "0" + $scope.input;
      }
      Articles.httpGet($scope.input, function(status, data) {
        if(status !== 200) {
          $ionicLoading.hide();
          return alert("Ingen artikel hittades.")
        }
        $location.path("/app/article/"+$scope.input)
      });
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
})