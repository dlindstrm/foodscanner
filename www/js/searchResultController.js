angular.module('foodscan.searchResultController', [])

.controller("SearchResultController", function($scope, $http, $stateParams, $timeout, $ionicModal, $ionicPopover, Articles, SearchResult) {
	$scope.key = $stateParams.key;
  $scope.loader = true;
  $scope.catFilter = [];
  $scope.producerFilter = [];
  $scope.countryFilter = [];
  $scope.sort = '';

  $http.get('http://fsserver.kspri.se/api/get/article?search='+$scope.key)
  .success(function(data, status) {
    /// TA BORT DET HÄR FILTRET
    data = _.filter(data, function(obj) {
      return obj.dabas.productcode !== null;
    })
    data = _.filter(data, function(obj) {
      return obj.dabas.productcode.length > 1;
    })


    $scope.loader = false;
    SearchResult.setOriginal(data);
    SearchResult.set(data);
    setArticles();
    
    getCategories(data);
    getProducers(data);
    getCountries(data);
  })
  .error(function(data, status) {
    $scope.loader = false;
    $scope.noResult = true;
    $scope.nextPageDisabledClass();
  });

  setArticles = function() {
    $scope.itemsPerPage = 20;
    $scope.currentPage = 0;
    $scope.total = SearchResult.total();
    $scope.articles = SearchResult.get($scope.currentPage*$scope.itemsPerPage, $scope.itemsPerPage);
  }

  $scope.loadMore = function() {
    $scope.currentPage++;
    var newItems = SearchResult.get($scope.currentPage*$scope.itemsPerPage, $scope.itemsPerPage);
    $scope.articles = $scope.articles.concat(newItems);
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
    var articles = SearchResult.getOriginal();
    if($scope.catFilter.length !== 0) {
      articles = _.filter(articles, function(obj){ return $scope.catFilter.indexOf(obj.productgroup.vendingGroup.article) !== -1; });
    }
    if($scope.producerFilter.length !== 0) {
      articles = _.filter(articles, function(obj){ return $scope.producerFilter.indexOf(obj.dabas.producer) !== -1; });
    }
    if($scope.countryFilter.length !== 0) {
      articles = _.filter(articles, function(obj){ return $scope.countryFilter.indexOf(obj.dabas.country) !== -1; });
    }
    SearchResult.set(articles);
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
  getCategories = function(data) {
    var unique = _.filter(data, function(obj) {
      return "vendingGroup" in obj.productgroup === true;
    });
    unique = _.uniq(unique, function(item, key, no) {
      return item.productgroup.vendingGroup.article;
    });
    unique = _.pluck(unique, 'productgroup');
    $scope.categories = _.pluck(unique, 'vendingGroup');
  }

  getProducers = function(data) {
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

  getCountries = function(data) {
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
  
  /**
   * Modals for filtering
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

  $scope.openModal = function(index) {
    if(index == 1) $scope.oModal1.show();
    else $scope.oModal2.show();
  };
  $scope.closeModal = function(index) {
    if(index == 1) $scope.oModal1.hide();
    else $scope.oModal2.hide();
  };
  
  // Cleanup the modals when we're done with them (i.e: state change)
  // Angular will broadcast a $destroy event just before tearing down a scope 
  // and removing the scope from its parent.
  $scope.$on('$destroy', function() {
    $scope.oModal1.remove();
    $scope.oModal2.remove();
  });

  /**
   * Popover for sorting
   */
  
  $ionicPopover.fromTemplateUrl('templates/sort.html', function(popover) {
    $scope.popover = popover;
  });

  /**
   * Sort
   */
  
  $scope.applySort = function(property) {
    console.log("hej");
    $scope.sort = property;
  };
});