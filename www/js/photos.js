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
		var lastmoddate;
		window.resolveLocalFileSystemURI(imageURI, function(entry){
			entry.getMetadata(function (metadata){
				lastmoddate = metadata.modificationTime;
			},null);
		}, function(message){
			console.log('resolveFileSystemURI failed: '+getFileErrMsg(message.code));
		});
		if(photos!=''){
			photos = JSON.parse(photos);
		}
		else{
			photos = {};
		}
		
		//get current GPS location
		var pos = currentPosition();
		if(pos!=''){
			var d = new Date();
			
			photos[imageURI].coords = pos;
			photos[imageURI].posDate = d.getTime();
		}
		else{
			photos[imageURI].coords = '';
		}
		
		photos[imageURI].URI = imageURI;
		photos[imageURI].shared = shared;
		
		if(lastmoddate!=null){
			alert('lastmodDate '+lastmoddate);
			photos[imageURI].modDate = lastmoddate;
		}
		window.localStorage.setItem("photos",JSON.stringify(photos));
	}
	
    // Called when a photo is successfully retrieved
    //
    function onTakePhotoSuccess(imageURI) {
		alert('GET!! '+imageURI);
		photoURI = imageURI;
     
		//display photo
		$('#imgContainer').show();
		$('#share').show();
		$('#del').hide();

		showPhoto(imageURI);
		
		//save photo coords
		savePhotoData(imageURI,false);
		
    }
	
	function onGetPhotoSuccess(imageURI){
		alert('Get!!! '+imageURI);
		photoURI = imageURI;
		
		//display photo
		$('#imgContainer').show();
		$('#share').show();
		$('#del').show();
		showPhoto(imageURI);
		
	}
    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      options.sourceType = Camera.PictureSourceType.CAMERA;
	  options.saveToPhotoAlbum = true;
	  options.allowEdit=true;
	  options.targetWidth = 500;
	  options.targetHeight = 500;
      navigator.camera.getPicture(onTakePhotoSuccess, onFail, options);
    }
   
    // A button will call this function
    //
    function getPhoto() {
      // Retrieve image file location from specified source
      options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
	  options.saveToPhotoAlbum = false;
	  options.allowEdit = false;
	  delete options.targetWidth;
	  delete options.targetHeight;
      navigator.camera.getPicture(onGetPhotoSuccess, onFail, options);
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
	  delete photoURI;
    }
	
	//delete image
	function deletePhoto(){
		if(photoURI != null && photoURI != ''){
			alert('deleting photo '+photoURI);
			var photoEntry;
			window.resolveLocalFileSystemURI(photoURI, function (fileEntry) {
				alert('deleting file '+fileEntry.fullPath);
				alert('file url '+fileEntry.toURL());
				photoEntry = fileEntry;
				fileEntry.remove(function (entry) {
					alert('image deleted');
				  
				},function(message){
					alert('image delete failed: '+getFileErrMsg(message.code));
				});
				delete photoURI;
				$('#imgContainer').hide();
				$('#share').hide();
				$('#del').hide();
				
				// somehow the removeSuccess (or removeFail for that matter)
				// does not fire despite that the file is successfully removed
				// so the associated photo data is deleted here, at URI resolve success
				
				//get photo data collection from localStorage
				  var photos = window.localStorage.getItem("photos");
				  if(photos!=null && photos!=''){
					photos = JSON.parse(photos);
					alert('delete localstorage');
					//get last mod date from metadata
					var entryLastMod;
					photoEntry.getMetadata(function (metadata){
						entryLastMod = metadata.modificationTime;
						alert('entrylastmod '+entryLastMod.getTime());
					},null);
					
					if(entryLastMod!=null && entryLastMod!=''){
						//find the photo with the same last mod time and delete
						var pURI;
						for(p in photos){
						alert('for '+p.URI);
							if(p.modDate.getTime() == entryLastMod.getTime()){
								pURI = p;
								break;
							}
						}
					
						if(pURI !=null && pURI!= ''){
						alert('del local');
							delete photos[pURI.URI];
							window.localStorage.setItem("photos",JSON.stringify(photos));
						}
					}
				  }
			}, function (message){
				console.log('resolveFileSystemURI failed: '+getFileErrMsg(message.code));
				alert('resolveFileSystemURI failed: '+getFileErrMsg(message.code));
			});
		}
	}
	
	function resSuccess(fileEntry){
		alert('deleting file '+fileEntry.fullPath);
		fileEntry.remove(rmSuccess,rmFail);
		delete photoURI;
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
			$('#imgContainer').hide();
			$('#share').hide();
			$('#del').hide();
		  //reset values
		  // largeImage.src = '';
		  //photoURI = null;
	}
	
	function rmFail(message){
		alert('image delete failed: '+getFileErrMsg(message.code));
		//photoURI=null;
	}
	
	function getFileErrMsg(code){
		var msg = '';       
		switch (code)
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
		msg = code;
        break; 
		}
		return msg;
	}
	
	function shareOnMap(){
		if(photoURI != null && photoURI != ''){
			alert('sharing photo '+photoURI);
			var photoEntry;
			window.resolveLocalFileSystemURI(photoURI, function (fileEntry) {
				
				photoEntry = fileEntry;
				
			}, function (message){
				console.log('resolveFileSystemURI failed: '+getFileErrMsg(message.code));
			});
		
			var photos = window.localStorage.getItem("photos");
			  if(photos!=null && photos!=''){
				photos = JSON.parse(photos);
				
				//get last mod date from metadata
				var entryLastMod;
				photoEntry.getMetadata(function (metadata){
					entryLastMod = metadata.modificationTime;
				},null);
				
				if(entryLastMod!=null && entryLastMod!=''){
					//find the photo with the same last mod time
					var pURI;
					for(p in photos){
						if(p.modDate.getTime() == entryLastMod.getTime()){
							pURI = p;
							break;
						}
					}
					
					if(pURI !=null && pURI!= ''){
						var sharing = false;
						
						//check for photo's coord, if none, get the current one
						if(pURI.coords == null || pURI.coords ==''){
							alert('getting coords');
							var pos = currentPosition();
							
							//save new coords to photo data
							if(pos!=null && pos!= ''){
								pURI.coords = pos;
								sharing = true;
								pURI.shared = true;
								
							}
							else{
								
								sharing = false;
							}
						}
						//coords already in photo data
						else{
							sharing = true;
							pURI.shared = true;
						}
						
						
						if(sharing == true){
							photos[pURI.URI] = pURI;
							window.localStorage.setItem("photos",JSON.stringify(photos));
							
							//save to local storage to load on map
							var sharedPhotos = window.localStorage.getItem("sharedPhotos");
							if(sharedPhotos == null || sharedPhotos == ''){
								sharedPhotos = {};
							}
							else{
								sharedPhotos = JSON.parse(sharedPhotos);
							}
							sharedPhotos[pURI.URI] = pURI;
							window.localStorage.setItem("sharedPhotos",JSON.stringify(sharedPhotos));
							
							//upload to server
							//uploadPhoto();
						}
						else{
							alert('share failed, no coords found');
						}
						
					}
					else{
						alert('sharing failed: photo data not found');
					}
					
				}
				else{
					alert('sharing failed: photo last date invalid');
				}
				
			}
			else{
				alert('sharing failed: photo data collection invalid');
			}
		}
		else{
			alert('sharing failed: photoURI invalid');
		}
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
			//uploadOptions.fileName=photoURI.substr(photoURI.lastIndexOf('/')+1);            
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
