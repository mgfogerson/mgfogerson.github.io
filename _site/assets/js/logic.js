//import data
var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
var plateData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

//create my map, center over west coast NA
var mymap = L.map('map').setView([0,0], 2);
var tectonicPlates = new L.LayerGroup();

//create tilelayer, add to mymap
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

//function sizes markers based on magnitude
function markerSize(mag) {
    return Math.sqrt(mag) * 5;
  }
//colors for legend
function getColor(d) {
  return d > 20  ? 'red' :
          d > 15   ? 'yellow' :
          d > 1   ? 'green' :
          d > 0   ? 'blue' :
                    '#FFEDA0';
}
//adding legend coded to depth
var legend = L.control({position: "bottomright" });
legend.onAdd = function(){{
  var div = L.DomUtil.create("div", "info legend");
  labels = ['<strong>Quake Depths</strong>'];
  div.innerHTML += labels.join('<br>');
  grades = [0, 1, 15, 20];
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<br><i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km <br>' : '+');
}
return div;
}};
legend.addTo(mymap)


//adding sized, colored markers to map
d3.json(quakeUrl).then(function(data){
    // console.log(data)
        for (var i = 0; i < data.features.length; i++) {
           
            var lat = data.features[i].geometry.coordinates[0]
            // console.log(lat)
            var lng = data.features[i].geometry.coordinates[1]
            // console.log(lng)
            var coord = [lng, lat]
            L.circleMarker(coord, {
              fillOpacity: 0.75,
              color: "white",
              fillColor: getColor(data.features[i].geometry.coordinates[2]),
              radius: markerSize(data.features[i].properties.mag)
            }).bindPopup("<h3>" + data.features[i].properties.place + "</h3><hr> <h4>Magnitude: " + data.features[i].properties.mag + "</h4> <hr> <h4> Depth (km):" +data.features[i].geometry.coordinates[2] + "</h4>" ).addTo(mymap);
      }
});
d3.json(plateData).then(function(quakedata){
  L.geoJson(quakedata).addTo(mymap);
});