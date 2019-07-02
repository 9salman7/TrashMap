// Get the snackbar DIV

  // Add the "show" class to DIV

  // After 3 seconds, remove the show class from DIV
var x = document.getElementById("snackbar");
x.className = "show";
setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
/*
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbWFuOTciLCJhIjoiY2p3ODMwZmVjMDJ4ajN6bWxyZXB6OHVlNyJ9.Un8GIVGSdU-muWmDs08VXw';
if ("geolocation" in navigator) { 
    navigator.geolocation.getCurrentPosition(position => { 
        var map = new mapboxgl.Map({
        // container id specified in the HTML
          container: 'map',

           // style URL
         style: 'mapbox://styles/salman97/cjwad1kfv0xwa1cogsivi0y3a',

         // initial position in [lon, lat] format
          center: [position.coords.longitude, position.coords.latitude],

         // initial zoom

         zoom: 14
        });
    currLat=position.coords.latitude;
    
    }); 
}*/

//access token taken from mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbWFuOTciLCJhIjoiY2p3ODMwZmVjMDJ4ajN6bWxyZXB6OHVlNyJ9.Un8GIVGSdU-muWmDs08VXw';



//initializing map
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/salman97/cjwad1kfv0xwa1cogsivi0y3a',   //style id
    center: [77.5891776061,12.986453], // starting position [lng, lat]
    zoom: 14 // starting zoom
});

//adding navigation controls to map
map.addControl(new mapboxgl.NavigationControl());

//initialization of directions
var mapDirections = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    controls: {
        inputs: false
    }
  }
)

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
  bbox: [77.46517479843749,12.846706261537818, 77.7652388853515513, 13.122370423656735],   //boundary region
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: 'Search for the nearest dustbin in locality (try it!)'
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

/*UNCOMMENT LATER
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
});*/

//adding geojson source
function init(){
  map.addSource("dustbins", {
  type: 'geojson',
  data: 'bins3.geojson'
  });

};


//function for directions/navigation
function buttonControl(flg,flt) {
  console.log("Button works");
  navigator.geolocation.getCurrentPosition(position => {  
  currLat=position.coords.latitude;
  currLon=position.coords.longitude;
  mapDirections.setOrigin([currLon,currLat])
  mapDirections.setDestination([flg,flt])
  map.addControl(mapDirections, 'bottom-right');
  
  }); 
}

//wait for style to load
map.once('style.load', function(e) {
 

    init();
    map.loadImage('recycle-bin.png', function(error, image) {
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
  
  //render feature if they exist
  map.on('click', function(e) {
    map.flyTo({
      center: e.lngLat,
      zoom:17
    });
    var features = map.queryRenderedFeatures(e.point, {
    layers: ['points'] // replace this with the name of the layer
    });
    if (!features.length) {
     return;
    }

    var feature = features[0];
    var featCoor=feature.geometry.coordinates;
    flt=featCoor[1];
    flg=featCoor[0];
    map.flyTo({
      center: featCoor,
      zoom: 17
    });
    var popup = new mapboxgl.Popup({ offset: [0, -15] })
     .setLngLat(feature.geometry.coordinates)
     //.setHTML('<h3>' + feature.properties.city + '</h3>')
     .setHTML('<h2>'+feature.properties.city+'</h2><button type="button" onclick="buttonControl(flg,flt)">Navigate to this dustbin</button>')
     .setLngLat(feature.geometry.coordinates)
     .addTo(map);
  });

  //empty source for nearest dustbins
  map.addSource('single-point', {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [] // Notice that initially there are no features
  }
  });
  
  //red mark that comes on searching
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

  //result of geocoder
  geocoder.on('result', function(ev) {
    var features = map.queryRenderedFeatures(e.point, {
    layers: ['points'] // replace this with the name of the layer
    });
    if (!features.length) {
     return;
    }

    var feature = features[0];
    
    var searchResult = ev.result.geometry;
    map.getSource('single-point').setData(searchResult);
    var options = { units: 'miles' };
    features.forEach(function(bin) {
    Object.defineProperty(bin.properties, 'distance', {
      value: turf.distance(searchResult, bin.geometry, options),
      writable: true,
      enumerable: true,
      configurable: true
      });
    });

  features.sort(function(a, b) {
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
    var lats = [features[binIdentifier].geometry.coordinates[1], searchResult.coordinates[1]];
    var lons = [features[binIdentifier].geometry.coordinates[0], searchResult.coordinates[0]];

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
  
  //create popup for the nearest dustbin
  var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    var featCoor=features[0].geometry.coordinates;
    flt=featCoor[1];
    flg=featCoor[0];

    var popup = new mapboxgl.Popup({  })
      .setLngLat(features[0].geometry.coordinates)
      .setHTML('<h3>Nearest Dustbin</h3><br><button type="button" onclick="buttonControl(flg,flt)">Navigate to this dustbin</button>')
      .addTo(map);

  });
});  //end of map.on(style.load)


