'use strict'

angular.module('foxtailArtisanrycomApp')
  .factory 'Session', ($resource) ->
    $resource '/api/session/'
