// Get element references
var confirmBtn = document.getElementById('confirmPosition');
var onClickPositionView = document.getElementById('onClickPositionView');
var printPositions = document.getElementById('printPositions');

// Initialize locationPicker plugin
var lp = new locationPicker('map', {
    // You can omit this, defaults to true
    setCurrentPosition: true, 
}, {
    // You can set any google map options here, zoom defaults to 15
    zoom: 5 
});

var positions = [];
var locationCounter = 0;
const alphabet = "abcdefghijklmnopqrstuvwxyz";

// Listen to button onclick event
confirmBtn.onclick = function () {
    // Get current location and show it in HTML
    var location = lp.getMarkerPosition();
    onClickPositionView.innerHTML = 'The chosen location is ' + location.lat + ',' + location.lng;
    const p = {lat: location.lat, lng: location.lng};
    const mk1 = new google.maps.Marker({position: p, map: lp.map, label: alphabet[locationCounter]})
    locationCounter++;
    positions.push(p);
};


printPositions.onclick = function() {
    console.log(positions);
    /*
    for(let i = 0; i < positions.length; i++) {
        const mk1 = new google.maps.Marker({position: positions[i], map: lp.map});
        const mk2 = new google.maps.Marker({position: positions[i+1], map: lp.map});
        //var line = new google.maps.Polyline({path: [positions[i], positions[i+1]], map: lp.map});
    }
    */

    // Create two-dimensional array
    var matrix = new Array(positions.length);
    for(let i = 0; i < positions.length; i++) {
        matrix[i] = new Array(positions.length);
    }
    // Fill city names
    for(let i = 1; i < positions.length; i++) {
        matrix[i][0] = alphabet[i-1];
        matrix[0][i] = alphabet[i-1];
    }
    // Fill distances
    for(let i = 1; i < positions.length; i++) {
        for(let a = 1; a < positions.length; a++) {
            const mk1 = new google.maps.Marker({position: positions[a], map: lp.map, label: alphabet[locationCounter]});
            const mk2 = new google.maps.Marker({position: positions[i], map: lp.map, label: alphabet[locationCounter]});
            matrix[i][a] = haversine_distance(mk1, mk2);
        }
    }
    console.log(matrix);
};


function haversine_distance(mk1, mk2) {
    // Radius of the Earth in miles
    var R = 3958.8; 
    // Convert degrees to radians
    var rlat1 = mk1.position.lat() * (Math.PI/180); 
    // Convert degrees to radians
    var rlat2 = mk2.position.lat() * (Math.PI/180); 
    // Radian difference (latitudes)
    var difflat = rlat2-rlat1; 
    // Radian difference (longitudes)
    var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); 

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
}

// https://developers.google.com/maps/documentation/javascript/markers
// https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
// https://developers.google.com/maps/documentation/maps-static/get-api-key