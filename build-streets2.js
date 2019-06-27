
//access token taken from mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbWFuOTciLCJhIjoiY2p3ODMwZmVjMDJ4ajN6bWxyZXB6OHVlNyJ9.Un8GIVGSdU-muWmDs08VXw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/salman97/cjwad1kfv0xwa1cogsivi0y3a',   //style id
    center: [77.60, 12.98], // starting position [lng, lat]
    zoom: 14 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


//Geocontrol option
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    trackUserLocation: true
}));

//Geocoder code (search bar) see CSS on map-streets.html for altering position 
var geocoder = new MapboxGeocoder({ // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: '       Search for dustbins in locality'

});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

 function get_action(form) {
        console.log("something")
    }


//popup on click for adding a new dustbin
/*map.on('click', function(e) {
  var popup = new mapboxgl.Popup({closeOnClick: true})
.setLngLat(e.lngLat)
.setHTML('<h2>Add a Dustbin</h2><form onsubmit="get_action(this);"><h3>Name<br><input type="text"><br><br><h3>Size<br><input type="radio" name="size" checked>Small<br><input type="radio" name="size">Medium<br><input type="radio" name="size">Large<br><br><h3>Please upload an image of the dustbin<br><input type="file" accept="image/*" capture="camera" required><br><br><input type="submit" value="Submit"></form>')
.addTo(map);

});*/

/*map.on('click', function(e) {
  var popup = new mapboxgl.Popup({closeOnClick: true})
.setLngLat(e.lngLat)
.setHTML('<h2>Add a Dustbin</h2><form action="mongotest.html"><h3>Name<br><input type="text"><br><br><h3>Size<br><input type="radio" name="size" checked>Small<br><input type="radio" name="size">Medium<br><input type="radio" name="size">Large<br><br><h3>Please upload an image of the dustbin<br><input type="file" accept="image/*" capture="camera" required><br><br><input type="submit" value="Submit"></form>')
.addTo(map);

});*/

map.on('click', function(e) {
  var popup = new mapboxgl.Popup({closeOnClick: true})
.setLngLat(e.lngLat)
.setHTML('<h2>Add a Dustbin</h2><form action="pythontest.py" method="get"><input type="hidden" name="lati" id="lt"/><input type="hidden" name="long" id="ln"/><h3>Size<br><input type="radio" name="size" value="small" checked>Small<br><input type="radio" name="size" value="medium">Medium<br><input type="radio" name="size" value="large">Large<br><br><h3>Please upload an image of the dustbin<br><input type="file" accept="image/*" capture="camera" ><br><br><input type="submit" value="Submit"></form>')
.addTo(map);
var latitude=e.lngLat.lat;
var longitude=e.lngLat.lng;
  console.log(longitude);
  document.getElementById("lt").value=latitude;
  document.getElementById("ln").value=longitude;
});

function init(){
  map.addSource("dustbins", {
  type: 'geojson',
  data: 'bins.geojson'

});

};

/*
function myFunction() {
  jQuery.get("pythontest.py");
};*/


map.once('style.load', function(e) {
    init();
    map.loadImage('marker.png', function(error, image) {
      if (error) throw error;
      map.addImage('marker', image);
      map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": "dustbins",
         "layout": {
      "icon-image": "marker",
      "icon-size": 0.1
      }
    });
  });
  
  map.on('click', function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['points'] // replace this with the name of the layer
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];
  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML('<h3>' + feature.properties.city + '</h3>')
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);
});
 
});
/*
map.once(style.load, function(e) {
   map.addSource('single-point', {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [] // Notice that initially there are no features
  }
});

map.addLayer({
  id: 'point',
  source: 'single-point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': 'red',
    'circle-stroke-width': 3,
    'circle-stroke-color': '#fff'
  }
});
geocoder.on('result', function(ev) {
  
  var searchResult = ev.result.geometry;
  map.getSource('single-point').setData(searchResult);
  var options = { units: 'miles' };
  dustbins.features.forEach(function(bin) {
  Object.defineProperty(bin.properties, 'distance', {
    value: turf.distance(searchResult, bin.geometry, options),
    writable: true,
    enumerable: true,
    configurable: true
  });

});
  dustbins.features.sort(function(a, b) {
  if (a.properties.distance > b.properties.distance) {
    return 1;
  }
  if (a.properties.distance < b.properties.distance) {
    return -1;
  }
  // a must be equal to b
  return 0;
});
function sortLonLat(binIdentifier) {
  var lats = [dustbins.features[binIdentifier].geometry.coordinates[1], searchResult.coordinates[1]];
  var lons = [dustbins.features[binIdentifier].geometry.coordinates[0], searchResult.coordinates[0]];

  var sortedLons = lons.sort(function(a, b) {
    if (a > b) {
      return 1;
    }
    if (a.distance < b.distance) {
      return -1;
    }
    return 0;
  });
  var sortedLats = lats.sort(function(a, b) {
    if (a > b) {
      return 1;
    }
    if (a.distance < b.distance) {
      return -1;
    }
    return 0;
  });

  map.fitBounds([
    [sortedLons[0], sortedLats[0]],
    [sortedLons[1], sortedLats[1]]
  ], {
    padding: 100
  });
}

sortLonLat(0);
createPopUp(dustbins.features[0]);


});
});*/


