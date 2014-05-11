'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'AdminDashboardCtrl', ($scope, $http, $location, Auth) ->
    console.log 'wat2'
    $http.get('/api/users/me').success (user) ->
    	$scope.user = user
    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings
    $scope.logout = ->
      console.log "What is this I don't even."
      Auth.logout().then ->
        $location.path "/admin/login"