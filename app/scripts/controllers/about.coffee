'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'AboutCtrl', ['$scope', '$http', ($scope, $http) ->
    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings
   ]