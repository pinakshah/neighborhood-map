// variable for holding map object
var map;
// Latitude and Longitude for center location - Ahmedabad
var map_lat = 23.033863, map_lng = 72.585022;

// Initialize the map with default configuration
function initMap() {
  // Constructor creates a new map - only center and zoom are required.

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: map_lat, lng: map_lng},
    zoom: 12
  });
}

var initialLocations = [
	{
		name: 'Zencafe',
		lat: 23.036207442016103,
		lng: 72.54959106445312
	},
	{
		name: 'Lucky Tea',
		lat: 23.027900310162142,
		lng: 72.5813687146695
	},
	{
		name: 'Dunkin Donuts',
		lat: 23.02471812460175,
		lng: 72.55643956279857
	},
	{
		name: 'K K tea stall',
		lat: 23.030214218955297,
		lng: 72.54064321517944
	},
	{
		name: 'Turquoise Villa',
		lat: 23.022949135163845,
		lng: 72.55559045088786
	},
	{
		name: 'SandwichworkZ',
		lat: 23.02866697207492,
		lng: 23.02866697207492
	},
	{
		name: 'Cafe Natrani',
		lat: 23.047684658018554,
		lng: 72.57267951965332
	},
	{
		name: 'Shambhu\'s Coffee Bar',
		lat: 23.031933117449288,
		lng: 72.55507636137939
	}
]

var Location = function(name, lat, lng) {
	this.name = ko.observable(name);
	this.lat = lat;
	this.lng = lng;
}

var viewModel = function() {
	var self = this;
	// List of locations to be displayed
	this.locationList = ko.observableArray([]);

	//Initialize locations
	initialLocations.forEach(function(locItem){
		self.locationList.push(new Location(locItem.name, locItem.lat, locItem.lng));
	});

	// Toggle filter available in the smaller screen
	this.toggleFilter = function() {
		jQuery('.row-offcanvas').toggleClass('active')
	}
}

ko.applyBindings(new viewModel());