let marker;
let currentIndex = 0;
let actualLocationMarker;
let currentMarkerPosition = null;
let circles = [];
let totalScore = 0;
let polyline;
const asturiasLocations = [
    {
        name: "Cangas del Narcea",
        photoUrl: "multimedia/CangasNarcea.jpg",
        latitude: 43.1767,
        longitude: -6.5500 // Cangas del Narcea
    },
    {
        name: "Llanes",
        photoUrl: "multimedia/Llanes.jpg",
        latitude: 43.4177,
        longitude: -4.7533 // Llanes
    },
    {
        name: "Oviedo",
        photoUrl: "multimedia/Oviedo.jpg",
        latitude: 43.3619,
        longitude: -5.8452 // Oviedo
    },
    {
        name: "Gijón",
        photoUrl: "multimedia/Gijon.jpg",
        latitude: 43.5350,
        longitude: -5.6613 // Gijón
    },
    {
        name: "Avilés",
        photoUrl: "multimedia/Aviles.jpg",
        latitude: 43.5588,
        longitude: -5.9252 // Avilés
    },
    {
        name: "Mieres",
        photoUrl: "multimedia/Mieres.jpg",
        latitude: 43.2373,
        longitude: -5.7298 // Mieres
    },
    {
        name: "Langreo",
        photoUrl: "multimedia/Langreo.jpg",
        latitude: 43.2900,
        longitude: -5.7192 // Langreo
    },
    {
        name: "Ribadesella",
        photoUrl: "multimedia/Ribadesella.jpg",
        latitude: 43.4606,
        longitude: -5.0837 // Ribadesella
    },
    {
        name: "Lugones",
        photoUrl: "multimedia/Lugones.jpg",
        latitude: 43.3411,
        longitude: -5.8326 // Lugones
    },
    {
        name: "Cangas de Onís",
        photoUrl: "multimedia/CangasOnis.jpg",
        latitude: 43.3663,
        longitude: -4.9316 // Cangas de Onís
    }
];

window.onload = function() {
    document.getElementById('confirm-button').disabled = true; // Ocultar el botón al cargar la página
    document.getElementById('next-button').disabled = true;
};


function initMap() {
    // Ubicación inicial del mapa (coordenadas de Cangas del Narcea)
    var initialLocation = asturiasLocations[currentIndex]; // Obtener la ubicación inicial del array

    // Crear el mapa y asignarlo al div con id="map"
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,  // Nivel de zoom inicial
        center: { lat: initialLocation.latitude, lng: initialLocation.longitude }, // Centrar en la ubicación inicial
        mapTypeId: 'satellite', // Establecer la vista en satélite
        disableDefaultUI: true // Deshabilitar la interfaz de usuario predeterminada
    });

    // Añadir un evento de clic en el mapa
    map.addListener('click', function (event) {
        placeMarker(event.latLng, map); // Colocar el marcador en la ubicación del clic
        document.getElementById('confirm-button').disabled = false;
    });

    // Establecer la imagen inicial
    updateImage();

    // Asignar el evento al botón "Siguiente"
    document.getElementById('next-button').addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % asturiasLocations.length; // Incrementar el índice y volver al inicio si es necesario
        updateImage(); // Actualizar la imagen
        clearMarkers();
        clearCircles();
        clearLine();
        document.getElementById("place-name").textContent = "";
        document.getElementById("distance").textContent = "";
        document.getElementById('next-button').disabled = true;
    });

    document.getElementById('confirm-button').addEventListener('click', function () {
        placeActualLocationMarker(map);
        drawLine(map);
        drawConcentricCircles(map);
        if (currentMarkerPosition) {
            const distance = calculateDistance(
                currentMarkerPosition.lat(),
                currentMarkerPosition.lng(),
                asturiasLocations[currentIndex].latitude,
                asturiasLocations[currentIndex].longitude
            );
            const locationName = asturiasLocations[currentIndex].name; // Obtener el nombre del lugar
            const score = calculateScore(distance);
            totalScore += score;
            document.getElementById("place-name").textContent = locationName;
            document.getElementById("distance").textContent = "Distancia: " + distance.toFixed(2) + " km";
            document.getElementById("score").textContent = "Puntuación: " + score;
            document.getElementById("total-score").textContent = "Puntuación total: " + totalScore;
            document.getElementById('confirm-button').disabled = true;
            document.getElementById('next-button').disabled = false;
        }

    });
}

