// Get element references
var onClickPositionView = document.getElementById('onClickPositionView');
var confirmPoints = document.getElementById('confirmPoints');
var clearLines = document.getElementById('clearLines');
var clearAllPoints = document.getElementById('clearAllPoints');
var clearOnePoint = document.getElementById('clearOnePoint');

document.getElementById("btnAlgo1").addEventListener("click", () => {
    document.getElementById("descriptionButton").innerHTML = "Nearest Neighbor"
    document.getElementById("descriptionText").innerHTML = `
    Vom fixen Startknoten aus wird der am wenigsten entfernte Knoten besucht. Von dem
    zweiten Knoten wird dann wieder der am geringsten entfernte Knoten besucht, solange bis
    alle Knoten besucht worden sind. Abschließend wird noch der Startpunkt besucht. So kommt
    es zu einem Hamiltonkreis. Dieses Verfahren wählt so meistens eine kurze Tour, jedoch fast
    nie die Optimale. Ein weiterer Vorteil ist, dass dieser Algorithmus sehr schnell ist.`
});

document.getElementById("btnAlgo2").addEventListener("click", () => {
    document.getElementById("descriptionButton").innerHTML = "Nearest Insertion"
    document.getElementById("descriptionText").innerHTML = `
    Ziel ist es wieder eine relativ kurze Rundreise über alle Knoten zu erhalten. Der Algorithmus
    wählt bei jedem Schritt einen Knoten aus, welcher die geringste Entfernung zu einem
    Knoten hat, welcher auf der bereits vorhandenen Teilroute vorhanden ist. Dieser Punkt wird
    dann in die vorhandene Teilroute so eingebaut, dass diese Teilroute sich am geringsten
    verlängert. Die entstandene Route kann nicht länger sein als die doppelte Strecke der
    optimalen Route.`
});

document.getElementById("btnAlgo3").addEventListener("click", () => {
    document.getElementById("descriptionButton").innerHTML = "Convex Hull"
    document.getElementById("descriptionText").innerHTML = `
    Dieser Algorithmus eignet sich gut, um eine kurze Rundreise zu bestimmen, wenn man die
    Koordinaten der Punkte gegeben hat. Mit einer Adjazenzmatrix ist es eher schwieriger,
    deshalb eignet sich dieser Algorithmus am besten, um auf unserer Webseite ausgeführt zu
    werden.
    Bei diesem Algorithmus werden zuerst die äußersten Punkte miteinander verbunden,
    sodass man einen Kreis um die restlichen inneren Punkte erhält. Danach wird der Kreis “zusammengedrückt”, die Punkte, die weiter außen liegen, werden
    zum Äußeren Kreis hinzugefügt, bis am Ende alle Punkte dem Kreis hinzugefügt wurden.
    Ein großer Vorteil dieses Algorithmus ist, dass es durch das Vorgehen von außen nach
    innen zu einem Art Kreis kommt, die Route wird sich nie überkreuzen. Da es bewiesen ist,
    dass sich die optimale Route niemals kreuzt und auch Convex Hull sich niemals kreuzt,
    schafft es dieser heuristische Algorithmus sehr nahe an die optimale Lösung zu kommen.`
});

document.getElementById("btnAlgo4").addEventListener("click", () => {
    document.getElementById("descriptionButton").innerHTML = "Brute Force"
    document.getElementById("descriptionText").innerHTML = `
    Probiert alle möglichen Routen aus. <br>So wird die bestmögliche Route gefunden. Es ist darauf
    zu achten, dass man nicht alle Routen doppelt ausprobiert. <br>Bei drei Knoten a,b,c ist z.B. a-
    >b->c->a dasselbe wie a->c->b->a.`
});

document.getElementById("btnAlgo5").addEventListener("click", () => {
    document.getElementById("descriptionButton").innerHTML = "Simulated Annealing"
    document.getElementById("descriptionText").innerHTML = `
    Man startet zuerst mit der Nearest Neighbor Route, dann beginnt man zufällig zwei Punkte
    in der Route zu tauschen. Anschließend schaut man, ob sich die Route dadurch verbessert hat oder
    nicht.  <br>Man würde zu einem Punkt kommen, an dem sich die Route nicht mehr verbessern
    kann, aber noch nicht die beste Route ist. Um das so lange wie möglich zu verhindern, wird
    die Route auch kurzzeitig verschlechtert, um dann wieder ein besseres Ergebnis zu
    erreichen.  <br>Es kann jedoch vorkommen, dass einige während der Laufzeit berechneten
    Routen kürzer sind als die final ausgegebene Route, deshalb wird das beste Ergebnis immer
    gespeichert.  <br>Ob die neue Route akzeptiert wird oder nicht, wird wie folgt berechnet: <br>
    Wenn die neue Route kürzer als die alte Route ist, dann wird sie klarerweise akzeptiert,
    ansonsten verwendet man folgende Formel: <br>
    Math.exp(-delta-sigma) > Math.random(). <br>
    Dabei ist -delta die negative Differenz der Länge der neuen Route und der Länge der alten
    Route und sigma ein Toleranzwert, der sich bei jedem Durchgang verringert.`
});

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

