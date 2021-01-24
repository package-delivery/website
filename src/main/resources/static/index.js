// Get element references
var addPoint = document.getElementById('addPoint');
var onClickPositionView = document.getElementById('onClickPositionView');
var confirmPoints = document.getElementById('confirmPoints');
var clearPoints = document.getElementById('clearPoints');

// Initialize locationPicker plugin
var lp = new locationPicker('map', {
    // You can omit this, defaults to true
    setCurrentPosition: true,
}, {
    // You can set any google map options here, zoom defaults to 15
    zoom: 5
});

var positions = [];
var marker = [];
var labels = []
var locationCounter = 0;
const alphabet = "abcdefghijklmnopqrstuvwxyz";

// Listen to button onclick event
//addPoint.onclick = function () {
    // Get current location and show it in HTML
    //var location = lp.getMarkerPosition();
    //onClickPositionView.innerHTML = 'The chosen location is ' + location.lat + '° lat, ' + location.lng + '° lng';
    //const p = {lat: location.lat, lng: location.lng};
    //const mk1 = new google.maps.Marker({position: p, map: lp.map, label: alphabet[locationCounter]})
    //marker.push(mk1)
    //labels.push(alphabet[locationCounter]);
    //locationCounter++;
    //positions.push(p);
//};

clearPoints.onclick = function () {
    location.reload();
}


confirmPoints.onclick = function() {
    /*
    for(let i = 0; i < positions.length; i++) {
        const mk1 = new google.maps.Marker({position: positions[i], map: lp.map});
        const mk2 = new google.maps.Marker({position: positions[i+1], map: lp.map});
        //var line = new google.maps.Polyline({path: [positions[i], positions[i+1]], map: lp.map});
    }
    */

    // Create two-dimensional array
    var matrix = new Array(positions.length+1);
    for(let i = 0; i < positions.length+1; i++) {
        matrix[i] = new Array(positions.length+1);
    }
    // Fill city names
    for(let i = 1; i < positions.length+1; i++) {
        matrix[i][0] = alphabet[i-1];
        matrix[0][i] = alphabet[i-1];
    }
    // Fill distances
    for(let i = 1; i < positions.length +1; i++) {
        for(let a = 1; a < positions.length+1; a++) {
            const mk1 = new google.maps.Marker({position: positions[a-1], map: lp.map, label: alphabet[locationCounter]});
            const mk2 = new google.maps.Marker({position: positions[i-1], map: lp.map, label: alphabet[locationCounter]});
            matrix[i][a] = haversine_distance(mk1, mk2) * 1.609;
            // Remove marker
            mk1.setMap(null);
            mk2.setMap(null);
        }
    }
    // Add newline at the beginning of every line
    for(let i = 1; i < matrix.length; i++) {
        matrix[i][0] = '\n' + matrix[i][0];
    }


    // Send request to server with matrix
    requestServer(matrix);
};

function requestServer(matrix) {
    let e = document.getElementById("algorithmchooser");
    matrix = e.value + matrix;
    if(e.value === "ch")
    console.log(matrix);
    const url = '/matrix';
    fetch(url, {
        method: 'POST',
        body: matrix,
    })  .then(response => response.text())
        .then(response => {
            console.log(response);
            let lengthString = response;
            response = response.slice(response.indexOf("sortedCities=[") + 14);
            let cityArray = response.split("City{cityName=");
            for(let i = 0; i < cityArray.length; i++) {
                if(cityArray[i].length === 0) {
                    cityArray.shift();
                    i--;
                }else {
                    cityArray[i] = cityArray[i].slice(1, cityArray[i].indexOf("'", 1));
                }
            }

            lengthString = lengthString.slice(lengthString.indexOf("Cities{distance=") + 16, lengthString.indexOf(","));
            var lengthFloat = parseFloat(lengthString).toFixed(2)
            onClickPositionView.innerHTML = "Length of the route: " + lengthFloat + " km";
            printLines(cityArray);
    });
}

function printLines(cityArray) {
    let waiting_time = 0;
    for(let i = 0; i < cityArray.length-1; i++) {
        let counter = labels.indexOf(cityArray[i]);
        let counter1 = labels.indexOf(cityArray[i+1]);
        setTimeout(() => {
            var line = new google.maps.Polyline({path: [positions[counter], positions[counter1]], map: lp.map});
        }, waiting_time);
        waiting_time = waiting_time + 500;
    }
}


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