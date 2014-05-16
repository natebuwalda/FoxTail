'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'ContactCtrl', ['$scope', '$http', '$timeout', 'vcRecaptchaService', '$location', ($scope, $http, $timeout, vcRecaptchaService, $location) ->
    $scope.reCAPTCHA = {key: '6LcAau8SAAAAAHbp1JcrJ2434U5kDAzGRuDpXYPf'}
    
    $scope.sendMessage = ->

      # assemble post object
      data = vcRecaptchaService.data()
      data.name = $scope.name
      data.email = $scope.email
      data.message = $scope.message

      if typeof data.name == 'undefined' or typeof data.email == 'undefined' or typeof data.message == 'undefined'
         return $scope.errormsg = 'Please fill in all fields.'

      # ... and post it.
      $http.post('/api/contact', data).success (wat) ->
        $location.url('/contact-ok')
      .error (wat) ->
        $scope.errormsg = wat
  ]