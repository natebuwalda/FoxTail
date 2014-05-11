'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'GalleryCtrl', ($scope, $http) ->
    $http.get('/api/products').success (products) ->
      $scope.products = products

    $(->
      $("th, td").iWouldLikeToAbsolutelyPositionThingsInsideOfFrickingTableCellsPlease();
    );

