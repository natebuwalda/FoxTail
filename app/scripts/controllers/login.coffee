'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'LoginCtrl', ['$scope', 'Auth', '$location', ($scope, Auth, $location) ->
    $scope.user = {}
    $scope.errors = {}

    $scope.login = (form) ->
      $scope.submitted = true
      console.log 'wut'
      if form.$valid
        Auth.login(
          email: $scope.user.email
          password: $scope.user.password
        )
        .then ->
          # Logged in, redirect to admin dashboard
          $location.path '/admin/dashboard'
        .catch (err) ->
          err = err.data;
          $scope.errors.other = err.message;
  ]