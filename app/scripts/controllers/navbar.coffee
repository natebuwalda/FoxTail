'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'NavbarCtrl', ['$scope', '$location', 'Auth', ($scope, $location, Auth) ->
    $scope.menu = [
      title: 'Home'
      link: '/'
    , 
      title: 'Settings'
      link: '/settings'
    ]
    
    $scope.logout = ->
      Auth.logout().then ->
        $location.path "/login"
    
    $scope.isActive = (route) ->
      route is $location.path()
  ]