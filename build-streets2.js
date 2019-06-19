
//access token taken from mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbWFuOTciLCJhIjoiY2p3ODMwZmVjMDJ4ajN6bWxyZXB6OHVlNyJ9.Un8GIVGSdU-muWmDs08VXw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/salman97/cjwad1kfv0xwa1cogsivi0y3a',   //style id
    center: [77.60, 12.98], // starting position [lng, lat]
    zoom: 14 // starting zoom
});

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
  placeholder: '         Search for dustbins in locality'

});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


//Code for showing popup on clicking marker
/*map.on('click', function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['example'] // replace this with the name of the layer
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];
  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML('<h3>' + feature.properties.title + '</h3><p>' + feature.properties.description + '</p>')
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);
});
*/

//popup on click for adding a new dustbin
map.on('click', function(e) {
  var popup = new mapboxgl.Popup({closeOnClick: true})
.setLngLat(e.lngLat)
.setHTML('<h2>Add a Dustbin</h2><form><h3>Name<br><input type="text"><br><br><h3>Size<br><input type="radio" name="size" checked>Small<br><input type="radio" name="size">Medium<br><input type="radio" name="size">Large<br><br><h3>Please upload an image of the dustbin<br><input type="file" accept="image/*" capture="camera" required><br><br><input type="submit" value="Submit"></form>')
.addTo(map);

});

/*
map.on('load', function() {
    map.loadImage('https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png', function(error, image) {
      if (error) throw error;
      map.addImage('marker', image);
      map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": {
        "type": "geojson",
        "data": {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "message": "Test data"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          77.60587692260742,
          13.055514119975356
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "message": "Test data"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          77.58510589599608,
          13.02763836258297
        ]
      }
    }

  ]
          }
      },
      
      "layout": {
      "icon-image": "marker",
      "icon-size": 0.1
      }
    });
  });
});
*/

  
function init(){
  map.addSource("dustbins", {
  type: 'geojson',
  data: 'dustbins.geojson'

});

};

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
    .setHTML('<h3>' + feature.properties.message + '</h3>')
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);
});
});



