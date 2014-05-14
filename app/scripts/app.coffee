'use strict'

angular.module('foxtailArtisanrycomApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .filter 'partition', ->
    cache = {};
    filter = (arr, size) ->
      if !arr 
        return;
      newArr = [];
      for index in [0..arr.length] by size
        newArr.push(arr.slice(index, index+size))

      arrString = JSON.stringify(arr);
      fromCache = cache[arrString+size];
      if (JSON.stringify(fromCache) == JSON.stringify(newArr))
        return fromCache;

      cache[arrString+size] = newArr;
      return newArr;

    return filter;
  .directive 'includeReplace', ->
    return {
        require: 'ngInclude',
        #restrict: 'A', /* optional */
        link: (scope, el, attrs) ->
          el.replaceWith(el.children());
    };
  .directive 'fileModel', ($parse) ->
    return {
        restrict: 'A',
        link: (scope, element, attrs) ->
            model = $parse(attrs.fileModel);
            modelSetter = model.assign;
            
            element.bind 'change', ->
                scope.$apply ->
                    modelSetter(scope, element[0].files[0]);
    };
  .factory('fileUpload', ['$http', ($http) ->
    new class FileUpload
      constructor: ->
        console.log "constructed FileUpload"

      uploadFileToUrl: (file, uploadUrl) ->
          fd = new FormData();
          fd.append('file', file);
          $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
          })
          .success ->
            console.log 'file uploaded.'
          .error ->
            console.log 'boo'
          return
  ])
  .config ($routeProvider, $locationProvider, $httpProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'partials/main'
        controller: 'MainCtrl'
      .when '/admin/login',
        templateUrl: 'partials/login'
        controller: 'LoginCtrl'
      .when '/admin/dashboard',
        templateUrl: 'partials/dashboard'
        controller: 'MainCtrl'
      # .when '/signup', 
      #   templateUrl: 'partials/signup'
      #   controller: 'SignupCtrl'
      .when '/settings',
        templateUrl: 'partials/settings'
        controller: 'SettingsCtrl'
        authenticate: true
      .when '/gallery',
        templateUrl: 'partials/gallery'
        controller: 'GalleryCtrl'
      .when '/admin/dashboard',
        templateUrl: 'partials/admin/dashboard'
        controller: 'AdminDashboardCtrl'
        authenticate: true
      .when '/product/:id',
        templateUrl: 'partials/product'
        controller: 'ProductCtrl'
      .when '/faq',
        templateUrl: 'partials/faq'
        controller: 'FaqCtrl'
      .when '/about',
        templateUrl: 'partials/about'
        controller: 'AboutCtrl'
      .otherwise
        redirectTo: '/'

    $locationProvider.html5Mode true
  
    # Intercept 401s and redirect you to login
    $httpProvider.interceptors.push ['$q', '$location', ($q, $location) ->
      responseError: (response) ->
        if response.status is 401
          $location.path '/admin/login'
          $q.reject response
        else
          $q.reject response
    ]
  .run ($rootScope, $location, Auth) ->
    
    # Redirect to login if route requires auth and you're not logged in
    $rootScope.$on '$routeChangeStart', (event, next) ->
      $location.path '/admin/login'  if next.authenticate and not Auth.isLoggedIn()
