angular.module('foodscan.scanController', [])

.controller("ScanController", function($scope, $cordovaBarcodeScanner, Articles) { 
  $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
          alert("Format: "+imageData.format+"Code: "+imageData.text);
          Articles.goTo(imageData.text);
      }, function(error) {
          console.log("An error happened -> " + error);
      });
  }; 
})

/*.controller("ScanController", function($scope, $cordovaBarcodeScanner, Articles) {
  $scope.scanditOpt = {
    "beep": true,
    "1DScanning": true,
    "2DScanning": false,
    "vibrate": true,
    "searchBar": true,
    "searchBarActionButtonCaption": "Sök",
    "searchBarPlaceholderText": "Skanna streckkod eller skriv in den här",
    "toolBarButtonCaption": "Avbryt",
    "torch": false,
    "viewfinderColor": "000000"
  }

  $scope.scanBarcode = function() {
      cordova.exec(success, failure, "ScanditSDK", "scan",
                           ["uELRX65mo61r9elqQN3f5hip4bT6SlSJyA1GTEEFqNU", $scope.scanditOpt]);
  };

  success = function(resultArray) {
     alert("Scanned " + resultArray[0] + " code: " + resultArray[1]);
  }

  failure = function(error) {
    alert("Failed: " + error);
  } 
})*/