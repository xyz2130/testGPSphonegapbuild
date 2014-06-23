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
					// alert(1);
					errorGeolocation(flag);
					// alert('after geo fail');
					locationDefer.resolve('');
				});



		}
		else {
			//device has no GPS
			flag = false;
			errorGeolocation(flag);
			// alert('return null');
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
				// alert('in file entrylastmod '+lastmoddate);
				// alert('in file '+imageURI);
				for(var key in f){
					if(f.hasOwnProperty(key)){alert(key+', '+f[key]);}
				}
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
		// alert(obj);
		if(obj!=null && obj!=''){
		 //alert('local exists');
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
			// alert('last '+lastmoddate);

			// alert('poss '+pos);
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
			// alert('something6');
			window.localStorage.setItem("photos",JSON.stringify(photos));

			// var test = getLocalStorageObj("photos");
			// test.then(function (tt){
			// alert('test '+tt);
				// for(var p in tt){
					// if(tt.hasOwnProperty(p)) {
						// alert(p+', '+tt[p]);
						// for(var key in tt[p]){
							// if(tt[p].hasOwnProperty(key)){
								// alert(key+', '+tt[p][key]);

							// }
						// }
					// }

				// }
			// });


			deferred.resolve();
		});

		return deferred.promise();


	}

	function getShared(imageURI){
		var deferred = new $.Deferred();
		// alert('getshared');
		var photos = getLocalStorageObj("photos");
		var pURI = getURIfromLocalStorage(imageURI);
		$.when(photos,pURI).done(function (photos,pURI){
			var ret = false;
			//entry exists in local storage
			// alert('photos pURI, '+photos+' '+pURI);
			if(pURI!=null && pURI!=''){
				// if(photos[pURI] != null && photos[pURI] != ''){
				// alert(photos[pURI]);
					ret = photos[pURI].shared;
					// deferred.resolve(ret);
				// }
			}
			//no entry in local storage

				deferred.resolve(ret);


		});
		return deferred.promise();
	}


    // Called when a photo is successfully retrieved
    //
    function onTakePhotoSuccess(imageURI) {
		// alert('GET!! '+imageURI);
		photoURI = imageURI;
     
		//display photo
		$('#imgContainer').show();
		$('#share').show();
		$('#del').show();

		showPhoto(imageURI);

		//save photo coords
		savePhotoData(imageURI,false);

    }

	function onGetPhotoSuccess(imageURI){
		var deferred = new $.Deferred();
		// alert('Get!!! '+imageURI);
		photoURI = imageURI;

		var shared = getShared(imageURI);
		var lastmoddate = getLastModDate(imageURI);
		$.when(shared,lastmoddate).done(function (shared,lastmoddate){
			if(shared == true){
				$('#share-btn').prop('disabled',true);
			}
			else{
				$('#share-btn').prop('disabled',false);
			}

			// alert('lastModDate: '+lastmoddate);
			//display photo
			$('#imgContainer').show();
			$('#share').show();
			$('#del').show();
			showPhoto(imageURI);
			deferred.resolve();
		});
		return deferred;
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
	  options.correctOrientation = true;
      navigator.camera.getPicture(onTakePhotoSuccess, onFail, options);
    }
   
    // A button will call this function
    //
    function getPhoto() {
      // Retrieve image file location from specified source
      options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
	  options.saveToPhotoAlbum = false;
	  options.allowEdit = false;
	  options.correctOrientation = false;
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
				// alert('image deleted');
				deferred.resolve();
			},function(message){
				// alert('image delete failed: '+getFileErrMsg(parseInt(message.code)));
				deferred.resolve();
			});
		});
		return deferred.promise();
	}


	function getURIfromLocalStorage(imgURI){
		var deferred = new $.Deferred();
		// alert("getURIfromLocalStorage->"+imgURI);


		// alert('deleting photo '+photoURI);
		//retrieve saved photo coords
		var photos = getLocalStorageObj("photos");

		var lastmoddate = getLastModDate(imgURI);


		$.when(photos,lastmoddate).done(function (photos,lastmoddate){
			// alert('p l, '+photos+' '+lastmoddate);


			// somehow the removeFail fires instead of removeSuccess which
			// does not fire despite that the file is successfully removed

			//get photo data collection from localStorage

			// alert('delete localstorage');

			if(lastmoddate!=null && lastmoddate!='' && lastmoddate!='Invaid Date'){
				//find the photo with the same last mod time and delete
				// alert('p2');
				var pURI;
				var found = false;
				//check for milliseconds
				var lmd = new Date(lastmoddate);
				if(lmd.getFullYear() - 1970 <=5){
					lastmoddate = lastmoddate *1000;
				}
				
				for(var p in photos){
					if(photos.hasOwnProperty(p)){
						// alert('for '+p+', '+photos[p]+', '+photos[p].modDate);
						// alert(lastmoddate);
						var date = photos[p].modDate;
						var md = new Date(photos[p].modDate);
						if(md.getFullYear() - 1970 <=5){
							date = date *1000;
						}
						
						if(date == lastmoddate || (date-lastmoddate <= 1000 && date - lastmoddate => -1000)){
							// alert('get!!! '+p);
							pURI = p;
							deferred.resolve(pURI);
							found = true;
							break;
						}
					}				
				}
				if(found == false){
					alert('pURI not found');
					deferred.resolve(null);
				}

			}
			else{
			// alert('pURI not found');
				deferred.resolve(null);
			}

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
			var sharedPhotos = getLocalStorageObj("sharedPhotos");
			// var lastmoddate = getLastModDate(photoURI);
			//get photo data collection from localStorage	
			var pURI = getURIfromLocalStorage(photoURI);
			$.when(photos,sharedPhotos,pURI).done(function (photos,sharedPhotos,pURI){
				// alert('p s pu, '+photos+' '+sharedPhotos+' '+pURI);


				// somehow the removeFail fires instead of removeSuccess which
				// does not fire despite that the file is successfully removed


				// alert('delete localstorage');

				// if(lastmoddate!=null && lastmoddate!='' && lastmoddate!='Invaid Date'){
					// // find the photo with the same last mod time and delete
					// var pURI;
					// for(var p in photos){
						// if(photos.hasOwnProperty(p)){
							// // alert('for '+p+', '+photos[p]+', '+photos[p].modDate);
							// var date = photos[p].modDate / 1000;
							// if(date == lastmoddate || date-lastmoddate == 1 || date - lastmoddate == -1){
								// alert('get!!! '+p);
								// pURI = p;
								// break;
							// }
						// }

					// }

					// sharedPhotos.then(function(sharedPhotos){
				if(pURI !=null && pURI!= ''){
					// alert('del local');
					delete photos[pURI];
					delete sharedPhotos[pURI];
					window.localStorage.setItem("photos",JSON.stringify(photos));
					window.localStorage.setItem("sharedPhotos",JSON.stringify(sharedPhotos));
					// for(var p in photos){
						// if(photos.hasOwnProperty(p)) {
							// alert(p+', '+photos[p]);
							// for(var key in photos[p]){
								// if(photos[p].hasOwnProperty(key)){
									// alert(key+', '+photos[p][key]);

								// }
							// }
						// }

					// }
				}

				removeFile(photoURI);

			});
			$('#imgContainer').hide();
			$('#share').hide();
			$('#del').hide();
			// alert('after hide');

			photoURI = '';

			deferred.resolve();
		}

		return deferred.promise();
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
		var deferred = new $.Deferred();

		if(photoURI != null && photoURI != ''){
			// alert('sharing photo '+photoURI);

			var photos = getLocalStorageObj("photos");
			var sharedPhotos = getLocalStorageObj("sharedPhotos");
			// var lastmoddate = getLastModDate(photoURI);
			//get photo data collection from localStorage	
			var pURI = getURIfromLocalStorage(photoURI);

			$.when(photos,sharedPhotos,pURI).done(function (photos,sharedPhotos,pURI){
				// alert('p s pu, '+photos+' '+sharedPhotos+' '+pURI);

				var checkURI = true;
				var checkCoords = true;

				//check pURI in local storage
				if(pURI!=null && pURI!=''){
					checkURI = true;
					alert('pURI null')
				}
				else{
					checkURI = false;
				}

				//pURI exists, but no coords saved
				if(checkURI == true && photos[pURI]!=null && photos[pURI]!=''
				&& (photos[pURI].coords == null || photos[pURI].coords =='')){
					checkCoords = false;
					alert('coords not there')
				}
				else{
					checkCoords = true;
				}

				var sharing = false;

				// alert('checkCoords');
				//no coords data		
				if(checkCoords == false){
					if(confirm('tag and share this photo at current GPS location?')){
						//alert('getting coords...');
						var pos = currentPosition();

						pos.then(function(pos){
							//save new coords to photo data
							if(pos!=null && pos!= ''){

								//create new entry, if none
								if(checkURI == false){
									photos[pURI] = {};
									photos[pURI].URI = pURI;
								}
								photos[pURI].coords = pos;
								sharing = true;
								photos[pURI].shared = true;

							}
							else{
								//alert('sharing failed, no GPS available');
							}
						});

					}
					else{
					//abort sharing
					}
				}	

				//coords already in photo data
				else{
					sharing = true;
					photos[pURI].shared = true;
				}


				if(sharing == true){
					//save to local storage to load on map
					sharedPhotos[pURI] = photos[pURI];
					window.localStorage.setItem("photos",JSON.stringify(photos));


					window.localStorage.setItem("sharedPhotos",JSON.stringify(sharedPhotos));
					//alert('sharing finished');
					//upload to server
					//uploadPhoto();
				}
				else{
					alert('share failed, no coords found');
				}
				deferred.resolve();
			});	
		}	
		return deferred.promise();
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