'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'AdminDashboardCtrl', ($scope, $http, $location, Auth, fileUpload, adminBidiSocket) ->
    $scope.processing = null
    $scope.updating = null
    $scope.rebuilding = null
    $scope.restarting = null
    $scope.console = ''
    
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
      fileUpload.uploadFileToUrl(file, uploadUrl, (err, msg) ->
        $scope.message = ''
        $scope.processing = null
        $scope.message = 'ERROR: ' if err?
        $scope.message = msg
      );

    $scope.updateWebsite = ->
      $scope.updating = true
      $http.get('/api/updateWebsite').success (data) ->
        $scope.message = "Website update done. (#{data})"
        $scope.updating = null
      .error (error, status) ->
        $scope.message = "Website update failed: #{status} - #{error}"
        $scope.updating = null

    $scope.buildWebsite = ->
      $scope.rebuilding = true
      $http.get('/api/buildWebsite').success (data) ->
        $scope.message = "Website build done. (#{data})"
        $scope.rebuilding = null
      .error (error, status) ->
        $scope.message = "Website build failed: #{status} - #{error}"
        $scope.rebuilding = null

    $scope.stopWebsite = ->
      $scope.restarting = true
      $http.get('/api/stopWebsite').success (data) ->
        $scope.message = "Website stopping... (#{data})"
        $scope.restarting = null
      .error (error, status) ->
        $scope.message = "Website stop failed: #{status} - #{error}"
        $scope.restarting = null

    adminBidiSocket.on 'console', (data, cb) ->
      console.log "adminBidiSocket: #{data}"
      $scope.console += data if typeof data != 'undefined';
      cb() if typeof cb == "function"

    # $scope.$on 'socket:console', (ev, data) ->
    #   console.log "socket:console / #{ev} / #{data}"
    #   $scope.console += data;

    $http.get('/api/products/total').success (reply) ->
      $scope.numProducts = reply.numProducts