// variable for holding map object
var map;
// Latitude and Longitude for center location - Ahmedabad
var map_lat = 23.033863, map_lng = 72.555022;

// Initialize the map with default configuration
function initMap() {
  // Creates a new map with ahmedabad as center location
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: map_lat, lng: map_lng},
    zoom: 13
  });
}

// Location Object
var Location = function(title, lat, lng) {
    var self = this;
    // Location title
	self.title = ko.observable(title);
    // Location position
    self.position = {lat: lat, lng: lng};
    // Location marker
    self.marker = new google.maps.Marker({
        map: map,
        position: self.position,
        animation: google.maps.Animation.DROP,
        title: title
    });
}

// Model
var viewModel = function() {
	var self = this;
	// List of locations to be displayed
	self.locations = ko.observableArray([]);
	// Query parameter to filter the locations
	self.query = ko.observable('');
    // Selected Location
    this.selectedLocation = ko.observable('Dummy');

	// Fetching coffee shops locations from foursquare API
    var apiURL = 'https://api.foursquare.com/v2/venues/explore?v=20160819&query=Coffee';
    apiURL += '&client_id=UPUPOWCSTJIGUEWYOFWHMEJI2J2EDETMWEACC0XXWUGELUAK';
    apiURL += '&client_secret=H55YZOD5SDS03IQQUU0Z5FRW3XPD4P1343CLDR4VXUOUJLHB';
    apiURL += '&ll=' + map_lat + ',' +  map_lng;

    $.ajax({
        url: apiURL,
        success: function(data) {
            var items = data.response.groups[0].items;
            ko.utils.arrayMap(items, function(item) {
                var venue = item.venue;
                // Adding click event for location marker
                /*google.maps.event.addListener(location.marker, 'click', function() {
                    self.selectLocation(location);
                }.bind(location));*/

                self.locations.push(new Location(venue.name, venue.location.lat,
                    venue.location.lng));
            });
        },
        error: function() {
            $('#locations').append("Failed to get coffee shop locations.");
        }
    });

    self.filteredLocations = ko.computed(function() {
        var query = self.query().toLowerCase();
        if (!query) {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                location.marker.setVisible(true);
                return true;
            });;
        } else {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                var isValid = location.title().toLowerCase().indexOf(query) >= 0;
                location.marker.setVisible(isValid);
                return isValid;
            });
        }
    });

	// Toggle filter available in the smaller screen
	self.toggleFilter = function() {
		jQuery('.row-offcanvas').toggleClass('active')
	}
}

ko.applyBindings(new viewModel());