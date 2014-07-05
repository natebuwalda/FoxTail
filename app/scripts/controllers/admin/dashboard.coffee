'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'AdminDashboardCtrl', ($scope, $http, $location, Auth, fileUpload, adminBidiSocket) ->
    $scope.processing = false
    $scope.updating = false
    $scope.rebuilding = false
    $scope.restarting = false
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
        $scope.processing = true
        $scope.message = 'ERROR: ' if err?
        $scope.message = msg
      );

    $scope.updateWebsite = ->
      $scope.updating = true
      $http.get('/api/updateWebsite').success (data) ->
        $scope.message = "Website update command submitted. (#{data})"
      .error (error, status) ->
        $scope.message = "Website update failed: #{status} - #{error}"
        $scope.updating = false

    $scope.buildWebsite = ->
      $scope.rebuilding = true
      $http.get('/api/buildWebsite').success (data) ->
        $scope.message = "Website build command submitted. (#{data})"
      .error (error, status) ->
        $scope.message = "Website build failed: #{status} - #{error}"
        $scope.rebuilding = false

    $scope.stopWebsite = ->
      $scope.restarting = true
      $http.get('/api/stopWebsite').success (data) ->
        $scope.message = "Website stopping... (#{data})"
        .error (error, status) ->
        $scope.message = "Website stop failed: #{status} - #{error}"
        $scope.restarting = false

    adminBidiSocket.on 'console', (data, cb) ->
      console.log "adminBidiSocket: #{data}"
      $scope.console += data if typeof data != 'undefined';
      $('#console').scrollTop($('#console')[0].scrollHeight);
      cb() if typeof cb == "function"

    adminBidiSocket.on 'status', (data, cb) ->
      console.log "adminBidiSocket/status: #{data}"
      console.dir(data)
      $scope.$apply ->
        $scope[data.mech] = data.set
        direction = if data.set == true then "started" else "finished"
        $scope.message = "Website #{data.mech} #{direction}."
      cb() if typeof cb == "function"      

    # $scope.$on 'socket:console', (ev, data) ->
    #   console.log "socket:console / #{ev} / #{data}"
    #   $scope.console += data;

    $http.get('/api/products/total').success (reply) ->
      $scope.numProducts = reply.numProductss