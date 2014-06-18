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
    
    ////////////////////////////////////////////////
    // phonegap camera code template from
    // http://docs.phonegap.com/en/2.5.0/cordova_camera_camera.md.html
    // API: https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md
    ////////////////////////////////////////////////
    
    //var pictureSource;   // picture source
    
    // Wait for Cordova to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    var options;
    // Cordova is ready to be used!
    //
    function onDeviceReady() {
        options = { quality: 50,
			destinationType : Camera.DestinationType.FILE_URI,
			sourceType : Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPG,
			saveToPhotoAlbum: true };
			
	capturePhoto();
			
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);
alert('GET!!');
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

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      options.sourceType = Camera.PictureSourceType.CAMERA;
      navigator.camera.getPicture(onPhotoURISuccess, onFail, options);
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit
      options.sourceType = Camera.PictureSourceType.CAMERA;
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, options);
    }

    // A button will call this function
    //
    function getPhoto() {
      // Retrieve image file location from specified source
      options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
      navigator.camera.getPicture(onPhotoURISuccess, onFail, options);
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
    }
