    ////////////////////////////////////////////////
    // remove temporary photo files in iOS
    // code from:
    // https://software.intel.com/en-us/articles/phonegap-camera-api-capture-a-photo-using-a-device-camera-and-edit-zoom-and-crop-the
    /////////////////////////////////////////////////
    
    // Removes all temporary files created by application. Is to be used when temporary files are not intended to be operated with further
function removeTemporaryFiles() {
    if (isIOS()) {
        navigator.camera.cleanup(onSuccess, onError); 
    }
    function onSuccess() {  }
    function onError(message) {  }
}
// Determines whether the current device is running iOS
function isIOS() {
    var iDevices = ["iPad", "iPhone", "iPod"];
    for (var i = 0; i < iDevices.length ; i++ ) {
        if( navigator.platform.indexOf(iDevices[i]) !== -1){ 
            return true; 
        }
    }
    return false;
}
    // Get current position
	//
	function currentPosition(){
		var flag = new Boolean();
		
		if(navigator.geolocation){
			flag = true;
			
			//get current location
			navigator.geolocation.getCurrentPosition(function(pos){
				return pos;
			}, function(){
				//has GPS but not working...
				errorGeolocation(flag);
			});
		}
		else {
			//device has no GPS
			flag = false;
			errorGeolocation(flag);
		}
		
		function errorGeolocation(errFlag){
			if (errFlag == true)
			{
				alert("Geolocation service failed.");
			}
			else
			{
				alert("Your device does not support geolocation.");
			}
		}
		alert('return null');
		return '';
	}
	
	
    ////////////////////////////////////////////////
    // phonegap camera code template from
    // http://docs.phonegap.com/en/2.5.0/cordova_camera_camera.md.html
    // API: https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md
    ////////////////////////////////////////////////
    
    // Wait for Cordova to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);

	var photoURI;
    var options;
    // Cordova is ready to be used!
    //
    function onDeviceReady() {
        options = { quality: 50,
			destinationType : Camera.DestinationType.FILE_URI,
			sourceType : Camera.PictureSourceType.CAMERA,
			targetWidth: 500,
			targetHeight: 500,
			allowEdit: true,
			correctOrientation: true,
			encodingType: Camera.EncodingType.JPG,
			saveToPhotoAlbum: true };
		
		photoURI = null;
	//capturePhoto();
			
    }

	// display photo on the page
	function showPhoto(imageURI){
	
      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
	  
	  
	}
	
	// Retrieve and save current GPS location to the given photo
	//
	function savePhotoData(imageURI,shared){
		//retrieve saved photo coords
		var photos = window.localStorage.getItem("photos");
		if(photos!=''){
			photos = JSON.parse(photos);
		}
		else{
			photos = {};
		}
		
		//get current GPS location
		var pos = currentPosition();
		if(pos!=''){
			photos[imageURI].coords = pos;
		}
		else{
			photos[imageURI].coords = '';
		}
		
		photos[imageURI].URI = imageURI;
		photos[imageURI].shared = shared;
		window.localStorage.setItem("photos",JSON.stringify(photos));
	}
	
    // Called when a photo is successfully retrieved
    //
    function onTakePhotoSuccess(imageURI) {
		alert('GET!!');
		photoURI = imageURI;
     
		//display photo
		showPhoto(imageURI);
		
		//save photo coords
		savePhotoData(imageURI,false);
		
    }
	
	function onGetPhotoSuccess(imageURI){
		alert('Get!!! '+imageURI);
		photoURI = imageURI;
		
		//display photo
		showPhoto(imageURI);
		
	}
    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      options.sourceType = Camera.PictureSourceType.CAMERA;
	  options.saveToPhotoAlbum = true;
	  options.allowEdit=true;
      navigator.camera.getPicture(onTakePhotoSuccess, onFail, options);
    }
   
    // A button will call this function
    //
    function getPhoto() {
      // Retrieve image file location from specified source
      options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
	  options.saveToPhotoAlbum = false;
	  options.allowEdit = false;
      navigator.camera.getPicture(onGetPhotoSuccess, onFail, options);
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
	  photoURI = null;
    }
	
	//delete image
	function deletePhoto(){
		if(photoURI != '' && photoURI != null){
			alert('deleting photo '+photoURI);
			window.resolveLocalFileSystemURI(photoURI, resSuccess, resFail);
		}
	}
	
	function resSuccess(fileEntry){
		alert('deleting file '+fileEntry.name);
		fileEntry.remove(rmSuccess,rmFail);
	}
	
	function resFail(message){
		console.log('resolveFileSystemURI failed: '+getFileErrMsg(message.code));
	}
	
	function rmSuccess(){
		  alert('image deleted');
		  //remove photo coords from localStorage
		  var photos = window.localStorage.getItem("photos");
		  if(photos!=''){
			photos = JSON.parse(photos);
			if(photos[photoURI]!=''){
				delete photos[photoURI];
				window.localStorage.setItem("photos",JSON.stringify(photos));
			}
		  }
		  
		  // Get image handle
		  //
		  // var largeImage = document.getElementById('largeImage');

		  // hide image elements
		  //
		  // largeImage.style.display = 'none';
			$('#largeImage').hide();
		  //reset values
		  // largeImage.src = '';
		  photoURI = null;
	}
	
	function rmFail(message){
		alert('image delete failed: '+getFileErrMsg(message.code));
		photoURI=null;
	}
	
	function getFileErrMsg(code){
		var msg = '';       
		switch (e.code)
		{
		case FileError.QUOTA_EXCEEDED_ERR: 
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
        case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
        case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
        case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
        case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
		case FileError.ABORT_ERR:
		msg = 'ABORT_ERR';
		break;
		case FileError.NOT_READABLE_ERR:
		msg = 'NOT_READABLE_ERR';
		break;
		case FileError.ENCODING_ERR:
		msg = 'ENCODING_ERR';
		break;
        case FileError.SYNTAX_ERR:
		msg = 'SYNTAX_ERR';
		break;
		case FileError.TYPE_MISMATCH_ERR:
		msg = 'TYPE_MISMATCH_ERR';
		break;
        case FileError.PATH_EXISTS_ERR:
		msg = 'PATH_EXISTS_ERR';
		break;
        default:
		msg = e.code;
        break; 
		};
	}
	/////////////////////////////////////////////////////
	// upload photo code template from:
	// http://docs.phonegap.com/en/3.1.0/cordova_file_file.md.html#FileTransfer
	/////////////////////////////////////////////////////
	function uploadPhoto(){
		if(photoURI!='' && photoURI!=null){
			//get photoURI's photo coords, if any
			var photos = window.localStorage.getItem("photos");
			photos = JSON.parse(photos);
			
			var pos = photos[photoURI];
			if(pos == ''){
				//try to get current position
				pos = currentPosition();
				if(pos!=''){
					//save photo coords
					savePhotoData(photoURI,true);
				}
				else{
					alert('upload photo error, no geolocation available!');
					return;
				}
			}
			//set upload options
			var uploadOptions = new FileUploadOptions();
			uploadOptions.fileKey="file";            
			uploadOptions.fileName=photoURI.substr(photoURI.lastIndexOf('/')+1);            
			uploadOptions.mimeType="image/jpeg";            
			var params = {};            
			params.coords = pos;            
			//params.value2 = "param";            
			uploadOptions.params = params;            
			var ft = new FileTransfer();            
			ft.upload(photoURI, encodeURI("http://some.server.com/upload.php"), win, fail, uploadOptions);

		}
	}
	function win(r) {
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
	}
	function fail(error) {
	alert("An error has occurred: Code = " + error.code);
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
	}	
	
	//delete from server
	function deleteFromServer(){
	
	}
