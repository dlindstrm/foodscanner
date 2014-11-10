angular.module('foodscan.services', [])

.factory('Articles', function($http, $location, $ionicLoading) {
  
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
      console.log(gtin);
      $ionicLoading.show();
      gtin = gtin.toString();
      while(gtin.length < 14) {
        gtin = "0" + gtin;
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
      for(var i = 0; i < articles.length; i++) {
        var a = articles[i];
        if(a.dabas.GTIN === gtin) {
          return callback(null, a);
        }
      }
      return callback("error", null);
    }
  }
})

.factory('Labels', function() {
  var labels = {
    
  }

});