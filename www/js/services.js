angular.module('foodscan.services', [])

.factory('Articles', function($http) {
  
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
          labels: []
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

    httpGet: function(gtin, callback) {
      $http.get(url + '?gtin=' + gtin)
      .success(function(data, status) {
        articles.push(data);
        return callback(status, data);
      })
      .error(function(status, data) {
        return callback(status);
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
});