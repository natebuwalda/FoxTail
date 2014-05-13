'use strict'

angular.module('foxtailArtisanrycomApp')
  .controller 'ProductCtrl', ($scope, $http, $routeParams, $timeout) ->
    $scope.id = $routeParams.id

    $http.get("/api/product/#{$scope.id}  ").success (info) ->
      $scope.product = info

      $scope.slides = []
      $scope.slides.push(info['IMG-01']) if info['IMG-01']
      $scope.slides.push(info['IMG-02']) if info['IMG-02']
      $scope.slides.push(info['IMG-03']) if info['IMG-03']
      $scope.slides.push(info['IMG-04']) if info['IMG-04']
      $scope.slides.push(info['IMG-05']) if info['IMG-05']
      $scope.slides.push(info['IMG-06']) if info['IMG-06']
      $scope.slides.push(info['IMG-07']) if info['IMG-07']
      $scope.slides.push(info['IMG-08']) if info['IMG-08']
      $scope.slides.push(info['IMG-09']) if info['IMG-09']
      $scope.slides.push(info['IMG-10']) if info['IMG-10']

      $timeout(->
        console.log 'unf'
        $('.flexslider').flexslider({
          prevText: "Prev",
          nextText: "Next",
          controlNav: "thumbnails"
        });

        console.log $('.flexslider')
      );