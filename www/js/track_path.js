////////////////////////////////////////////////////////////////
// object size from:
// http://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
////////////////////////////////////////////////////////////////

Object.size = function(obj){
   var size=0,key;
 	for(key in obj){
 	  if(obj.hasOwnProperty(key)) {alert(key);alert(obj[key]);size++;}
 	}
 	return size;
};

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
 
// When the user views the Track Info page
$(document).on('pageinit',function(){
  // Find the track_id of the workout they are viewing
  //var key = $(this).attr("track_id");
  
  // Update the Track Info page header to the track_id
  //$("#track_info div[data-role=header] h1").text(key);
  
  loadMap();
  
});


var track_id = '';      // Name/ID of the track
var watch_id = '';    // ID of the geolocation
var tracking_data = []; // Array containing GPS position objects
var track_records;	// map of track_id,tracking_data

$("#startTracking_start").live('click', function(){
  //check for gps tracking
  if(gpsEnabled == true) {
  
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
  }
  else{
    //nothing happens
    alert('nothing happens');
  }
});


$("#startTracking_stop").live('click', function(){
  if(gpsEnabled){
  // Stop tracking the user
  navigator.geolocation.clearWatch(watch_id);
  
  // Save the tracking data
  track_records = window.localStorage.getItem("tracks");
  if(track_records== ''){
    track_records = {};
  }
  else{
   track_records = JSON.parse(track_records); 
  }
  alert("track_id before "+track_id);
  track_id = checkKey(track_id,track_records,track_id.length);
  alert("track_id after "+track_id);
  track_records[track_id] = tracking_data;
  alert(track_records);
  alert(track_records[track_id]);
  window.localStorage.setItem("tracks", JSON.stringify(track_records));
  
  // Reset watch_id and tracking_data 
  watch_id = '';
  tracking_data = '';
  
  // Tidy up the UI
  $("#track_id").val("").show();
  
  $("#startTracking_status").html("Stopped tracking path: <strong>" + track_id + "</strong>");
  }
  else{
  //nothing happens
  alert('nothing happens');
  }
});

function checkKey(id,records,len){
  
  if(id == '' || id.match(/^\s*$/) ){
     id = 'track_name'; 
     len = id.length;
  }  
  if(!isNaN(id)){
    id = id.toString();
  }
  if( records == '' || Object.size(records) == 0 ){
      return id;
  }
  var matched = false;
  alert('len '+len);
  for(key in records){
    alert('id in loop '+id);
    
      if(key == id){
	matched = true;
	break;
      }
  }
  if(matched){
	if(len!=id.length){
	  var tmp = id.slice(0,len);
	  alert('tmp '+tmp);
	  var tmp2 = parseInt(id.slice(len+1,id.length));
	  alert('tmp2 '+tmp2);
	  tmp2++;
	  return checkKey(tmp.concat('_'+tmp2),records,len);
	}
	else{
	  return checkKey(id.concat('_0'),records,len);
	}
  }
  else{
      return id;
  }
  
}


$("#view_track").live('click',function(){
  // create dummy coords
 
  var tracks_recorded =0;
  var tracks = window.localStorage.getItem("tracks");
 
  if(tracks!=''){
    tracks = JSON.parse(tracks);
    
      var len = Object.size(tracks);
	
    tracks_recorded = len;
  }
  
  if(tracks_recorded !=0){
    alert('tracks recorded '+tracks_recorded);
    
      for(key in tracks){
	
	alert(key);
	var data = tracks[key];
	
	//data = JSON.parse(data);
	
	drawPath(data);
	
      }
  }
  else{ 
      drawPath(dummy_data);
  }
  
});

$("#clearstorage_button").live('click', function(){
  window.localStorage.setItem("tracks",'');
  
});

$("#view_sharedPhoto").live('click',placePhotos);

