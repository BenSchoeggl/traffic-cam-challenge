// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };

    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });
    var stations;
    var markers = [];
    var infoWindow = new google.maps.InfoWindow();
    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json').
        done(function(data) {
            stations = data;
            data.forEach(function(station) {
                var marker = new google.maps.Marker({
                    position: {
                        lat : Number(station.location.latitude),
                        lng : Number(station.location.longitude)
                    },
                    map: map
                });
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
                    var html = '<h2>' + station.cameralabel + '</h2>';
                    html += '<img src=' + station.imageurl.url + '></img>';
                    map.panTo(this.getPosition());
                    infoWindow.setContent(html);
                    infoWindow.open(map, this); 
                })
            });
        })
        .fail(function(error) {
            console.log(error);
        })
        .always(function() {
            $('#ajax-loader').fadeOut();
        });
    //end of getJSON method

    var searchInput = $('#search');
    console.log(searchInput);
    searchInput.bind('search keyup', function() {
        stations.forEach(function(station, idx) {
            var searchText = searchInput.val().toLowerCase();
            var name = station.cameralabel.toLowerCase();
            console.log(searchText);
            console.log(name);
            if (name.indexOf(searchText) || searchInput.value == '') {
                markers[idx].setMap(null);
            } else {
                markers[idx].setMap(map);
            }
        });
    })
});

