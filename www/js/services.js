angular.module('foodscan.services', [])

.factory('Articles', function($http, $location, $ionicLoading, $ionicPopup, _) {
  
  var url = "http://fsserver.kspri.se/api/get/article";
  var articles = JSON.parse(window.localStorage.getItem('articles')) || [];
  var labels = [{"Typkod": "KRAV_MARK", "desc": "KRAV-märket visar att en vara är producerad på ekologisk grund med extra höga krav på djuromsorg, hälsa, socialt ansvar och klimatpåverkan."},
       {"Typkod": "EU_ORGANIC_FARMING", "desc": "Put simply, organic farming is an agricultural system that seeks to provide you, the consumer, with fresh, tasty and authentic food while respecting natural life-cycle systems."},
       {"Typkod": "RAINFOREST_ALLIANCE", "desc": "hejehj"},
       {"Typkod": "EU_ECO_LABEL", "desc": "sfdsf"},
       {"Typkod": "SWEDISH_SEAL_OF_QUALITY", "desc": "Svenskt Sigill är ett märke som hjälper handlare och konsumenter att kunna välja produkter som producerats med större hänsyn till djur och natur. En bättre produktionskvalitet helt enkelt."}];
  
  related = function(cat1, cat2, cat3, callback) {
    var url = 'http://fsserver.kspri.se/api/get/article?limit=5&cat1=';
    if(cat1 == undefined) {
      return callback([]);
    }
    else if(cat2 == undefined) {
      $http.get(url+cat1.no)
        .success(function(data, status) {
          return callback(data);
        });
    }
    else if(cat3 == undefined) {
      $http.get(url+cat1.no+'&cat2='+cat2.no)
        .success(function(data, status) {
          return callback(data);
        });
    }
    else {
      $http.get(url+cat1.no+'&cat2='+cat2.no+'&cat3='+cat3.no)
        .success(function(data, status) {
          return callback(data);
      });
    }
  } 
  
  return {

    goTo: function(gtin) {
      $ionicLoading.show();
      gtin = gtin.toString();
      while(gtin.length < 14) {
        gtin = "0" + gtin;
      }

      var exists = _.find(articles, function(obj) {
        return obj.dabas.GTIN === gtin;
      })
      if(exists) {
        $ionicLoading.hide();
        return $location.path("/app/article/"+gtin)
      }
     
      $http.get(url + '?gtin=' + gtin)
      .success(function(data, status) {
        if(status !== 200) {
          $ionicLoading.hide()
           $scope.showAlert = function() {
             $ionicPopup.alert({
               title: 'Ingen artikel hittades',
               template: 'Artikeln du skannade hittades inte.'
             });
           };
        }

        // LABELS
        var newLabels = [];
        for(var i=0;i<labels.length;i++) {
          var exist = _.find(data.dabas.labels, function(obj) {
            return obj.Typkod === labels[i].Typkod;
          })
          if(exist) {
            exist["desc"] = labels[i].desc;
            newLabels.push(exist);
          }   
        }
        data.dabas.labels = newLabels;

        // RELATED ARTICLES
        if(data.productgroup) {
          related(data.productgroup.vendingArea, data.productgroup.majorGroup, data.productgroup.vendingGroup, function(related) {
            data["related"] = related;
            articles.push(data);
            window.localStorage.setItem('articles', JSON.stringify(articles));
            $location.path("/app/article/"+gtin);
          });
        }
        else {
          articles.push(data);
          window.localStorage.setItem('articles', JSON.stringify(articles));
          $location.path("/app/article/"+gtin);
        }

      })
      .error(function(status, data) {
        $ionicLoading.hide();
         $ionicPopup.alert({
           title: 'Serverfel',
           template: 'Ingen uppkoppling mot servern.'
         });
      });
    },

    getArticle: function(gtin, callback) {
      var article = _.find(articles, function(obj) {
        return obj.dabas.GTIN === gtin;
      })
      if(!article)
        return callback("error", null);

      return callback(null, article);
    }
  }
})

.factory('Labels', function() {
  var labels = {
    
  }

})

.factory('ArticleList', function($http, $location, $ionicLoading, $ionicNavBarDelegate, _) {

  var original = JSON.parse(window.localStorage.getItem('original')) || [];
  var result = [];
  var listUrl = '';

  return {

    setOriginal: function(articles) {
      original = articles;
    },

    getOriginal: function() {
      return original;
    },

    set: function(articles) {
      result = articles;
    },

    get: function(offset, limit) {
      return result.slice(offset, offset+limit);
    },

    getMany: function(amount) {
      return result.slice(0, amount);
    },
    
    total: function() {
      return result.length;
    },

    reset: function() {
      result = original;
    },

    goTo: function(url) {
      $ionicLoading.show();
      sessionStorage.setItem("newList", true);
      $http.get(url)
      .success(function(data, status) {
        listUrl = url;  
        original = data;
        window.localStorage.setItem('original', JSON.stringify(original));
        $location.path("/app/articlelist");
        $ionicLoading.hide();
      })
      .error(function(data, status) {
        $ionicLoading.hide();
        $ionicNavBarDelegate.back();
      })
    }
  }
})

.factory('Favorite', function() {

  return {
    toggleFavorite: function(id, title, producer, country, img) {
      if(localStorage["favorites"] == null) {
        var favorites = [];
        favorites.push({id: id, title: title, producer: producer, country: country, img: img});
        localStorage["favorites"] = JSON.stringify(favorites);
        return true;
      }
      else {
        var storedFavs = JSON.parse(localStorage["favorites"]);
        var article = _.find(storedFavs, function(obj) {return obj.id == id})
        if(article) {
          storedFavs = _.reject(storedFavs, function(obj) {return obj.id == id})
          localStorage["favorites"] = JSON.stringify(storedFavs);
          return false;
        }
        else {
          var storedFavs = JSON.parse(localStorage["favorites"]);
          storedFavs.push({id: id, title: title, producer: producer, country: country, img: img});
          localStorage["favorites"] = JSON.stringify(storedFavs);
          return true;
        }
      }
    },
    isFavorite: function(id) {
       if(localStorage["favorites"] == null) {
        return false;
      }
      else {
        var storedFavs = JSON.parse(localStorage["favorites"]);
        var article = _.find(storedFavs, function(obj) {return obj.id == id})
        if(article) {
          return true;
        }
        else {
          return false;
        }
      }
    }  
  }
})

.factory('ExternalLink', function() {
  return {
    goTo: function(link) {
      window.open(link, '_system', 'location=yes');
    }
  }
});