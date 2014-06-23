////////////////////////////////////////////////////////////////
// calculate gpe distance
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
////////////////////////////////////////////////////////////////////////////////
// generate random color:
//http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
///////////////////////////////////////////////////////////////////////////////
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

///////////////////////////////////////////
// current location GPS display code from:
//https://github.com/tkompare/projects/tree/master/stalker
//
//Name: Stalker POC
//Author: TOM KOMPARE
//Email: tom@kompare.us
//
///////////////////////////////////////////
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
			alert('check1');
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
			alert('Can\'t locate GPS');
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

// When the user views the Track Info page
$(document).on('pageinit', function(){
  // Find the track_id of the workout they are viewing
  //var key = $(this).attr("track_id");
  
  // Update the Track Info page header to the track_id
  //$("#track_info div[data-role=header] h1").text(key);
  
  loadMap();
  
  
});


var track_id = '';      // Name/ID of the track
var watch_id = null;    // ID of the geolocation
var tracking_data = []; // Array containing GPS position objects

$("#startTracking_start").live('click', function(){
  
  // Start tracking the User
  watch_id = navigator.geolocation.watchPosition(
    
    // Success
    function(position){
      tracking_data.push(position);
    },
    
    // Error
    function(error){
      console.log(error);
    },
    
    // Settings - frequency = coord gathering time interval (millisec)
    { frequency: 5000, enableHighAccuracy: true }
  );
  
  
  // Tidy up the UI
  track_id = $("#track_id").val();
  
  $("#track_id").hide();
  
  $("#startTracking_status").html("Tracking path: <strong>" + track_id + "</strong>");
});


$("#startTracking_stop").live('click', function(){
  
  // Stop tracking the user
  navigator.geolocation.clearWatch(watch_id);
  
  // Save the tracking data
  window.localStorage.setItem(track_id, JSON.stringify(tracking_data));
  
  // Reset watch_id and tracking_data 
  watch_id = null;
  tracking_data = null;
  
  // Tidy up the UI
  $("#track_id").val("").show();
  
  $("#startTracking_status").html("Stopped tracking path: <strong>" + track_id + "</strong>");
  
});

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

$("#view_track").live('click',function(){
  // create dummy coords
  var dummy_data = [{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,
    "accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},
    {"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,
      "latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},
      {"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,
	"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,
	"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,
	  "coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,
	    "accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},
	    {"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,
	      "longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,
	      "speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,
		"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,
		  "accuracy":0,"latitude":-45.873394999999995,"speed":null,
		  "altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,
		    "altitude":null,"longitude":170.33427333333336,"accuracy":0,
		    "latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},
		    {"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,
		      "longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,
		      "speed":null,"altitudeAccuracy":null}}];
  
  var tracks_recorded = window.localStorage.length;
  
  if(tracks_recorded !=0){
    alert('tracks recorded '+tracks_recorded);
      for(i=0; i<tracks_recorded; i++){
	var key = window.localStorage.key(i);
	
	var data = window.localStorage.getItem(key);
	
	data = JSON.parse(data);
	
	drawPath(data);
	
      }
  }
  else{
      drawPath(dummy_data);
  }
  
  // Turn the stringified GPS data back into a JS object
  //data = JSON.parse(data);
  
  // Calculate the total distance travelled
  total_km = 0;
  
  for(i = 0; i < dummy_data.length; i++){
    
    if(i == (dummy_data.length - 1)){
      break;
    }
    
    total_km += gps_distance(dummy_data[i].coords.latitude, dummy_data[i].coords.longitude, dummy_data[i+1].coords.latitude, dummy_data[i+1].coords.longitude);
  }
  
  //total_km_rounded = total_km.toFixed(2);
  
  // Calculate the total time taken for the track
  //start_time = new Date(data.timestamp).getTime();
  //end_time = new Date(data[data.length-1].timestamp).getTime();
  
  //total_time_ms = end_time - start_time;
  //total_time_s = total_time_ms / 1000;
  
  //final_time_m = Math.floor(total_time_s / 60);
  //final_time_s = total_time_s - (final_time_m * 60);
  
  // Display total distance and time
  //$("#track_map").html('Travelled <strong>' + total_km_rounded + '</strong> //km in <strong>' + final_time_m + 'm</strong> and <strong>' + final_time_s //+ 's</strong>');
  
  // Set the initial Lat and Long of the Google Map
  var myLatLng = new google.maps.LatLng(dummy_data[0].coords.latitude, dummy_data[0].coords.longitude);
  
  // Google Map options
  //alert("yo");
  console.log("yoyo");
  var myOptions = {
    zoom: 15,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  // Create the Google Map, set options
  //var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  var trackCoords = [];
  
  
  
});


$("#clearstorage_button").live('click', function(){
  window.localStorage.clear();
});



// When the user views the history page
$('#history').live('pageshow', function () {
  
  // Count the number of entries in localStorage and display this information to the user
  tracks_recorded = window.localStorage.length;
  $("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");
  
  // Empty the list of recorded tracks
  $("#history_tracklist").empty();
  
  // Iterate over all of the recorded tracks, populating the list
  for(i=0; i<tracks_recorded; i++){
    $("#history_tracklist").append("<li><a href='#track_info' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
  }
  
  // Tell jQueryMobile to refresh the list
  $("#history_tracklist").listview('refresh');
  
});

// When the user clicks a link to view track info, set/change the track_id attribute on the track_info page.
$("#history_tracklist li a").live('click', function(){
  
  $("#track_info").attr("track_id", $(this).text());
  
});

