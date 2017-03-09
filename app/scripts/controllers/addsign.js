'use strict';

angular.module('marocCloudSignApp')
.controller('AddSignCtrl', function ($scope,$rootScope,$gapi,$http) {

	Array.prototype.removeValue = function(name, value){
		var array = $.map(this, function(v,i){
			return v[name] === value ? null : v;
		});
   this.length = 0; //clear original array
   this.push.apply(this, array); //push all elements except the one we want to delete
}

var init = function () {
  	$scope.modeles = JSON.parse(sessionStorage.getItem("modeles")) || [];
  	var url = "http://localhost:8888/db.php?data="+ sessionStorage.getItem("modeles");

}

$scope.addModele = function() {
	if ($scope.titreSignature) {
		var temp = $scope.modeles;
		temp.push({
			titre:$scope.titreSignature,
			texte:$scope.tinymceModel
		});
		$scope.modeles = temp;

		console.log($scope.modeles);

		sessionStorage.setItem("modeles",JSON.stringify($scope.modeles));
		console.log($scope.modeles);

		$scope.titreSignature = '';
		$scope.tinymceModel = '';

		//ar url = "http://localhost:8888/db.php?data=" + JSON.stringify($scope.modeles);

	} else {
		$scope.msgError = 'Veuillez choisir un titre pour votre signature !';
		$('#errorAlert').show();
	};
}

$scope.deleteModele = function() {
	if ($scope.select) {


		var temp = $scope.modeles;
		temp.removeValue('titre',$scope.titreSignature);
		$scope.modeles = temp;

		sessionStorage.setItem("modeles",JSON.stringify($scope.modeles));

		$scope.titreSignature = '';
		$scope.tinymceModel = '';
	}
}


$scope.$on('$viewContentLoaded', function() {
	init();
});


	//ajouter le domaine à l'URL pour créer des listes de modèles de signatures différentes à chaque utilisateur
	// 2 variables à ajouter Adresse du serveur et domaine
	var URL = 'http://127.0.0.1:8080/MCC/Signatures/';


	$scope.tinymceOptions = {
		onChange: function(e) {
      // put logic here for keypress and cut/paste changes
  },
  inline: false,
  plugins : 'advlist autolink link image lists charmap print preview table insertdatetime colorpicker code textcolor textpattern wordcount',
  toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  toolbar2: 'print preview media | forecolor backcolor emoticons | mybutton',
  skin: 'lightgray',
  theme : 'modern'
  /*,
  setup: function(editor) {
        editor.addButton('mybutton', {
            type: 'splitbutton',
            text: 'MarocCloudSign',
            icon: false,
            onclick: function() {
                //editor.insertContent('Main button');
            },
            menu: [
                {text: 'Nom', onclick: function() {editor.insertContent('[nom]');}},
                {text: 'Prenom', onclick: function() {editor.insertContent('[prenom]');}},
                {text: 'Telephone', onclick: function() {editor.insertContent('[telephone]');}},
                {text: 'Mail', onclick: function() {editor.insertContent('[mail]');}},
                {text: 'Fonction', onclick: function() {editor.insertContent('[fonction]');}}
            ]
        });
    }*/
};

var getSigns = function () {

	$http.get(URL).
	success(function(data, status, headers, config) {

    // this callback will be called asynchronously
    // when the response is available
    console.log(data);
    $scope.docs = data._embedded['rh:doc'];
    //console.log('titres : '+ $scope.docs[0].titre + ' ' + $scope.docs[1].titre);
    //$scope.$apply();

}).error (function(data, status, headers, config) {
    console.log(data);
});
};

$scope.addSign = function () { // DEPRECATED
	if ( $scope.titreSignature ) {
		console.log('texte' + $scope.tinymceModel);
		console.log('titre' + $scope.titreSignature);

		addModele();

		var req = {
			method: 'POST',
			url: URL,
			headers: {
				//'If-Match': $scope.idEtag
			},
			data :{titre:$scope.titreSignature,texte: $scope.tinymceModel}
		};
		/* $http.post(URL, {titre:$scope.titreSignature,texte: $scope.tinymceModel}). */
		$http(req).
		success(function(data, status, headers, config) {
			console.log('Success adding new signature ', status);
			getSigns();
			$scope.titreSignature = '';
			$scope.tinymceModel = '';
		}).
		error(function(error) {
			console.log('Problem while adding new signature !',error);
		});
	} else {
		$scope.msgError = 'Veuillez choisir un tiitre pour votre signature !';
		$('#errorAlert').show();
	};
};

$scope.deleteSign = function () { //DEPRECATED
	if ($scope.titreSignature) {

		deleteModele();
		var req = {
			method: 'DELETE',
			url: URL + $scope.idSign,
			headers: {
				'If-Match': $scope.idEtag
			}
		};

		$http(req).
		//$http.delete(URL + $scope.idSign ).
		success(function(data) {
			console.log('Successfully deleted',data);
			$scope.idSign = '';
			getSigns();
			$scope.titreSignature = '';
			$scope.tinymceModel = '';

		}).
		error(function(error) {
			console.log('Error deleting' , error);

		});
	};
};

$scope.refresh = function(doc) {
	$scope.titreSignature = doc.titre;
	$scope.tinymceModel = doc.texte;
	$scope.select = true;
	//$scope.idSign = doc._id.$oid;
	//$scope.idEtag = doc._etag.$oid;

	console.log('Refresh function completed !',doc);
};

$gapi.authed.then( function($scope) {
	console.log('Authentified on addsign.html!');
});

});
