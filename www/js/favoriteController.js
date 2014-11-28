angular.module('foodscan.favoriteController', [])

.controller("FavoriteController", function($scope) {
	$scope.favs = JSON.parse(localStorage["favorites"]);
});