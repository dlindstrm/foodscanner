angular.module('foodscan.navigationController', [])

.controller("NavigationController", function($scope, $location, $ionicPopover, $ionicNavBarDelegate, $timeout, $ionicViewService) { 

  /**
   * Popover for the navigation
   */
  $scope.isOpened = false;
  $ionicPopover.fromTemplateUrl('navigation.html', { scope: $scope }).then(function(popover) {
    $scope.navigation = popover;
  });

  this.toggleNav = function($event) {
    if($scope.isOpened == false) {
      this.openNavigation($event);
    }
    else if($scope.isOpened == true) {
      this.closeNavigation();
    }
  }
  this.openNavigation = function($event) {
    $scope.isOpened = true;
    angular.element(document.querySelector('ion-view > ion-content')).addClass("blur");
    angular.element(document.querySelector('ion-view > .bar-subheader')).addClass("blur");
    $scope.navigation.show($event);
    angular.element(document.querySelector('ion-pane')).append(document.querySelector('.navigation').parentNode.parentNode);
  };
  this.closeNavigation = function() {
    $scope.navigation.hide();
  };
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    if(document.querySelector('.navigation')) {
      $scope.isOpened = false;
      angular.element(document.querySelector('.navigation').parentNode.parentNode).addClass("hiding")
      angular.element(document.querySelector('ion-view > ion-content')).removeClass("blur");
      angular.element(document.querySelector('ion-view > .bar-subheader')).removeClass("blur");
      $timeout(function() {
        angular.element(document.querySelector('.navigation').parentNode.parentNode).removeClass("hiding");
      }, 400);
    };
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    $scope.isOpened = false;
    angular.element(document.querySelector('ion-view > ion-content')).removeClass("blur");
    angular.element(document.querySelector('ion-view > .bar-subheader')).removeClass("blur");
  });
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.navigation.remove();
  });

  /** 
   * Main function for navigation
   */
  this.navigateTo = function(path) {
    /**
     * Clearing some localStorage
     */
    window.localStorage.removeItem('recent');
    window.localStorage.removeItem('recent_articles');
    window.localStorage.removeItem('articles');
    window.localStorage.removeItem('original');
    
    this.closeNavigation();
    if($location.path() !== path) {
      angular.element(document.querySelector('body')).addClass('no-nav-animation');
      $timeout(function() {
        angular.element(document.querySelector('body')).removeClass('no-nav-animation');
      }, 400);
      $location.path(path);
    }
  } 

  this.goBack = function() {
    this.closeNavigation();
    angular.element(document.querySelector('body')).addClass('no-nav-animation');
    $timeout(function() {
      angular.element(document.querySelector('body')).removeClass('no-nav-animation');
    }, 400)
    $ionicNavBarDelegate.back();
    if($location.path() == "/app/start") {
        $ionicViewService.clearHistory();
    } 
  }
})