'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'ContactCtrl', ($scope, $http, $timeout, vcRecaptchaService) ->
    $scope.model = '6LcAau8SAAAAAHbp1JcrJ243f4U5kDAzGRuDpXYP'
    $scope.sendMessage = ->
      console.dir vcRecaptchaService.data()
      # $http.get('/api/contact', {challenge: Recaptcha.get_challenge(), response: Recaptcha.get_response()}).success (wat) ->
      #   console.log('wat')

    