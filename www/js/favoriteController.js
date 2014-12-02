angular.module('foodscan.favoriteController', [])

.controller("FavoriteController", function($scope, Articles, Favorite) {
	$scope.favs = JSON.parse(localStorage["favorites"]);

	this.goto = function(gtin) {
	   Articles.goTo(gtin);
	}

	$scope.toggleFav = function(id) {
    	$scope.favorite = Favorite.toggleFavorite(id);
    	$scope.favs = JSON.parse(localStorage["favorites"]);
  	}
});