// Code For Custom Scroll Bar
window.onload = setTimeout(determineWidth, 100);
window.onresize = determineWidth;

function scrollEvent(){
	var scrollElem = document.getElementById("scroller"); // Margin of this should change
	var scrolledContent = (document.getElementById("cont").scrollLeft) // How far it has scrolled
	var contentWidth = document.getElementById("cont").scrollWidth - document.getElementById("cont").clientWidth;
	var windowWidth = (window.innerWidth);
	var percentageOfScreen = .985-(parseInt(document.getElementById("scroller").style.width)/windowWidth);
	scrollElem.style.marginLeft = ((scrolledContent/contentWidth)*windowWidth*percentageOfScreen) + "px";
}
function determineWidth() {
	var perc = (parseInt(window.innerWidth)/parseInt(document.getElementById("cont").scrollWidth));
	perc = perc - .0325;
	document.getElementById("scroller").style.width = (parseInt(window.innerWidth) * perc)+ 10 +"px"; 
}
// End of Custom Scroll Bar

var app = angular.module('myApp',['ngRoute', 'ngMaterial']);
app.config(function ($routeProvider) {
	$routeProvider
	.when('/', { // main view
	  controller: "MainController",
	  templateUrl: "/view1.tpl"
	})
	
	.when('/view2link/:username' , { // view for each clicked user
	  controller: 'SecondController',
	  templateUrl: '/view2.tpl'
	});
});
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
	.primaryPalette('white')
    .accentPalette('white');
	$mdThemingProvider.definePalette('white', {
    '50': 'ffffff',
    '100': 'ffffff',
    '200': 'ffffff',
    '300': 'ffffff',
    '400': 'ffffff',
    '500': 'ffffff',
    '600': 'ffffff',
    '700': 'ffffff',
    '800': 'ffffff',
    '900': 'ffffff',
    'A100': 'ffffff',
    'A200': 'ffffff',
    'A400': 'ffffff',
    'A700': 'ffffff',
    'contrastDefaultColor': 'dark'
  });
});
app.controller("MainController",["$scope", "testService", "$mdSidenav", function($scope, testService, $mdSidenav) {
	testService.success(function(data){ // retrieves data from service, probably won't be used
		$scope.clients = data; // used for ng-repeat (displaying users)
	});
	$scope.openLeftMenu = function() {
		$mdSidenav('left').toggle();
	};
	$scope.state = true;
	$scope.clients;
	$scope.boldArray = ['white','white','white','#ff4d4d','white','white','white','white','white','white'];
	$scope.arrows = new Array(10);
	// Starting values
	$scope.arrows[3] = '▼';
	$scope.queryBy = '$';
	$scope.order = 'username';
	var previousOrder = 'username';
	var count = 0;
	$scope.state = [true,false,false,true,false,false, true,true,false,false];
	$scope.changeOrder = function(q,ind) { // When a column title is clicked on
		$scope.order = q; // orderBy is changed
		$scope.arrows = new Array(10); // clears arrows
		$scope.boldArray = ['white','white','white','white','white','white','white','white','white','white']; // clears ng-style
		$scope.boldArray[ind] = '#ff4d4d'; // changes color of selected column
		//$scope.query = "";
		
		if (previousOrder != q) { // clicked on new column
			$scope.arrows[ind] = '▼'; // down arrow
			count = 0;
		} else {
			if (count == 0) { // Switch direction of order if clicking on the same column 
				$scope.arrows[ind] = '▲'; // up arrow
				$scope.order = '-' + $scope.order; // switches direction
				count++;
			} else {
				$scope.arrows[ind] = '▼'; // down arrow
				count = 0;
			}
		}
		previousOrder = q;
	};
	$scope.showAll = function() {
		$scope.state = [true,true,true,true,true,true,true,true,true,true];
	};
	$scope.showDefault = function() {
		$scope.state = [true,false,false,true,false,false, true,true,false,false];
	};
	$scope.checkVar = function() { // For testing
		console.log("Scroll Distance: "+document.getElementById("cont").scrollLeft);
		console.log("Window Width : "+window.innerWidth);
		console.log("Content Width: "+document.getElementById("cont").scrollWidth);
		console.log("Margin Left: "+document.getElementById("scroller").style.marginLeft);
		console.log("Scroller Width: "+parseInt(document.getElementById("scroller").style.width));
	};
}]);
app.controller("SecondController",["$scope","testService", "$routeParams", function($scope, testService, $routeParams) { // Second page
	$scope.clients = [];
	$scope.user;
	testService.success(function(data){ // gets all users from service
		$scope.clients = data; // saves data
		for(var i = 0; i < data.length; i++) { // finds the user who's name was clicked on
			if (data[i].username == $routeParams.username) {
				$scope.user = data[i]; // saves as the user for this page when found
				break;
			}
		}
	});
}]);

// This next factory will probably not be used in actual implementation because objects are gathered from Twig, not a json file

app.factory("testService",["$http", function($http) { // service that gets the data for the users from objects.json
	return $http.get('objects.json')
		.success(function(data){
			return data;
		})
		.error(function(err){
			return err;
		});
}]);
app.filter("emptyToEnd", function () { // In orderBy, makes sure empty values are placed at the bottom
	return function (array, key) {
		if(!angular.isArray(array)) return;
		var present = array.filter(function (item) {
			return item[key];
		});
		var empty = array.filter(function (item) {
			return !item[key]
		});
		return present.concat(empty);
	};
});
app.config(function($interpolateProvider){ // Changes {{}} to {[{}]} in html for Twig
	$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});