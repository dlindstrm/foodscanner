angular.module('foodscan.searchResultController', [])

.controller("SearchResultController", function($scope, $http, $stateParams, $ionicModal, $ionicPopover, Articles, SearchResult) {
	$scope.articles = SearchResult.get();
	$scope.limit = 10;
	$scope.key = $stateParams.key;

	this.loadMore = function() {
		$scope.limit = $scope.limit+10;
		$scope.loader = true;
    $http.get('http://fsserver.kspri.se/api/get?search='+$scope.key+"&limit="+$scope.limit)
    .success(function(data, status) {
      $scope.loader = false;
      data = data.slice($scope.limit-10, data.length);

      if(data.length < 10) {
        $scope.noResult = true;
      }
      SearchResult.append(data);
      $scope.articles = SearchResult.get();

    })
    .error(function(data, status) {
      $scope.loader = false;
    })
	}

	this.goto = function(gtin) {
	   Articles.goTo(gtin);
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

  /* Listen for broadcasted messages */  
  $scope.$on('modal.shown', function(event, modal) {
    console.log('Modal ' + modal.id + ' is shown!');
  });
  
  $scope.$on('modal.hidden', function(event, modal) {
    console.log('Modal ' + modal.id + ' is hidden!');
  });
  
  // Cleanup the modals when we're done with them (i.e: state change)
  // Angular will broadcast a $destroy event just before tearing down a scope 
  // and removing the scope from its parent.
  $scope.$on('$destroy', function() {
    console.log('Destroying modals...');
    $scope.oModal1.remove();
    $scope.oModal2.remove();
  });

  /**
   * Popover for filtering
   */
  
  $ionicPopover.fromTemplateUrl('templates/sort.html', function(popover) {
    $scope.popover = popover;
  });
});