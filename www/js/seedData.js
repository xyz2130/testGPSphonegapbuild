

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

var t = window.localStorage.getItem("tracks");
  if(t!='' && t!=null){
    t = JSON.parse(t);
    t['dummy'] = dummy_data;
  }
  else{
    t = {dummy:dummy_data};
  }
  window.localStorage.setItem("tracks",JSON.stringify(t));
  
  var s = window.localStorage.getItem("sharedPhotos");
  var photodummy = { URI:'../images/IMG_0052.jpg',
					 coords: {longitude:174.790464,latitude:-41.295845},
					 shared: true,
					 };
var photodummy2 = { URI:'../images/IMG_0061.jpg',
					 coords: {longitude:174.790474,latitude:-41.294285},

					 shared: true,
					 };
 var photodummy3 = { URI:'../images/IMG_0067.jpg',
					 coords: {longitude:174.791099,latitude:-41.294073},


					 shared: true,
					 };
  if(s!='' && s!=null){
    s = JSON.parse(s);
    s[photodummy.URI] = photodummy;
	s[photodummy2.URI] = photodummy2;
	s[photodummy3.URI] = photodummy3;
  }
  else{
    s = {};
	s[photodummy.URI] = photodummy;
	s[photodummy2.URI] = photodummy2;
	s[photodummy3.URI] = photodummy3;
  }
  window.localStorage.setItem("sharedPhotos",JSON.stringify(s));