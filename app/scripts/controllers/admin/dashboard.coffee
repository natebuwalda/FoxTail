'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'AdminDashboardCtrl', ($scope, $http, $location, Auth, fileUpload) ->
    console.log 'wat2'
    $http.get('/api/users/me').success (user) ->
    	$scope.user = user

    $scope.logout = ->
      console.log "What is this I don't even."
      Auth.logout().then ->
        $location.path "/admin/login"

    $scope.submitFile = ->
      console.log 'submitFile'
      file = $scope.dataFile;
      uploadUrl = '/api/acceptFile';
      fileUpload.uploadFileToUrl(file, uploadUrl);

    $scope.updateWebsite = ->
      $http.get('/api/updateWebsite').success (data) ->
        $scope.message = "Website update done. (#{data})"
      .error (error, status) ->
        $scope.message = "Website update failed: #{status} - #{error}"

    $http.get('/api/products/total').success (reply) ->
      $scope.numProducts = reply.numProducts