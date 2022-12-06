mapboxgl.accessToken =
    'pk.eyJ1IjoiamFtaWVzdGlsbCIsImEiOiJjbGI3YzlhcGEwOWZkM3JydnVibW1vYWJlIn0.s3NyxYxISDf2vRjQz20ycw'
const currentLngLat = [-76.35219, 37.40722]
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/jamiestill/clb7fzawa002o15nhr3ce8p03',
    center: currentLngLat,
    zoom: 2,
    attributionControl: false,
})
map.addControl(new mapboxgl.AttributionControl(), 'bottom-right')

new mapboxgl.Marker().setLngLat(currentLngLat).addTo(map)

map.on('load', () => {
    map.addSource('route', {
        type: 'geojson',
        data: {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: routeCoords,
            },
        },
    })

    map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': 'orange',
            'line-width': 1,
        },
    })
})

// Get weather for current location
const getWeather = () => {
    const currentLatLong = routeCoords[0],
        lat = currentLatLong[1],
        long = currentLatLong[0],
        apiKey = '438e9bd62501e99a254329223d5494ee'

    let apiURL =
        'https://api.openweathermap.org/data/2.5/onecall?lat=' +
        lat +
        '&lon=' +
        long +
        '&appid=' +
        apiKey

    return apiURL
}

// Insert into the DOM
let mapContainer = document.querySelector('#location .inside')

if (mapContainer) {
    const urlWx = getWeather()
    console.log(urlWx)
    const locationElement = document.createElement('div')
    locationElement.innerHTML = `<p>Current location: <span id="current-location">${urlWx}</span></p>`
    mapContainer.appendChild(locationElement)
}
