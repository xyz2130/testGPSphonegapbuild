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
////////////////////////////////////////////////////////
// deferred object explanation:
// http://stackoverflow.com/questions/12116505/wait-till-a-function-is-finished-until-running-another-function
// http://www.htmlgoodies.com/beyond/javascript/making-promises-with-jquery-deferred.html
// http://sitr.us/2012/07/31/promise-pipelines-in-javascript.html
////////////////////////////////////////////////////////

    // Get current position
	//
	function currentPosition(){
		//start creating promise
		var locationDefer = new $.Deferred();
		
		var flag = new Boolean();
		
		if(navigator.geolocation){
			flag = true;
			
			//get current location
			navigator.geolocation.getCurrentPosition(function(pos){
					locationDefer.resolve(pos);
				}, function(){
					//has GPS but not working...
					alert(1);
					errorGeolocation(flag);
					alert('after geo fail');
					locationDefer.resolve('');
				});
			
			
			
		}
		else {
			//device has no GPS
			flag = false;
			errorGeolocation(flag);
			alert('return null');
			locationDefer.resolve('');
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
		
		return locationDefer.promise();
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
	function getEntryFile(imageURI){
		var deferred = new $.Deferred();
		window.resolveLocalFileSystemURI(imageURI, function(entry){
			deferred.resolve(entry);
		}, function(message){
			console.log('resolveFileSystemURI failed: '+getFileErrMsg(message.code));
			deferred.resolve('');
		});
		return deferred.promise();
	}
	function getLastModDate(imageURI){
		// alert('s1');
		var entry = getEntryFile(imageURI);
		var deferred = new $.Deferred();
		// alert('s2');
		entry.then(function(e){
			e.file(function (f){
				var lastmoddate = f.lastModifiedDate;
				// alert('in save entrylastmod type '+typeof(lastmoddate));
				// alert('in save entrylastmod '+lastmoddate);
				deferred.resolve(lastmoddate);
			},function(){alert('resolve URI failed'); deferred.resolve('');});
		});
		// var lastmoddate = 11111111;
			// alert('in get entrylastmod type '+typeof(lastmoddate));
				// alert('in get entrylastmod '+lastmoddate);
				// deferred.resolve(lastmoddate);
		return deferred.promise();
	}
	function getLocalStorageObj(str){
		var deferred = new $.Deferred();
		 var obj = window.localStorage.getItem(str);
		alert(obj);
		if(obj!=null && obj!=''){
		alert('local exists');
			obj = JSON.parse(obj);
			
			deferred.resolve(obj);
		}
		else{
		alert('local not exists');
			obj = {};
			deferred.resolve(obj);
		}
		return deferred.promise();
	}
	// Retrieve and save current GPS location to the given photo
	//
	function savePhotoData(imageURI,shared){
		var deferred = new $.Deferred();
		//retrieve saved photo coords
		var photos = getLocalStorageObj("photos");
		
		var lastmoddate = getLastModDate(imageURI);
		//get current GPS location
		var pos = currentPosition();
		// var pos = '';
		//wait for geolocation to finish
		
		$.when(photos,lastmoddate,pos).done(function (photos,lastmoddate,pos){
			// alert('something1');
			alert('last '+lastmoddate);
			
			alert('poss '+pos);
			//make new one
			photos[imageURI] = {};
			
			if(pos!=''){
				var d = new Date();
				// alert('something2');
				photos[imageURI].coords = pos;
				photos[imageURI].posDate = d.getTime();
				// alert('sth1');
			}
			else{
				alert('something3');
				photos[imageURI].coords = '';
			}
			// alert('something4');
			photos[imageURI].URI = imageURI;
			photos[imageURI].shared = shared;
			// alert('something5');
			if(lastmoddate!=null){
				alert('lastmodDate '+lastmoddate);
				photos[imageURI].modDate = lastmoddate;
			}
			alert('something6');
			window.localStorage.setItem("photos",JSON.stringify(photos));
			
			var test = getLocalStorageObj("photos");
			test.then(function (tt){
			alert('test '+tt);
				for(var p in tt){
					if(tt.hasOwnProperty(p)) {
						alert(p+', '+tt[p]);
						for(var key in tt[p]){
							if(tt[p].hasOwnProperty(key)){
								alert(key+', '+tt[p][key]);
								
							}
						}
					}
					
				}
			});
			
			
			deferred.resolve();
		});
		
		return deferred.promise();

		
	}
	
    // Called when a photo is successfully retrieved
    //
    function onTakePhotoSuccess(imageURI) {
		alert('GET!! '+imageURI);
		photoURI = imageURI;
     
		//display photo
		$('#imgContainer').show();
		$('#share').show();
		//$('#del').hide();

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
	function removeFile(imgURI){
		var deferred = new $.Deferred();
		//get file entry
		var entry = getEntryFile(imgURI);
		entry.then(function(e){
			e.remove(function (entry) {
				alert('image deleted');
				deferred.resolve();
			},function(message){
				alert('image delete failed: '+getFileErrMsg(parseInt(message.code)));
				deferred.resolve();
			});
		});
		return deferred.promise();
	}
	//delete image
	function deletePhoto(){
	
		var deferred = new $.Deferred();
		
		
		if(photoURI != null && photoURI != ''){
			alert('deleting photo '+photoURI);
			//retrieve saved photo coords
			var photos = getLocalStorageObj("photos");
			
			var lastmoddate = getLastModDate(photoURI);
			
			
			$.when(photos,lastmoddate).done(function (photos,lastmoddate){
				alert('p l, '+photos+' '+lastmoddate);
			
			
				// somehow the removeFail fires instead of removeSuccess which
				// does not fire despite that the file is successfully removed
				
				//get photo data collection from localStorage
				  
				alert('delete localstorage');
				
				if(lastmoddate!=null && lastmoddate!='' && lastmoddate!='Invaid Date'){
					//find the photo with the same last mod time and delete
					var pURI;
					for(var p in photos){
						if(photos.hasOwnProperty(p)){
							alert('for '+p+', '+photos[p]);
							if(photos[p].modDate == lastmoddate){
								alert('get!!! '+p);
								pURI = p;
								break;
							}
						}
					
					}
					
					if(pURI !=null && pURI!= ''){
						alert('del local');
						delete photos[pURI];
						window.localStorage.setItem("photos",JSON.stringify(photos));
					}
					removeFile(photoURI);
					
				}
				  
				$('#imgContainer').hide();
				$('#share').hide();
				$('#del').hide();
				alert('after hide');
				
				photoURI = '';
				
				deferred.resolve();
			});
			
			
		}
		return deferred.promise();
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
			
			var entryLastMod;	
			window.resolveLocalFileSystemURI(photoURI, function (fileEntry) {
				//get last mod date from metadata
				fileEntry.getMetadata(function (metadata){
					entryLastMod = metadata.modificationTime;
				},null);
				
			}, function (message){
				console.log('resolveFileSystemURI failed: '+getFileErrMsg(message.code));
			});
		
			var photos = window.localStorage.getItem("photos");
			  if(photos!=null && photos!=''){
				photos = JSON.parse(photos);
				
				
				if(entryLastMod!=null && entryLastMod!=''){
					//find the photo with the same last mod time
					var pURI;
					for(var p in photos){
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
