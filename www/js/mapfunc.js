
///////////////////////////////////////////
// current location GPS display code from:
//https://github.com/tkompare/projects/tree/master/stalker
//
//Name: Stalker POC
//Author: TOM KOMPARE
//Email: tom@kompare.us
//
///////////////////////////////////////////
var gpsEnabled;
var map;
function loadMap()
{
	var browserSupportFlag =  new Boolean();
	// Make the map
			map = new google.maps.Map(document.getElementById('map_canvas'), {
			zoom: 10,
			panControl: true,
			
			mapTypeControl: false,
			streetViewControl: false,
			center: new google.maps.LatLng(-40.9333,172.9500),
			mapTypeId: google.maps.MapTypeId.HYBRID
			});
			
	if(navigator.geolocation)
	{
		browserSupportFlag = true;
		
		// Get your the latest geolocation data from the user's device
		navigator.geolocation.getCurrentPosition(function(position) {
			gpsEnabled = true;
			// Create the Google Maps API location object
			var myLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			
			// Tell the map to center on the user's location
			map.setCenter(myLocation);
			map.setZoom(20);
			map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
			// Make the user's marker object and put it on the map
			
			var markerYou = new google.maps.Marker({
				position: myLocation, 
				map: map, 
				title: 'You are here.',
				visible: true
			});
			// Bounce the marker on the map
			markerYou.setAnimation(google.maps.Animation.BOUNCE);
			// Make the marker information pop-up
			var infowindowYou = new google.maps.InfoWindow({
				content: 'You are here'
			});
			// Listen for the user's click on the marker to show the pop-up
			google.maps.event.addListener(markerYou, 'click', function() {
				infowindowYou.open(map,markerYou);
			});
			// Watch the user's device GPS for new location.
			var watcher = navigator.geolocation.watchPosition(function(newPosition) {
					// Each time a new location is registered, move the marker.
					myLocation = new google.maps.LatLng(newPosition.coords.latitude,newPosition.coords.longitude);
					markerYou.setPosition(myLocation);
			}, function() {}, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
			// Listen for the map page to be closed and stop listenting to the user's device GPS
			$(document).live('pagebeforehide', function(event,ui){
				navigator.geolocation.clearWatch(watcher);
				watcher = false;
			});
		}, function() {
			// If the device has a GPS, but still can't be located...
			handleNoGeolocation(browserSupportFlag);
		});
	}
	else
	{
		// If the device does not have GPS...
		browserSupportFlag = false;
		handleNoGeolocation(browserSupportFlag);
	}
	function handleNoGeolocation(errorFlag)
	{
	  gpsEnabled = false;
		
		map.setCenter(new google.maps.LatLng(-40.9333,172.9500));
		if (errorFlag == true)
		{
			alert("Geolocation service failed.");
		}
		else
		{
			alert("Your device does not support geolocation.");
		}
	}
}
 
 ////////////////////////////////////////////////////////
 // Marker + photo overlays code template from:
 // http://chrisltd.com/blog/2013/08/google-map-random-color-pins/
 ////////////////////////////////////////////////////////
 
	// Setup the different icons
    var iconURLPrefix = 'http://maps.google.com/mapfiles/ms/icons/';
    
    var icons = [
      //iconURLPrefix + 'red-dot.png',
      iconURLPrefix + 'green-dot.png',
      iconURLPrefix + 'blue-dot.png',
      iconURLPrefix + 'orange-dot.png',
      iconURLPrefix + 'purple-dot.png',
      iconURLPrefix + 'pink-dot.png',      
      iconURLPrefix + 'yellow-dot.png'
    ];
    var icons_length = icons.length;

	function placePhotos(){
	alert('start sharing');
	// var p = { URI:'content://media/external/images/media/19928',
					 // coords: {longitude:170.33416166666666,latitude:-45.871478333333336},
					 // shared: true,
					 // };
		var sharedPhotos = window.localStorage.getItem("sharedPhotos");
		if(sharedPhotos!=null && sharedPhotos!=''){
		alert('get saved data');
			sharedPhotos = JSON.parse(sharedPhotos);
			alert('infowindow');
			var infowindow = new google.maps.InfoWindow({
				maxWidth: 200
			});
			var marker;
			var markers = new Array();
			var iconCounter = 0;
			
			for(p in sharedPhotos){
				alert('in loop p: '+p.URI);
				var content = "<div style='width:100%;'><img style='width:100%;' src='"+p.URI+"'/>some text </div>"
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(p.coords.latitude, p.coords.longitude),
					map: map,
					icon: icons[iconCounter],
				});
				
				markers.push(marker);
				
				google.maps.event.addListener(marker,'click', function() {
					
					alert('setcontent');
						infowindow.setContent(content);
						infowindow.open(map,marker);
					
				});
				
				iconCounter++;
				if(iconCounter >=icons_length){
					iconCounter = 0;
				}
			}
			function AutoCenter() {
			alert('auto center');
			  //  Create a new viewpoint bound
			  var bounds = new google.maps.LatLngBounds();
			  //  Go through each...
			  $.each(markers, function (index, marker) {
				bounds.extend(marker.position);
			  });
			  //  Fit these bounds to the map
			  map.fitBounds(bounds);
			  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
			}
			AutoCenter();

		}
		else{
			alert('no sharedPhotos found');
		}
	}
	
function drawPath(data){
	var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);
	
	map.setCenter(myLatLng);
	map.setZoom(15);
	map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	
	var trackCoords = [];
	
	// Add each GPS entry to an array
      for(i=0; i<data.length; i++){
	trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
      }
  
  // Plot the GPS entries as a line on the Google Map
  var trackPath = new google.maps.Polyline({
    path: trackCoords,
    strokeColor: getRandomColor(),
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  
   //Apply the line to the map
  trackPath.setMap(map);
  
}

////////////////////////////////////////////////////////////////
// calculate gps distance
// http://www.movable-type.co.uk/scripts/latlong.html
///////////////////////////////////////////////////////////////

function gps_distance(lat1, lon1, lat2, lon2)
{
  
  var R = 6371; // km
  var dLat = (lat2-lat1) * (Math.PI / 180);
  var dLon = (lon2-lon1) * (Math.PI / 180);
  var lat1 = lat1 * (Math.PI / 180);
  var lat2 = lat2 * (Math.PI / 180);
  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  
  return d;
}

