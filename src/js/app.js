// variable for holding map object
var map;
// Latitude and Longitude for center location - Ahmedabad
var map_lat = 23.033863, map_lng = 72.555022;

// Initialize the map with default configuration
function initMap() {
  // Creates a new map with ahmedabad as center location
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: map_lat, lng: map_lng},
    zoom: 14
  });
}

// Location Object
var Location = function(title, lat, lng, address, contact, hours, website,
    rating, ratingColor) {
    var self = this;
    // Location title
	self.title = ko.observable(title);
    // Location additional information
    self.address = (address != null ? address : 'N.A.');
    self.contact = (contact != null ? contact : 'N.A.');
    self.hours = (hours != null ? hours : 'N.A.');
    self.website = (website != null ? website : 'N.A.');
    self.rating = (rating != null ? rating : 'N.A.');
    self.ratingColor = (ratingColor != null ? ratingColor : '#ff0000');
    // Location position
    self.position = {lat: lat, lng: lng};
    self.html = ko.computed(function() {
        var info = $('script[data-template="location"]').html();
        info = info.replace(/{{title}}/g, self.title());
        info = info.replace(/{{address}}/g, self.address);
        info = info.replace(/{{phone}}/g, self.contact);
        info = info.replace(/{{hours}}/g, self.hours);
        info = info.replace(/{{website}}/g, self.website);
        info = info.replace(/{{rating}}/g, self.rating);
        info = info.replace(/{{ratingColor}}/g, self.ratingColor);
        return info;
    });

    // Location marker
    self.marker = new google.maps.Marker({
        map: map,
        position: self.position,
        animation: google.maps.Animation.DROP,
        title: self.title(),
        infowindow: new google.maps.InfoWindow({
            content: self.html()
        })
    });

    // Used to decide visibility of location
    self.isVisible = ko.observable(true);

    //  Display marker based on location visibility state.
    self.isVisible.subscribe(function(isVisible) {
        self.marker.setVisible(isVisible);
        // Close InfoWindow if marker is not visible
        if (!isVisible) {
            self.marker.infowindow.close();
        }
    });
    // Flag for active location
    self.isActive = ko.observable(false);
}

// Model
var viewModel = function() {
	var self = this;
	// List of locations to be displayed
	self.locations = ko.observableArray([]);
	// Query parameter to filter the locations
	self.query = ko.observable('');
    // Selected Location
    this.selectedLocation = ko.observable();

	// Fetching coffee shops locations from foursquare API
    var dateString = new Date().toISOString().slice(0,10).replace(/-/g,"");
    var apiURL = 'https://api.foursquare.com/v2/venues/explore?v=' + dateString
        +'&query=Coffee';
    apiURL += '&client_id=###CLIENT_ID###';
    apiURL += '&client_secret=###CLIENT_SECRET###';
    apiURL += '&ll=' + map_lat + ',' +  map_lng;

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
                    venue.rating, venue.ratingColor);
                self.locations.push(location);

                google.maps.event.addListener(location.marker, 'click', function() {
                    self.selectLocation(location);
                    showLocationInformation(location);
                }.bind(location));
            });
        },
        error: function() {
            $('#locations').append('Failed to get coffee shop locations. Please'
                + ' try again later.');
        }
    });

    self.filteredLocations = ko.computed(function() {
        var query = self.query().toLowerCase();
        if (!query) {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                location.isVisible(true);
                return true;
            });;
        } else {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                var isValid = location.title().toLowerCase().indexOf(query) >= 0;
                location.isVisible(isValid);
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
		jQuery('.row-offcanvas').toggleClass('active')
	}
}

// This function display the location information in InfoWindow when the marker
// is clicked. Only one info window will be visible at time on the map.
function showLocationInformation(location) {
    var infowindow = location.marker.infowindow;
    infowindow.open(map, location.marker);
    // Close marker when on clicking on 'X' icon on InfoWindow.
    infowindow.addListener('closeclick',function(){
        infowindow.setMap(null);
    });
}

ko.applyBindings(new viewModel());