// variable for holding map object
var map;
// Latitude and Longitude for center location - Ahmedabad
var AHMEDABAD_LAT = 23.033863, AHMEDABAD_LNG = 72.555022;
// Foursquare API client Id and client secret
var CLIENT_ID = 'UPUPOWCSTJIGUEWYOFWHMEJI2J2EDETMWEACC0XXWUGELUAK';
var CLIENT_SECRET = 'H55YZOD5SDS03IQQUU0Z5FRW3XPD4P1343CLDR4VXUOUJLHB';
// variable for holding Latitude and Longitude bounds object
var bounds;
// Initialize the map with default configuration
function initMap() {
    'use strict';
    // Creates a new map with ahmedabad as center location
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: AHMEDABAD_LAT, lng: AHMEDABAD_LNG},
        zoom: 14
    });
    bounds = new google.maps.LatLngBounds();
    ko.applyBindings(new ViewModel());
}

// Location Object
var Location = function(title, lat, lng, address, contact, hours, website,
    rating, ratingColor, id) {
    'use strict';
    var self = this;
    // Location title
	self.title = title;
    // Location additional information
    self.address = (address ? address : 'N.A.');
    self.contact = (contact ? contact : 'N.A.');
    self.hours = (hours ? hours : 'N.A.');
    self.website = (website ? website : 'N.A.');
    self.rating = (rating ? rating : 'N.A.');
    self.ratingColor = (ratingColor ? ratingColor : '#ff0000');
    // Location position
    self.position = {lat: lat, lng: lng};
    self.html = function() {
        var info = $('script[data-template="location"]').html();
        info = info.replace(/{{title}}/g, self.title);
        info = info.replace(/{{address}}/g, self.address);
        info = info.replace(/{{phone}}/g, self.contact);
        info = info.replace(/{{hours}}/g, self.hours);
        info = info.replace(/{{website}}/g, self.website);
        info = info.replace(/{{rating}}/g, self.rating);
        info = info.replace(/{{ratingColor}}/g, self.ratingColor);
        info = info.replace(/{{venue}}/g,
            self.title.toLowerCase().replace(/ /g, '-'));
        info = info.replace(/{{venueId}}/g, id);
        info = info.replace(/{{clientId}}/g, CLIENT_ID);
        return info;
    };

    // Location marker
    self.marker = new google.maps.Marker({
        map: map,
        position: self.position,
        animation: google.maps.Animation.DROP,
        title: self.title,
        infowindow: new google.maps.InfoWindow({
            content: self.html()
        })
    });

    // Flag for active location
    self.isActive = ko.observable(false);
};

// Model
var ViewModel = function() {
    'use strict';
	var self = this;
	// List of locations to be displayed
	self.locations = ko.observableArray([]);
	// Query parameter to filter the locations
	self.query = ko.observable('');
    // Selected Location
    self.selectedLocation = ko.observable();
    // Error message for loading locations
    self.errorMessage = ko.observable();
    // Filter
    self.filterEnabled = ko.observable(false);

	// Fetching coffee shops locations from foursquare API
    var dateString = new Date().toISOString().slice(0,10).replace(/-/g,'');
    var apiURL = 'https://api.foursquare.com/v2/venues/explore?v=' +
    dateString +'&query=Coffee';
    apiURL += '&client_id=' + CLIENT_ID;
    apiURL += '&client_secret=' + CLIENT_SECRET;
    apiURL += '&ll=' + AHMEDABAD_LAT + ',' + AHMEDABAD_LNG;

    $.ajax({
        url: apiURL,
        success: function(data) {
            var items = data.response.groups[0].items;
            ko.utils.arrayMap(items, function(item) {
                var venue = item.venue;
                var location = new Location(venue.name, venue.location.lat,
                    venue.location.lng, venue.location.formattedAddress,
                    venue.contact.formattedPhone,
                    (venue.hours ? venue.hours.status : 'N.A.'), venue.url,
                    venue.rating, venue.ratingColor, venue.id);
                self.locations.push(location);
                bounds.extend(location.marker.position);
                map.fitBounds(bounds);

                google.maps.event.addListener(location.marker, 'click', function() {
                    self.selectLocation(location);
                }.bind(location));
            });
        },
        error: function() {
            self.errorMessage('Failed to get coffee shop locations. ' +
                'Please try again later.');
        }
    });

    self.filteredLocations = ko.computed(function() {
        var query = self.query().toLowerCase();
        if (!query) {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                location.marker.setVisible(true);
                return true;
            });
        } else {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                var isValid = location.title.toLowerCase().indexOf(query) >= 0;
                location.marker.setVisible(isValid);
                // Close InfoWindow if marker is not visible
                if (!isValid) {
                    location.marker.infowindow.close();
                }
                return isValid;
            });
        }
    });

    self.selectLocation = function(location) {
        // Disable animation for previous location and close info window.
        if (self.selectedLocation() && self.selectedLocation() != location) {
            self.selectedLocation().marker.setAnimation(null);
            self.selectedLocation().marker.infowindow.close();
            self.selectedLocation().isActive(false);
        }
        // Select new location
        self.selectedLocation(location);
        // Enable bounce animation for selected location
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        location.isActive(true);
        showLocationInformation(location);
    };

	// Toggle filter available in the smaller screen
    self.toggleFilter = function() {
        self.filterEnabled(!self.filterEnabled());
    };
};

// This function display the location information in InfoWindow when the marker
// is clicked. Only one info window will be visible at time on the map.
function showLocationInformation(location) {
    'use strict';
    var infowindow = location.marker.infowindow;
    infowindow.open(map, location.marker);
    // Close marker when on clicking on 'X' icon on InfoWindow.
    infowindow.addListener('closeclick',function(){
        infowindow.setMap(null);
        location.marker.setAnimation(null);
    });
}

function googleMapError(){
    alert('Error while loading Google map. Please try again later.');
}

window.onresize = function() {
    // Display all markers on the map when window resizes.
    map.fitBounds(bounds);
};