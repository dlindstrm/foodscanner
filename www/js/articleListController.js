angular.module('foodscan.articleListController', [])

.controller("ArticleListController", function($scope, $http, $stateParams, $timeout, $ionicModal, $ionicPopover, $ionicScrollDelegate, Articles, ArticleList) {
  $scope.catFilter = [];
  $scope.producerFilter = [];
  $scope.countryFilter = [];
  $scope.sort = '';
  ArticleList.set(ArticleList.getOriginal());

  setArticles = function() {
    $scope.itemsPerPage = 20;
    $scope.currentPage = 0;
    $scope.total = ArticleList.total();
    $scope.articles = ArticleList.get($scope.currentPage*$scope.itemsPerPage, $scope.itemsPerPage);
    $scope.noResult = ($scope.articles.length < 1) ? true : false;
  }

  $scope.loadMore = function() {
    $scope.loader = true;
    $timeout(function() {
      $scope.currentPage++;
      var newItems = ArticleList.get($scope.currentPage*$scope.itemsPerPage, $scope.itemsPerPage);
      $scope.articles = $scope.articles.concat(newItems);
      $scope.loader = false;
      $ionicScrollDelegate.resize();
    }, 200);

  };

  $scope.nextPageDisabledClass = function() {
    return $scope.currentPage === $scope.pageCount()-1;
  };

  $scope.pageCount = function() {
    return Math.ceil($scope.total/$scope.itemsPerPage);
  };

	this.goto = function(gtin) {
	   Articles.goTo(gtin);
	}

  /**
   * Filter
   */
  
  filter = function() {
    var articles = ArticleList.getOriginal();
    if($scope.sort.property !== 'ng') {
      $scope.sortActive = true;
      articles = _.sortBy(articles, function(obj){ return obj.dabas[$scope.sort.property]; });
    }
    else {
      $scope.sortActive = false;
    }
    if($scope.catFilter.length !== 0) {
      $scope.catActive = true;
      articles = _.filter(articles, function(obj){
        if(obj.productgroup.vendingGroup) 
          return $scope.catFilter.indexOf(obj.productgroup.vendingGroup.article) !== -1; 
        else 
          return false;
      });
    }
    else {
      $scope.catActive = false;
    }
    if($scope.producerFilter.length !== 0) {
      $scope.producerActive = true;
      articles = _.filter(articles, function(obj){ return $scope.producerFilter.indexOf(obj.dabas.producer) !== -1; });
    }
    else {
      $scope.producerActive = false;
    }
    if($scope.countryFilter.length !== 0) {
      $scope.countryActive = true;
      articles = _.filter(articles, function(obj){ return $scope.countryFilter.indexOf(obj.dabas.country) !== -1; });
    }
    else {
      $scope.countryActive = false;
    }
    ArticleList.set(articles);
    setArticles();
  }

  $scope.applyCategories = function() {
    $scope.closeModal(1);
    var checked = _.filter($scope.categories, function(item) {
      return item.checked === true;
    });
    $scope.catFilter = [];
    for(var i = 0; i<checked.length; i++) {
      $scope.catFilter.push(checked[i].article);
    }
    filter();
  }

  $scope.applyFilters = function() {
    $scope.closeModal(2);

    /// Producer filter
    var checked = _.filter($scope.producers, function(item) {
      return item.checked === true;
    });
    $scope.producerFilter = [];
    for(var i = 0; i<checked.length; i++) {
      $scope.producerFilter.push(checked[i].name);
    }

    /// Country filter
    var checked = _.filter($scope.countries, function(item) {
      return item.checked === true;
    });
    $scope.countryFilter = [];
    for(var i = 0; i<checked.length; i++) {
      $scope.countryFilter.push(checked[i].name);
    }

    filter();
  }

  $scope.accordion = {
    producers: 0,
    countries: 0
  };

  $scope.accordionShow = function(property) {
    if($scope.accordion[property] === 1) {
      $scope.accordion[property] = 0;
    }
    else {
      $scope.accordion[property] = 1;
    }
  }

  /**
   * Get all filter options
   */
  getCategories = function() {
    var data = ArticleList.getOriginal();
    var unique = _.filter(data, function(obj) {
      return "vendingGroup" in obj.productgroup === true;
    });
    unique = _.uniq(unique, function(item, key, no) {
      return item.productgroup.vendingGroup.article;
    });
    unique = _.pluck(unique, 'productgroup');
    $scope.categories = _.pluck(unique, 'vendingGroup');
  }

  getProducers = function() {
    var data = ArticleList.getOriginal();
    var unique = _.uniq(data, function(item, key, producer) {
      return item.dabas.producer;
    });
    unique = _.pluck(unique, 'dabas');
    unique = _.pluck(unique, 'producer');
    $scope.producers = [];
    for(var i = 0; i<unique.length; i++) {
      $scope.producers.push({name: unique[i]});
    }
  }

  getCountries = function() {
    var data = ArticleList.getOriginal();
    var unique = _.uniq(data, function(item, key, country) {
      return item.dabas.country;
    });
    unique = _.pluck(unique, 'dabas');
    unique = _.pluck(unique, 'country');
    $scope.countries = [];
    for(var i = 0; i<unique.length; i++) {
      if(unique[i] !== "")
        $scope.countries.push({name: unique[i]});
    }
  }

  init = function() {
    setArticles();
    getCategories();
    getProducers();
    getCountries();
  }
  $timeout(init);

  
  /**
   * Modals for filtering/sorting
   */

  $ionicModal.fromTemplateUrl('categories.html', {
    id: 1,
    scope: $scope,
    backdropClickToClose: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.oModal1 = modal;
  });
  $ionicModal.fromTemplateUrl('filter.html', {
    id: 2,
    scope: $scope,
    backdropClickToClose: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.oModal2 = modal;
  });

  $ionicModal.fromTemplateUrl('sort.html', {
    id: 3,
    scope: $scope,
    backdropClickToClose: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.oModal3 = modal;
  });

  $scope.openModal = function(index) {
    if(index == 1) $scope.oModal1.show();
    else if(index == 2) $scope.oModal2.show();
    else $scope.oModal3.show();
  };
  $scope.closeModal = function(index) {
    if(index == 1) $scope.oModal1.hide();
    else if(index == 2) $scope.oModal2.hide();
    else $scope.oModal3.hide();
  };
  
  // Cleanup the modals when we're done with them (i.e: state change)
  // Angular will broadcast a $destroy event just before tearing down a scope 
  // and removing the scope from its parent.
  $scope.$on('$destroy', function() {
    $scope.oModal1.remove();
    $scope.oModal2.remove();
    $scope.oModal3.remove();
  });
  
  $scope.sort = {
    property: 'ng'
  };
  $scope.applySort = function(property) {
    $scope.closeModal(3);
    filter();
  };
});