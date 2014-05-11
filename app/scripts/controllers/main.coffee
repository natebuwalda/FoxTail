'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'MainCtrl', ($scope, $http, $timeout) ->
    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings
     
    $timeout(->
      console.log 'unf'
      $('.flexslider').flexslider({
        animation: "slide",
        prevText: "Prev",
        nextText: "Next",
        controlsContainer: ".flexslider-controls"
      });

      console.log $('.flexslider')
    );