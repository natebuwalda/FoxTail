'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'ProductCtrl', ($scope, $http) ->
    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings