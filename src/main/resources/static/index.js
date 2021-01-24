// Get element references
var onClickPositionView = document.getElementById('onClickPositionView');
var confirmPoints = document.getElementById('confirmPoints');
var clearPoints = document.getElementById('clearPoints');

// Initialize MapBox map
mapboxgl.accessToken = 'pk.eyJ1Ijoia2FmZmFyZWxsIiwiYSI6ImNra2Jlbnh0bTA0OW0ydnFybmhxbjlteWcifQ.pue0gPKhUWGDHYIhRXECzQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});


let markers = [];
let points = [];
let labels = [];
let label_counter = 0;
const alphabet = "abcdefghijklmnopqrstuvwxyz";


// Listener for click
map.on('click', function (e) {
    let color;
    if (markers.length === 0) {
        color = "#FF8C00";
    } else {
        color = "#3FB1CE";
    }

    let marker = new mapboxgl.Marker({
        color: color
    })
        .setLngLat(e.lngLat.wrap())
        .addTo(map);
    let pointWorkAround = [];
    markers.push(marker);
    labels.push(alphabet[label_counter]);
    label_counter++;
    pointWorkAround.push(e.lngLat.lng, e.lngLat.lat);
    points.push(pointWorkAround)
    console.log(points);
});



clearPoints.onclick = function () {
    location.reload();
}


confirmPoints.onclick = function() {
    // Create two-dimensional array
    var matrix = new Array(markers.length+1);
    for(let i = 0; i < markers.length+1; i++) {
        matrix[i] = new Array(markers.length+1);
    }
    // Fill city names
    for(let i = 1; i < markers.length+1; i++) {
        matrix[i][0] = alphabet[i-1];
        matrix[0][i] = alphabet[i-1];
    }
    // Fill distances
    
    for(let i = 1; i < markers.length +1; i++) {
        for(let a = 1; a < markers.length+1; a++) {
            //const mk1 = new google.maps.Marker({position: positions[a-1], map: lp.map, label: alphabet[locationCounter]});
            //const mk2 = new google.maps.Marker({position: positions[i-1], map: lp.map, label: alphabet[locationCounter]});
            const mk1 = markers[a-1].getLngLat();
            const mk2 = markers[i-1].getLngLat();
            // Calculate distance
            matrix[i][a] = haversine_distance(mk1, mk2) * 1.609;
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

async function printLines(cityArray) {
    // Draw lines
    let delay = 500;
    let all_points = [];

    let city_array_counter = 0;
    for (let i = 0; i < cityArray.length; i++) {
        all_points.push(points[labels.indexOf(cityArray[city_array_counter])])
        city_array_counter++;
        // Add source with coordinates
        map.addSource('route', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': all_points
                }
            }
        });

        // Add layer with source 
        map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#888',
                'line-width': 4
            }
        });;
        await sleep(500);
        if(i != cityArray.length-1){
            map.removeLayer('route');
            map.removeSource('route');
        }
    }
}

function sleep(ms) {
    return new Promise(resolve =>  setTimeout(resolve, ms));
}


function haversine_distance(mk1, mk2) {
    // Radius of the Earth in miles
    var R = 3958.8;
    // Convert degrees to radians
    var rlat1 = mk1.lat * (Math.PI/180);
    // Convert degrees to radians
    var rlat2 = mk2.lat * (Math.PI/180);
    // Radian difference (latitudes)
    var difflat = rlat2-rlat1;
    // Radian difference (longitudes)
    var difflon = (mk2.lng-mk1.lng) * (Math.PI/180);

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
}


// https://developers.google.com/maps/documentation/javascript/markers
// https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
// https://developers.google.com/maps/documentation/maps-static/get-api-key