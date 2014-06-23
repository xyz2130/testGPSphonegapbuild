
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
var watcher;
var markerYou;
var infowindowYou;
var myLocation;
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
			myLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			
			// Tell the map to center on the user's location
			map.setCenter(myLocation);
			map.setZoom(20);
			map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
			// Make the user's marker object and put it on the map
			
			markerYou = new google.maps.Marker({
				position: myLocation, 
				map: map, 
				title: 'You are here.',
				visible: true
			});
			// Bounce the marker on the map
			markerYou.setAnimation(google.maps.Animation.BOUNCE);
			// Make the marker information pop-up
			infowindowYou = new google.maps.InfoWindow({
				content: 'You are here'
			});
			// Listen for the user's click on the marker to show the pop-up
			google.maps.event.addListener(markerYou, 'click', function() {
				infowindowYou.open(map,markerYou);
			});
			// Watch the user's device GPS for new location.
			watcher = navigator.geolocation.watchPosition(function(newPosition) {
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
$("#view_sharedPhoto").live('click', function(){

placePhotos();
	// viewSharedPhoto();
  // function viewSharedPhoto(){
	// if(gpsEnabled == true){
		// alert('view shared photo');
		  // navigator.geolocation.clearWatch(watcher);
		  // watcher = false;
		  // markerYou.setMap(null);
		  // alert('watcher cleared');
		  // placePhotos().then(function(){
		  	// markerYou.setMap(map);
			// alert('place photos done, continue watching');
			// watcher = navigator.geolocation.watchPosition(function(newPosition) {
					// // Each time a new location is registered, move the marker.
					// myLocation = new google.maps.LatLng(newPosition.coords.latitude,newPosition.coords.longitude);
					// markerYou.setPosition(myLocation);
			// }, function() {}, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
		
		 // });
	// }
// }
});
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
	var deferred = new $.Deferred();
	//alert('start sharing');
	// var p = { URI:'content://media/external/images/media/19928',
					 // coords: {longitude:170.33416166666666,latitude:-45.871478333333336},
					 // shared: true,
					 // };
		var sharedPhotos = window.localStorage.getItem("sharedPhotos");
		if(sharedPhotos!=null && sharedPhotos!=''){
			//alert('get saved data');
			sharedPhotos = JSON.parse(sharedPhotos);
			//alert('infowindow');
			var infowindow = new google.maps.InfoWindow({
				maxWidth: 150
			});
			var marker;
			var markers = new Array();
			var iconCounter = 0;
			
			for(p in sharedPhotos){
				if(sharedPhotos.hasOwnProperty(p)){
					//alert('in loop p: '+sharedPhotos[p].URI);
					//alert(JSON.stringify(sharedPhotos[p].coords));
					var contentStr = '<div style="width:100%;"><img style="width:100%;"'+ 
										'src="'+sharedPhotos[p].URI+'"/><br>by '+ p+'<br>'+
										'<button name="un-Share" id="un-Share" class="un-Share" >'+
										'UnShare</button> </div>';
					marker = new google.maps.Marker({
						position: new google.maps.LatLng(sharedPhotos[p].coords.latitude, sharedPhotos[p].coords.longitude),
						map: map,
						icon: icons[iconCounter],
					});
					//alert(marker);
					markers.push(marker);
					//alert('markers pushed');
					
					
					google.maps.event.addListener(marker,'click', (function(marker,c) {
						return function(){
						//alert('setcontent');
							infowindow.setContent(c);
							infowindow.open(map,marker);
						};
					})(marker,contentStr));
					
					var rmbtn = $(contentStr.match('un-Share')[0]);
					google.maps.event.addDomListener(rmbtn,'click',(function(marker,pURI,sharedPhotos,markers){
						return function(){
						//alert('removing1');
						//alert(marker+' '+pURI+' '+sharedPhotos);
							var photos = window.localStorage.getItem("photos");
							if(photos!=null &&photos!=''){
							//alert(photos);
								photos = JSON.parse(photos);
								//alert(photos);
							}
							//alert(sharedPhotos[pURI]+' '+photos[pURI]);
							if(sharedPhotos[pURI]!=null && sharedPhotos[pURI]!=''){
							//alert('removing');
								delete sharedPhotos[pURI];
								if(photos[pURI]!=null&& photos[pURI]!='' ){
									photos[pURI].shared = false;
									window.localStorage.setItem("photos",JSON.stringify(photos));
								}
								window.localStorage.setItem("sharedPhotos",JSON.stringify(sharedPhotos));
								marker.setMap(null);
								AutoCenter(markers);
							}
						}
					})(marker,sharedPhotos[p].URI,sharedPhotos,markers));
					
					//alert('s1');
					iconCounter++;
					if(iconCounter >=icons_length){
						iconCounter = 0;
					}
				}
				
			}
			
			AutoCenter(markers);
			deferred.resolve();
		}
		else{
			//alert('no sharedPhotos found');
			deferred.resolve();
		}
		return deferred.promise();
	}

function AutoCenter(markers) {
//alert('auto center');
  //  Create a new viewpoint bound
  var bounds = new google.maps.LatLngBounds();
  //  Go through each...
  $.each(markers, function (index, marker) {
	bounds.extend(marker.position);
  });
  //alert('s2');
  //  Fit these bounds to the map
  // map.fitBounds(bounds);
  //alert('s3');
  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
  //alert('s4');
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

