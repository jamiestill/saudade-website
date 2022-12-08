/*
 * ========= FOR TESTING -- comment out pairs to test
*/

// Chesapeake
// routeCoords[routeCoords.length - 1][1] = 37.383542;
// routeCoords[routeCoords.length - 1][0] = -76.338328;

// Middle of bahamas
// routeCoords[routeCoords.length - 1][1]=  24.220169;
// routeCoords[routeCoords.length - 1][0] = -76.099677;

// Just off Cnception Island
// routeCoords[routeCoords.length - 1][1] =  23.848841;
// routeCoords[routeCoords.length - 1][0] = -75.119233;

// 41 Federal
// routeCoords[routeCoords.length - 1][1] =  37.783684;
// routeCoords[routeCoords.length - 1][0] = -122.391600;

// Middle of ocean
// routeCoords[routeCoords.length - 1][1] =  33.455050;
// routeCoords[routeCoords.length - 1][0] = -63.774391;

// Petit Tebac
routeCoords[routeCoords.length - 1][1] =  12.624667;
routeCoords[routeCoords.length - 1][0] = -61.348706;

// Outer Key West
// routeCoords[routeCoords.length - 1][1] =  24.566693;
// routeCoords[routeCoords.length - 1][0] = -81.816359;

// Syndey, Austrailia
// routeCoords[routeCoords.length - 1][1] = -33.852801;
// routeCoords[routeCoords.length - 1][0] = 151.226281;


// ========= END TESTING

/**
 * Create a Google Earth link in a new tab/window with passed ccordinates
 * @param {String} latLong - the coordiates that will go as the Google Earth query
 * @param {string} linkTitle - An optional <a> title
 * @param {string} linkText - Link text
 */
 const createGoogleEarthLink = (latLong, linkTitle, linkText) => {
    
    if (!latLong ) {
        console.error('No lat long');
        return false;
    } 

    if (!linkTitle) linkTitle = "Where on earth is this?";
    if (!linkText) linkText = latLong;

    // Build Google Earth link
    let googleEarthLink = "https://earth.google.com/web/search/" + encodeURI(latLong);
    
    return `<a href="${googleEarthLink}" 
            target="_blank" rel="noopener noreferrer"
            title="${linkTitle}">
                ${linkText}
            </a>`;
}

/**
 * Convert a decimal degree direction to DMS
 * @param {Number} dirDegrees - the coordinate
 * @param {Boolean} isLng - is longitude? (W/E vs N/E)
 */
 const convertToDms = (dirDegrees, isLng) => {
    let dir;

    // dirDegrees is positive, then it's N or E (isLng is false) and S or W ()
    if (dirDegrees > 0) {
        dir = isLng ? 'E' : 'N'
    } else {
        dir = isLng ? 'W' : 'S'
    }
  
    let absDd = Math.abs(dirDegrees),
        deg = absDd | 0,
        frac = absDd - deg,
        min = (frac * 60) | 0,
        sec = frac * 3600 - min * 60;
    
    // Round to two decimal places.
    sec = Math.round(sec * 100) / 100;
    return deg + "°" + min + dir;
 }

// Google Maps API
const googleMapsAPIKey = 'AIzaSyBk2_7sLHSG1wxB1KhCNRuoSNQlM3GdUwc';

// Callback function for Google Maps API
window.getLocation = () => {
    const geocoder = new google.maps.Geocoder();

    const latLong = {
        lat: routeCoords[routeCoords.length - 1][1],
        lng: routeCoords[routeCoords.length - 1][0]
    }

    geocoder.geocode({
        location: latLong
    }).then((response) => {
        let addressString = ""; // prevent 'undefined'
        let addressElement, addressCoordsRaw, addressCoords;
        const addyComponents = response.results[0].address_components;

        // Build an address if possible, based on what Google has available
        if (addyComponents[1]) {
            addressString += addyComponents[1].short_name;
        }

        if (addyComponents[2]) {
            addressString += ", " + addyComponents[2].short_name;
        }

        if (addyComponents[3]) {
            addressString += ", " + addyComponents[3].long_name;
        }

        if (addyComponents[4]) {
            addressString += ", " + addyComponents[4].short_name;
        }

        if (addyComponents[5]) {
            addressString += ", " + addyComponents[5].long_name;
        }

        addressCoordsRaw = routeCoords[routeCoords.length - 1][1] + "," +routeCoords[routeCoords.length - 1][0];

        // GPS Coords
        addressCoords = `
            ${convertToDms(routeCoords[routeCoords.length - 1][1], false)},
            ${convertToDms(routeCoords[routeCoords.length - 1][0], true)}`


        // Create Google search based on this address
        addressElement = `<h3>Current location</h3><div class="location-data-block">
            <div class="location-address">
                <a href="https://www.google.com/search?q=${addressString}" target="_blank" rel="noopener noreferrer">${addressString}</a>
            </div>`;

        // Insert the GPS coordinates
        addressElement += `<div class="location-coordinates">${createGoogleEarthLink(addressCoordsRaw, false, addressCoords)}</div>`;

        // Insert text into addressEl then into the DOM
        document.getElementById('lat-long').innerHTML = addressElement;
    })
    // Error on GeoCoder (https://developers.google.com/maps/documentation/javascript/reference)
    .catch((e) => console.error("Geocoder failed due to " + e));
}