function placeMarker(location, map) {
    // Si ya existe un marcador, lo elimina
    if (marker) {
        marker.setMap(null); // Eliminar el marcador del mapa
    }

    // Crear un nuevo marcador en la ubicación especificada
    marker = new google.maps.Marker({
        position: location,
        map: map // Asociar el marcador al mapa
    });

    currentMarkerPosition = location;
}

function placeActualLocationMarker(map) {
    if (actualLocationMarker) {
        actualLocationMarker.setMap(null); // Eliminar el marcador anterior de la ubicación real
    }

    actualLocationMarker = new google.maps.Marker({
        position: { lat: asturiasLocations[currentIndex].latitude, lng: asturiasLocations[currentIndex].longitude },
        map: map,
        title: "Ubicación real",
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" // Color verde para la ubicación real
        }
    });
}

function updateImage() {
    // Actualizar la imagen en la página con la URL del array
    document.getElementById('location-image').src = asturiasLocations[currentIndex].photoUrl;
}

function clearMarkers() {
    if (marker) {
        marker.setMap(null); // Eliminar el marcador del usuario
        marker = null;
    }
    if (actualLocationMarker) {
        actualLocationMarker.setMap(null); // Eliminar el marcador de la ubicación real
        actualLocationMarker = null;
    }
    currentMarkerPosition = null; // Reiniciar la posición del marcador del usuario
}

function drawConcentricCircles(map) {
    const center = { lat: asturiasLocations[currentIndex].latitude, lng: asturiasLocations[currentIndex].longitude };
    const radii = [5000, 10000, 15000, 20000]; // Radios de los círculos en metros

    // Limpiar los círculos anteriores
    clearCircles();

    // Dibujar 4 círculos con diferentes radios
    radii.forEach(radius => {
        const circle = new google.maps.Circle({
            strokeColor: '#00FF00',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00FF00',
            fillOpacity: 0.15,
            map: map,
            center: center,
            radius: radius // Radio en metros
        });
        circles.push(circle); // Guardar el círculo en el array
    });
}

// Función para limpiar los círculos anteriores
function clearCircles() {
    circles.forEach(circle => circle.setMap(null)); // Eliminar cada círculo del mapa
    circles = []; // Vaciar el array de círculos
}

function drawLine(map) {
    const userPosition = currentMarkerPosition;
    const actualPosition = { lat: asturiasLocations[currentIndex].latitude, lng: asturiasLocations[currentIndex].longitude };

    // Limpiar la línea anterior si existe
    clearLine();

    // Dibujar la nueva línea
    polyline = new google.maps.Polyline({
        path: [userPosition, actualPosition],
        geodesic: true,
        strokeColor: '#FF0000', // Color de la línea (rojo)
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    polyline.setMap(map);
}

// Función para limpiar la línea anterior
function clearLine() {
    if (polyline) {
        polyline.setMap(null); // Eliminar la línea del mapa
        polyline = null;
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
}

// Función para convertir grados a radianes
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function calculateScore(distance) {
    if (distance <= 5) {
        return 100; // Puntuación mínima
    } else if (distance <= 10) {
        return 75; // Puntuación media
    } else if (distance <= 15) {
        return 50; // Puntuación alta
    } else if (distance <= 20) {
        return 25; // Puntuación máxima
    } else {
        return 0; // Si está más allá de 20 km, la puntuación es 0
    }
}