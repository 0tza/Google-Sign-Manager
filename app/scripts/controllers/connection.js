'use strict';

 angular.module('marocCloudSignApp')
 .controller('ConnectionCtrl', function ($scope,$rootScope,$gapi) {

 	var getProfile = function() {
 		gapi.client.request({
 			'path': '/plus/v1/people/me',
 			'params': {'query':'me'}
 		}).then(
 		function(response) {
 			console.log('Profile :',response);
 			$scope.name = response.result.displayName;
 			$scope.picture = response.result.image.url;   
 			$scope.mail = response.result.emails[0].value;

 			$scope.domain = response.result.domain;

 			console.log($scope.domain);

 			$rootScope.domain = response.result.domain;

 			$scope.$apply();     
 		},
 		function(error){
 			console.log('Error while fetching ressource');
 		});
 	};	

 	$scope.saveOA = function() {
 		$rootScope.oAcode = $scope.code ;
 		console.log($rootScope.oAcode);
 	};

 	$scope.signOut = function($gapi) {
 		console.log('Dehors');
 		gapi.auth.signOut();
 	};

 	$scope.$on('$viewContentLoaded', function() {
 		getProfile();
 	});

 });