// Mapbox code (from Mapbox)
mapboxgl.accessToken =
    'pk.eyJ1IjoiamFtaWVzdGlsbCIsImEiOiJjbGI3YzlhcGEwOWZkM3JydnVibW1vYWJlIn0.s3NyxYxISDf2vRjQz20ycw'
    const currentLngLat = routeCoords[routeCoords.length - 1]
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


/**
 * Format a date into a human readable timestamp
 * @param {String} date - the date
 */
const dateFormater = (date) => {

    if (!date) {
        console.error('No date.');
        return false;
    }
    const day = date.getDate();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = date.getMonth();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

    // Build date
    return day + " " + months[month] + " " + year + " " + time;
};

/**
 * Format the degree wind direction into secondary intercardinal directions,
 * see https://bit.ly/3iGmhoz
 * @param {Number} windAngle - the wind angle, 0 to 360
 */
    // 
const getCardinalDirection = (windAngle) => {
    
    if (windAngle > 360) {
        console.error('Wind angle is greater than 360');
        return false;
    }

    windAngle = Math.floor((windAngle / 22.5) + 0.5); // 360/16

    const intercardinal = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    return intercardinal[(windAngle % 16)]; // 16 secondary intercardinal directions sectors of 360 degrees
};

// Get weather for current location (based on routes.js, the data store of the routes where Saudade has been)
const getWeather = () => {
     const currentLatLong = routeCoords[routeCoords.length - 1], // Get the last coordinate in the route
        lat = currentLatLong[1], 
        lng = currentLatLong[0],
        apiKey = '438e9bd62501e99a254329223d5494ee';

    let apiURL =
        'https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=' +
        lat +
        '&lon=' +
        lng +
        '&appid=' +
        apiKey

    return apiURL;
};

// Create the weather label for insertion into HTML
const populateWeatherElement = (data) => {
    let wxLocation = data.name;
    
    if (wxLocation && wxLocation.length > 0) {
        wxLocation = `<span id="current-location">${wxLocation}</span>, `;
    } else {
        return false; // No location data means there's probably no data at sea
    }

    let wxDescription = data.weather[0].description;

    if (wxDescription && wxDescription.length > 0) {
        wxDescription = `<span id="location-wx-description">${wxDescription}</span>`;
    }

    let wxTemp, wxTempC, wxTempF = parseInt(data.main.temp);

    if (!isNaN(wxTempF) && wxTempF) {
        wxTempC = Math.round((wxTempF - 32) / 1.8);
        wxTemp = ` at <span id="location-wx-description">${wxTempF}&deg;<abbr title="farenheit">F</abbr>
            (${wxTempC}&deg;<abbr title="centigrade">C</abbr>)</span>`;
    }

    let wxWindDir = parseInt(data.wind.deg);
    let wxWindSpeed = parseInt(data.wind.speed * 1.15); // 1.15 to convert to knots
    let wxWindGust = parseInt(data.wind.gust * 1.15);

    if (!isNaN(wxWindDir) && !isNaN(wxWindSpeed) && !isNaN(wxWindGust)) {
        if (wxWindDir > 0) {    
            wxWindDir = getCardinalDirection(wxWindDir);
        }

        if (wxWindDir && wxWindSpeed >= 0 && wxWindGust >= 0) {
            wxWindSpeed = `, wind ${wxWindDir} at ${wxWindSpeed} <abbr title="knots, nautical miles per hour">kts</abbr>,
                gusting to ${wxWindGust} kts`;
        }
    } else {
        wxWindSpeed = "";
    }

    let wxVisibility = parseInt(data.weather.visibility)

    if (!isNaN(wxVisibility) && wxVisibility > 0) {
        let wxVisibilityKM = wxVisibility / 1000;
        let wxVisibilitySm = wxVisibilitySm * 0.621371;
        wxVisibility = `. Visibility is ${wxVisibilitySm} 
            <abbr title="statute miles">SM</abbr> 
            (${wxVisibilityKM} <abbr title="kilometers">KM</abbr>)`;
    } else {
        wxVisibility = "";
    }

    let wxTimeStamp = new Date(data.dt * 1000); // epoch time returned by API

    if (wxTimeStamp) {
        wxTimeStamp = dateFormater(wxTimeStamp);
        wxTimeStamp = `<span class="observed-time">Observed at ${wxTimeStamp}</span>`;
    }

    const locationElement = document.createElement('section')
    locationElement.innerHTML = `
        <h4>Current weather at <i>Saudade</i>'s location</h4>
        <p class="weather-data">${wxTimeStamp}${wxLocation}${wxDescription}${wxTemp}${wxWindSpeed}${wxVisibility}.</p>`;

    mapContainer.appendChild(locationElement);
};


// Where to insert WX into the DOM
let mapContainer = document.querySelector('#location .inside');

if (mapContainer) {
    // Build the weather API URL
    const urlWx = getWeather();

    // Fetch it
    fetch(urlWx)
        .then(response => (response.json()))
        .then(data => populateWeatherElement(data))

        // Error on Weather API (https://openweathermap.org/api/one-call-3)
        .catch((e) => console.error("Weather API failed due to " + e));
};