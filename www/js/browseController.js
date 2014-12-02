angular.module('foodscan.browseController', [])

.controller("BrowseController", function($scope, $http, ArticleList, Favorite) {
  $scope.levelOne = [];
  $scope.levelTwo = [];
  $scope.levelThree = [];
  $scope.selected1 = false;
  $scope.selected2 = false;

  $http.get('http://fsserver.kspri.se/api/get/category?level=1')
  .success(function(data, status) {
    $scope.levelOne = data;
  });

 $scope.setLvl = function(cat1, cat2) {
  var url = 'http://fsserver.kspri.se/api/get/category?cat1=';
  
  if(cat1 == undefined) {
    $scope.selected1 = false;
    $scope.selected2 = false;
    $scope.levelTwo = [];
    $scope.levelThree = [];
  }

  else if(cat2 == undefined) {
    $scope.selected1 = false;
    $scope.selected2 = false;
    $scope.levelTwo = [];
    $scope.levelThree = [];
    $http.get(url+cat1)
      .success(function(data, status) {
            $scope.levelTwo = data.childs;
            $scope.selected1 = true;
      });
  }

  else {
    $http.get(url+cat1+'&cat2='+cat2)
      .success(function(data, status) {
            $scope.levelThree = data.childs;
            $scope.selected2 = true;
      });
 }

 $scope.show = function(cat1, cat2, cat3) {
  if(cat2 == undefined) {
    ArticleList.goTo('http://fsserver.kspri.se/api/get/article?cat1='+cat1);
  }
  else if (cat3 == undefined) {
    ArticleList.goTo('http://fsserver.kspri.se/api/get/article?cat1='+cat1+'&cat2='+cat2);
  }
  else {
    ArticleList.goTo('http://fsserver.kspri.se/api/get/article?cat1='+cat1+'&cat2='+cat2+'&cat3='+cat3);
  }
}
}

});
