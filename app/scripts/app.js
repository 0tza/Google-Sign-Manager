'use strict';

/**
 * @ngdoc overview
 * @name marocCloudSignApp
 * @description
 * # marocCloudSignApp
 *
 * Main module of the application.
 */
 angular
 .module('marocCloudSignApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'eydis.gapi',
  'eydis.gapi.signin',
  'ui.tinymce',
  'checklist-model'
  ])
 .config(function ($routeProvider,$locationProvider,$gapiProvider,$httpProvider) {

  //APIKEY from marocCloud account ( web browser )
  $gapiProvider.client_id = '814682608739-edhq00llsvrb22pnhog4d3kqkk312614.apps.googleusercontent.com';

  // SCOPES
  $gapiProvider.scopes = [
  'email',
  'profile',
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://apps-apis.google.com/a/feeds/domain/',
  'https://apps-apis.google.com/a/feeds/emailsettings/2.0/'
  ];


  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/about', {
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl'
  })
  .when('/connected' , {
    templateUrl: 'views/connected.html',
    controller: 'ConnectionCtrl'
  })
  .when('/contact', {
    templateUrl: 'views/contact.html'
  })
  .when('/addsign', {
    templateUrl: 'views/addsign.html',
    controller : 'AddSignCtrl'
  })
  .when('/setsign', {
    templateUrl: 'views/setsign.html',
    controller: 'SetSignCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});
