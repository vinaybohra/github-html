(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com/menu_items.json');

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'templates/found-items.html',
    restrict: "E",
    scope: {
      foundItems: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.found = [];
  menu.searchTerm = '';

  menu.getItems = function() {
    if (!(menu.searchTerm)) {
      menu.found = null;
      return;
    }
    menu.found = [];
    var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    promise.then(function (response) {
      menu.found = response;
    })
    .catch(function (error) {
      console.log("Something went wrong.");
    });
  };

  menu.removeItem = function (index) {
    menu.found.splice(index, 1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: ApiBasePath
    }).then(function (result) {
      if (searchTerm == false)
        return [];

      var foundItems = [];
      var list = result.data.menu_items;

      for (var i = 0; i < list.length; i++) {
        var description = list[i].description;
        if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
          foundItems.push(list[i]);
        }
      }
      return foundItems;
    });
  };
}

})();
