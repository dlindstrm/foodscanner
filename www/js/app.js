// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('foodscan', ['ionic', 'ngCordova', 'underscore', 'ui.unique', 'ui.bootstrap.collapse', 'foodscan.navigationController', 'foodscan.scanController', 'foodscan.startController', 'foodscan.articleController', 'foodscan.searchController', 'foodscan.browseController', 'foodscan.favoriteController', 'foodscan.articleListController', 'foodscan.services'])

.run(function($ionicPlatform, $cordovaStatusbar) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.style(2);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html"
    })

    .state('app.start', {
      url: "/start",
      views: {
        'menuContent' :{
          templateUrl: "templates/start.html"
        }
      }
    })

    .state('app.article', {
      url: "/article/:gtin",
      views: {
        'menuContent' :{
          templateUrl: "templates/article.html"
        }
      }
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.articleslist', {
      url: "/articlelist",
      views: {
        'menuContent' :{
          templateUrl: "templates/articleList.html"
        }
      }
    })

    .state('app.favorites', {
      url: "/favorites",
      views: {
        'menuContent' :{
          templateUrl: "templates/favorites.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/start');
})

.constant('$ionicLoadingConfig', {
  template: 'Laddar<span class="dots"><span class="dot1"> .</span><span class="dot2"> .</span><span class="dot3"> .</span></span>',
  noBackdrop: false 
});


