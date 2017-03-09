'use strict';

/**
 * @ngdoc function
 * @name marocCloudSignApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the marocCloudSignApp
 * This controller should only change the button from connected to 
 */
 angular.module('marocCloudSignApp')
 .controller('MainCtrl', function ($scope,$gapi,$location) {
 	
 	$gapi.authed.then( function($scope,$location) {
 		console.log('Authentified on index.html!'); 
 		window.location = "#/connected";
 	});
 	
 });