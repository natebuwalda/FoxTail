'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'FaqCtrl', ['$scope', '$http', ($scope, $http) ->
    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings
  ]