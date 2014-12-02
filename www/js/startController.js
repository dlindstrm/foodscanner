angular.module('foodscan.startController', [])

.controller("StartController", function($scope, $location) { 
  $scope.go = function(path) {
    /**
     * Clearing some localStorage
     */
    window.localStorage.removeItem('recent');
    window.localStorage.removeItem('recent_articles');
    window.localStorage.removeItem('articles');
    window.localStorage.removeItem('original');
    
    $location.path(path);
  }
})