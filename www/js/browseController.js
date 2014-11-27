angular.module('foodscan.browseController', [])

.controller("BrowseController", function($scope, $http, ArticleList) {
  $scope.levelOne = [];
  $scope.levelTwo = [];
  $scope.levelThree = [];

  $http.get('http://fsserver.kspri.se/api/get/category?level=1')
  .success(function(data, status) {
    $scope.levelOne = data;
  });

 $scope.setLvl = function(cat1, cat2) {
  var url = 'http://fsserver.kspri.se/api/get/category?cat1=';
  
  if(cat2 == undefined) {
    $scope.levelTwo = [];
    $scope.levelThree = [];
    $http.get(url+cat1)
      .success(function(data, status) {
            $scope.levelTwo = data.childs;
      });
  }

  else {
    $http.get(url+cat1+'&cat2='+cat2)
      .success(function(data, status) {
            $scope.levelThree = data.childs;
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
    console.log('http://fsserver.kspri.se/api/get/article?cat1='+cat1+'&cat2='+cat2+'&cat3'+cat3);
    ArticleList.goTo('http://fsserver.kspri.se/api/get/article?cat1='+cat1+'&cat2='+cat2+'&cat3='+cat3);
  }
}

}
});
