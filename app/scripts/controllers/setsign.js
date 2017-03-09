'use strict';

angular.module('marocCloudSignApp')
.controller('SetSignCtrl', function ($scope,$rootScope,$gapi,$http) {

	var urlServer= 'http://localhost:8888/marocsign/google-api-php-client-master/examples/';
	$scope.usersToChange = [];

	$scope.$on('$viewContentLoaded', function() {
	init();
});

	var init = function () {
	$scope.modeles = JSON.parse(sessionStorage.getItem("modeles")) || [];
	}

	//Récupère le domaine
	var getProfile = function() {
		gapi.client.request({
			'path': '/plus/v1/people/me',
			'params': {'query':'me'}
		}).then(
		function(response) {
			$scope.domain = response.result.domain;

		},
		function(error){
			console.log('Error while fetching ressource');
		});
	};

	//Récupère les utilisateurs ayant une fonction précise
	$scope.triUsers = function (fonction) {
		if (fonction ) {
			getUsers(fonction);
		} else {
			getUsers();
		}
	}

	//Récupère les utilisateurs (En choisissant la direction et la fonction)
	var getUsers = function(fonctionEntreprise) {
		var query ='';
		if (fonctionEntreprise) {
		query = 'orgTitle:'+fonctionEntreprise ;//Cette requête peut être extensible afin de 
		console.log(query);
	};

	gapi.client.request({
		'path': '/admin/directory/v1/users',
		'params': {'domain':$rootScope.domain,
		'maxResults':'500',
		'query':query
	}
}).then(
function(response) {
	console.log('Liste users : ',response);
	$scope.clients = response.result.users;
	$scope.$apply();

},
function(error){
	console.log('Couldnt get the users',error);
});
};

	//Récupère les signatures
	var getSigns = function () {//DEPRECATED
		$http.get('http://127.0.0.1:8080/MCC/Signatures').
		success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    console.log(data);
    $scope.docs = data._embedded['rh:doc'];
    //$scope.$apply();

}).error (function(data, status, headers, config) {
	console.log('Problem while fetching database', status);
});
	//$scope.$apply();
};

//Cette fonction permet de 
$scope.refresh = function(doc) {
	$scope.titreSignature = doc.titre; // Signature récupérée à partir du clic
	$scope.tinymceModel = doc.texte;  // Texte de la signature récupéré à partir du clic
	//var idSign = doc._id.$oid;
	//var idEtag = doc._etag.$oid;

	$('#signAlert').show();
};

// Fonction qui permet de remplacer le texte d'une signature avec les informations d'un seul utilisateur
var replaceInfos = function(template,user) {
	var texte = template.replace('[nom]',user.name.givenName);
	texte = texte.replace('[prenom]',user.name.familyName);
	texte = texte.replace('[telephone]',user.phones[0].value);
	texte = texte.replace('[mail]',user.primaryEmail);
	texte = texte.replace('[fonction]',user.organizations[0].title);


	return texte;
};

$scope.transform = function() {
	console.log('Transform !');
	console.log($scope.choices);
};

$gapi.authed.then( function($scope) {
	console.log('Authentified on setsign.html!');
	getUsers();
	getSigns();
	//console.log('ROOT SCOPE IS ' + $rootScope.domain);
});

//BOUCLE DE MAJ
$scope.sendSigns = function() { //DEPRECATED USE SENDSIGN2
	var length = $scope.usersToChange.length;
	console.log(length);
	if ( $scope.usersToChange ) {

		$scope.compteRendu = '';

		for( var i=0;i<length;i++) {
			//console.log($scope.usersToChange[i]);
			var sign = replaceInfos($scope.tinymceModel,$scope.usersToChange[i]);
			console.log(sign); //TEST

			var couple = new Object();
			couple.mail = $scope.usersToChange[i].primaryEmail.split('@')[0];
			couple.signature = sign;

			var jsonCouple = JSON.stringify(couple);

			// Simple POST request example (passing data) :
			$http.get('http://localhost:8888/marocsign/google-api-php-client-master/examples/signature.php?data='+jsonCouple).
			then(function(response) {
				$scope.compteRendu = $scope.compteRendu + response.data + " \ ";

				console.log($scope.compteRendu);
		    //console.log(response.data);
		}, function(response) {
			console.log('Server FAIL');
		});

		}
	} else {
		$scope.msgError = 'Veuillez selectionner une signature et au moins un utilisateur ! ';
		$('#errorAlert').show();
	}

};

$scope.sendSigns2 = function() {
	var length = $scope.usersToChange.length;
	if ($scope.usersToChange && $rootScope.oAcode ) {

		$scope.compteRendu = '';

		for( var i=0;i<length;i++) {
			//console.log($scope.usersToChange[i]);
			var sign = replaceInfos($scope.tinymceModel,$scope.usersToChange[i]);
			console.log(sign); //TEST

			var couple = new Object();
			couple.mail = $scope.usersToChange[i].primaryEmail.split('@')[0];
			couple.signature = sign;

			var jsonCouple = JSON.stringify(couple);

			var req = urlServer+ $rootScope.oAcode + '.php?data='+jsonCouple;
			console.log('La requête cest : ' + req);
			// Simple POST request example (passing data) :
			$http.get(req).
			then(function(response) {
				$scope.compteRendu = $scope.compteRendu + response.data + " \ ";

			//console.log($scope.compteRendu);
		    //console.log(response.data);
		}, function(response) {
			console.log('Server FAIL');
		});

		}
	} else {
		$scope.msgError = "Veuillez selectionner une signature et au moins un utilisateur ! N'oubliez pas le code aussi !";
		$('#errorAlert').show();
	}
};

$gapi.loaded.then(function(){
	$gapi.load('admin','v1').then(function(){
      //console.log('GAPI LOADED');
  },function(data) {
  	console.log(data);
  });
});

$scope.checkAll = function() {
	$scope.usersToChange = angular.copy($scope.clients);
};
$scope.uncheckAll = function() {
	$scope.usersToChange = [];
	//getUsers($scope.varTri);//Artifice

};

});