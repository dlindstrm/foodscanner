angular.module('foodscan.articleListController', [])

.controller("ArticleListController", function($scope, $http, $stateParams, $timeout, $ionicModal, $ionicPopover, $ionicScrollDelegate, Articles, ArticleList) {
  $scope.loader = false;
  $scope.sort = '';
  $scope.itemsPerPage = 20;

  setArticles = function() {
    $scope.currentPage = sessionStorage.getItem('currentpage') || 0;
    $scope.total = ArticleList.total();
    if($scope.currentPage > 1) {
      $scope.articles = ArticleList.getMany($scope.currentPage*$scope.itemsPerPage);
    }
    else {
      $scope.articles = ArticleList.get($scope.currentPage*$scope.itemsPerPage, $scope.itemsPerPage);
    }
    $scope.noResult = ($scope.articles.length < 1) ? true : false;
  }

  $scope.loadMore = function() {
    $scope.loader = true;
    $timeout(function() {
      $scope.currentPage++;
      sessionStorage.setItem('currentpage', $scope.currentPage);
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
      articles = _.sortBy(articles, function(obj){ return obj.dabas[$scope.sort.property]; });
    }

    if($scope.catFilter.length !== 0) {
      articles = _.filter(articles, function(obj){
        if(obj.productgroup) {
          if(obj.productgroup.vendingGroup) {
            return $scope.catFilter.indexOf(obj.productgroup.vendingGroup.article) !== -1; 
          }
        }
      });
    }

    if($scope.producerFilter.length !== 0) {
      articles = _.filter(articles, function(obj){ return $scope.producerFilter.indexOf(obj.dabas.producer) !== -1; });
    }

    if($scope.countryFilter.length !== 0) {
      articles = _.filter(articles, function(obj){ return $scope.countryFilter.indexOf(obj.dabas.country) !== -1; });
    }

    ArticleList.set(articles);
    setArticles();
  }

  $scope.applyCategories = function() {
    $scope.closeModal(1);

    sessionStorage.setItem('categories', JSON.stringify($scope.categories));

    var checked = _.filter($scope.categories, function(item) {
      return item.checked === true;
    });
    $scope.catFilter = [];
    for(var i = 0; i<checked.length; i++) {
      $scope.catFilter.push(checked[i].article);
    }
    sessionStorage.setItem('catFilter', JSON.stringify($scope.catFilter));
    filter();
  }

  $scope.applyFilters = function() {
    $scope.closeModal(2);

    sessionStorage.setItem('producers', JSON.stringify($scope.producers));
    sessionStorage.setItem('countries', JSON.stringify($scope.countries));

    /// Producer filter
    var checked = _.filter($scope.producers, function(item) {
      return item.checked === true;
    });
    $scope.producerFilter = [];
    for(var i = 0; i<checked.length; i++) {
      $scope.producerFilter.push(checked[i].name);
    }
    sessionStorage.setItem('producerFilter', JSON.stringify($scope.producerFilter));


    /// Country filter
    var checked = _.filter($scope.countries, function(item) {
      return item.checked === true;
    });
    $scope.countryFilter = [];
    for(var i = 0; i<checked.length; i++) {
      $scope.countryFilter.push(checked[i].name);
    }
    sessionStorage.setItem('countryFilter', JSON.stringify($scope.countryFilter));

    filter();
  }

  $scope.accordion = {
    producer: false,
    countries: false
  };
  $scope.toggleGroup = function(property) {
    if ($scope.isGroupShown(property)) {
      $scope.accordion[property] = false;
    } 
    else {
      $scope.accordion[property] = true;
    }
    $timeout(function() {
      $ionicScrollDelegate.resize();
    }, 150);
  };
  $scope.isGroupShown = function(property) {
    return $scope.accordion[property] === true;
  };

  /**
   * Get all filter options
   */
  getCategories = function() {
    var data = ArticleList.getOriginal();
    data = _.filter(data, function(obj) {
      return obj.dabas.productcode !== null;
    })
    data = _.filter(data, function(obj) {
      return obj.dabas.productcode.length > 1;
    })
    var unique = _.filter(data, function(obj) {
      return "vendingGroup" in obj.productgroup === true;
    });
    unique = _.uniq(unique, function(item, key, no) {
      return item.productgroup.vendingGroup.article;
    });
    unique = _.pluck(unique, 'productgroup');
    $scope.categories = _.pluck(unique, 'vendingGroup');
    sessionStorage.setItem('categories', JSON.stringify($scope.categories));
  }

  getProducers = function() {
    var data = ArticleList.getOriginal();
    var unique = _.uniq(data, function(item, key, producer) {
      return item.dabas.producer;
    });
    unique = _.filter(unique, function(obj) {
      return obj.dabas.producer !== null;
    });
    unique = _.pluck(unique, 'dabas');
    unique = _.pluck(unique, 'producer');
    $scope.producers = [];
    for(var i = 0; i<unique.length; i++) {
      $scope.producers.push({name: unique[i]});
    }
    sessionStorage.setItem('producers', JSON.stringify($scope.producers));
  }

  getCountries = function() {
    var data = ArticleList.getOriginal();
    var unique = _.uniq(data, function(item, key, country) {
      return item.dabas.country;
    });
    unique = _.filter(unique, function(obj) {
      return obj.dabas.country !== null;
    });
    unique = _.pluck(unique, 'dabas');
    unique = _.pluck(unique, 'country');
    $scope.countries = [];
    for(var i = 0; i<unique.length; i++) {
      if(unique[i] !== "")
        $scope.countries.push({name: unique[i]});
    }
    sessionStorage.setItem('countries', JSON.stringify($scope.countries));
  }

  init = function() {
    if(JSON.parse(sessionStorage.getItem("newList")) == true) {
      sessionStorage.setItem("newList", false);
      sessionStorage.removeItem('catFilter');
      sessionStorage.removeItem('producerFilter');
      sessionStorage.removeItem('countryFilter');
      sessionStorage.removeItem('currentpage')
      
      $scope.sort = {
        property: 'ng'
      };

      $scope.catFilter = [];
      $scope.producerFilter = [];
      $scope.countryFilter = [];
      ArticleList.set(ArticleList.getOriginal());
      setArticles();
      getCategories();
      getProducers();
      getCountries();
    }
    else {

      $scope.sort = {
        property: (sessionStorage.getItem("sortproperty") || 'ng')
      };

      $scope.categories = JSON.parse(sessionStorage.getItem("categories"));
      $scope.producers = JSON.parse(sessionStorage.getItem("producers"));
      $scope.countries = JSON.parse(sessionStorage.getItem("countries"));

      $scope.catFilter = JSON.parse(sessionStorage.getItem("catFilter")) || [];
      $scope.producerFilter = JSON.parse(sessionStorage.getItem("producerFilter")) || [];
      $scope.countryFilter = JSON.parse(sessionStorage.getItem("countryFilter")) || [];

      setArticles();
    }
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
  
  $scope.applySort = function(property) {
    $scope.closeModal(3);
    sessionStorage.setItem("sortproperty", $scope.sort.property);
    filter();
  };
});