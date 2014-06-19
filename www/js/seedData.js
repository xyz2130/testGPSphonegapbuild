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
  var photodummy = { URI:'content://media/external/images/media/19928',
					 coords: {longitude:170.33416166666666,latitude:-45.871478333333336},
					 shared: true,
					 };
  if(s!='' && s!=null){
    s = JSON.parse(s);
    s[photodummy.URI] = photodummy;
  }
  else{
    s = {};
	s[photodummy.URI] = photodummy;
  }
  window.localStorage.setItem("sharedPhotos",JSON.stringify(s));