// Listener for click
map.on('click', function (e) {
    let color;
    if (markers.length === 0) {
        color = "#E6646E";
    } else {
        color = "#FFC350";
    }

    let marker = new mapboxgl.Marker({
        color: color
    })
        .setLngLat(e.lngLat.wrap())
        .addTo(map);
    let pointWorkAround = [];
    markers.push(marker);
    labels.push(label_counter.toString());
    label_counter++;
    pointWorkAround.push(e.lngLat.lng, e.lngLat.lat);
    points.push(pointWorkAround)
    console.log(points);
});



clearLines.addEventListener("click", () => {
    map.removeLayer("route");
    map.removeSource("route");
});

clearAllPoints.addEventListener("click", () => {
    for(let i = 0; i < markers.length; i++) {
        markers[i].remove();
    }
    labels = [];
    points = [];
    markers = [];
});

clearOnePoint.addEventListener("click", () => {
    markers[markers.length-1].remove();
    markers.pop();
    labels.pop();
    points.pop();
});


confirmPoints.addEventListener("click", () => {
    // Create two-dimensional array
    var matrix = new Array(markers.length+1);
    for(let i = 0; i < markers.length+1; i++) {
        matrix[i] = new Array(markers.length+1);
    }
    // Fill city names
    for(let i = 1; i < markers.length+1; i++) {
        matrix[i][0] = labels[i-1];
        matrix[0][i] = labels[i-1];
    }
    // Fill distances

    for(let i = 1; i < markers.length +1; i++) {
        for(let a = 1; a < markers.length+1; a++) {
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
});

// Gets selected algorithm from bootstrap radio button
function getSelectedAlgorithm() {
    let e = document.getElementById("algorithmchooser");
    let array = e.children;
    for(let i = 0; i < e.children.length; i++) {
        if(e.children[i].checked){
            return e.children[i].value;
        }
    }
}

// Sends POST request to server with adjazenzmatrix
function requestServer(matrix) {
    if(getSelectedAlgorithm() === 'ch'){
        matrix = getSelectedAlgorithm() + JSON.stringify(points);
    }else{
        matrix = getSelectedAlgorithm() + matrix;
    }
    console.log(matrix);
    const url = '/matrix';
    fetch(url, {
        method: 'POST',
        body: matrix,
    })  .then(response => response.text())
        .then(response => {
            // Splits toString() of Cities object and get data
            console.log(response);
            let cityArray;
            let lengthString = response;
            if(getSelectedAlgorithm() === 'ch'){
                // Special pasing for Convex hull because it returns coordinates
                response = response.slice(response.indexOf("sortedCities=[") + 14);
                cityArray = response.split("City{cityName=");
                for(let i = 0; i < cityArray.length; i++){
                    cityArray[i] = cityArray[i].slice(0, cityArray[i].indexOf(',', cityArray[i].indexOf(',', 0) + 2))
                    cityArray[i] = cityArray[i].slice(1, cityArray[i].length-1);
                }
                cityArray.shift();
            }else{
                // Parse all other algorithm results and get id
                response = response.slice(response.indexOf("sortedCities=[") + 14);
                cityArray = response.split("City{cityName=");
                for(let i = 0; i < cityArray.length; i++) {
                    if(cityArray[i].length === 0) {
                        cityArray.shift();
                        i--;
                    }else {
                        cityArray[i] = cityArray[i].slice(1, cityArray[i].indexOf("'", 1));
                    }
                }
            }
            // Get distance from result
            lengthString = lengthString.slice(lengthString.indexOf("Cities{distance=") + 16, lengthString.indexOf(","));
            var lengthFloat = parseFloat(lengthString).toFixed(2)
            onClickPositionView.innerHTML = "Length of the route: " + lengthFloat + " km";
            // Print lines on map
            printLines(cityArray);
    });
}

// Prints Lines between markers on map
async function printLines(cityArray) {
    let all_points = [];

    let city_array_counter = 0;
    for (let i = 0; i < cityArray.length; i++) {
        if(getSelectedAlgorithm() === 'ch'){
            console.log(cityArray);
            console.log(cityArray[city_array_counter]);
            all_points.push(JSON.parse(cityArray[city_array_counter]));
        }else{
            all_points.push(points[labels.indexOf(cityArray[city_array_counter])])
        }
        console.log(all_points);
        city_array_counter++;
        if(i === 0) {
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
            // Add new map layer for the source
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
            });
        }else {
            // Update Source with new coordinates
            map.getSource('route').setData({
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': all_points
                }
            });
        }

        // Wait 500 ms
        await sleep(500);
    }
}

function sleep(ms) {
    // Promise that waits special amount of times
    return new Promise(resolve =>  setTimeout(resolve, ms));
}


// haversine distance calculates distance between coordinates with earth rounding included
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
