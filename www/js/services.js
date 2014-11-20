angular.module('foodscan.services', [])

.factory('Articles', function($http, $location, $ionicLoading, _) {
  
  var url = "http://fsserver.kspri.se/api/get";
  var articles = [
    {
      dabas: {
          GTIN: "07310867002394",
          name: "A-fil",
          producer: "SKÅNEMEJERIER",
          country: "Sverige",
          weight: 1050,
          productcode: "300310204598",
          images: [
              {
                  Filformat: "jpg",
                  Filnamn: "7310867002394_v",
                  Informationstyp: "PRODUCT_IMAGE",
                  Innehallsbeskrivning: "",
                  Lank: "http://www.dabas.com/media/skanemejerier-storhushall/7310867002394_v.jpg"
              }
          ],
          ingredients:[{"name":"Kebabkött"},{"name":"Goudaost"},{"name":"Vetemjöl","carbon":22}],
          labels:[{"Typ":"Nyckelhålet","Typkod":"NYCKELHAL_MARK"}]
      },
      productgroup: {
          vendingArea: {
              article: "Färskvaror/Kylvaror",
              no: 3
          },
          majorGroup: {
              article: "Mejerivaror",
              no: 3,
              parent: 3
          },
          vendingGroup: {
              article: "Filprodukter",
              no: 1020,
              parent: 3
          },
          vendingUnderGroup: {
              article: "Filmjölk 3 %",
              no: 4598,
              parent: 1020
          }
      },
      lcafd: {
          id: 239,
          name: "A-fil",
          gramPerPiece: 250,
          gramPerDeciliter: 103,
          carbon: {
              average: 0,
              max: 0,
              min: 0
          },
          energy: {
              average: 0,
              max: 0,
              min: 0
          },
          category: 8
      },
      carbon: 200
  }
  ];
  
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
        articles.push(data);
        if(status !== 200) {
          $ionicLoading.hide()
          return alert("Ingen artikel hittades.")
        }
        $location.path("/app/article/"+gtin)
      })
      .error(function(status, data) {
        $ionicLoading.hide();
        return alert("Ingen artikel hittades.")
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

.factory('SearchResult', function() {

   getPropByString = function (obj, propString) {
      if (!propString)
          return obj;

      var prop, props = propString.split('.');

      for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
          prop = props[i];

          var candidate = obj[prop];
          if (candidate !== undefined) {
              obj = candidate;
          } else {
              break;
          }
      }
      return obj[props[i]];
  };

  var original = [];
  var result = [];
  return {

    setOriginal: function(articles) {
      original = articles;
    },

    getOriginal: function() {
      return original;
    },

    filter: function(property, filters) {
      result = _.filter(original, function(obj){ return filters.indexOf(getPropByString(obj, property)) !== -1; });
    },

    set: function(articles) {
      result = articles;
    },

    get: function(offset, limit) {
      return result.slice(offset, offset+limit);
    },

    total: function() {
      return result.length;
    },

    reset: function() {
      result = original;
    }

  }
});