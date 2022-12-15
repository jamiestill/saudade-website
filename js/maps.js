/* eslint-disable no-underscore-dangle */
/*
 * ========= FOR TESTING -- comment out pairs to test
 */

// Chesapeake
// routeCoords[routeCoords.length - 1][1] = 37.383542
// routeCoords[routeCoords.length - 1][0] = -76.338328

// Middle of bahamas
// routeCoords[routeCoords.length - 1][1] = 24.220169
// routeCoords[routeCoords.length - 1][0] = -76.099677

// Just off Conception Island
// routeCoords[routeCoords.length - 1][1] = 23.848841;
// routeCoords[routeCoords.length - 1][0] = -75.119233;

// 41 Federal
// routeCoords[routeCoords.length - 1][1] = 37.783684;
// routeCoords[routeCoords.length - 1][0] = -122.391600;

// Middle of ocean
// routeCoords[routeCoords.length - 1][1] = 47.32
// routeCoords[routeCoords.length - 1][0] = -62.42

// Petit Tebac
// routeCoords[routeCoords.length - 1][1] = 12.624667
// routeCoords[routeCoords.length - 1][0] = -61.348706

// Outer Key West
// routeCoords[routeCoords.length - 1][1] = 24.566693;
// routeCoords[routeCoords.length - 1][0] = -81.816359;

// Syndey, Austrailia
// routeCoords[routeCoords.length - 1][1] = -33.852801
// routeCoords[routeCoords.length - 1][0] = 151.226281

// Suburban Chicago
// routeCoords[routeCoords.length - 1][1] = 42.1898664
// routeCoords[routeCoords.length - 1][0] = -88.2232382

// Simulate Failure and NULL data
// routeCoords[routeCoords.length - 1][1] = false;
// routeCoords[routeCoords.length - 1][0] = NULL;

// Short circuit flag for API calls, mostly for testing and local development
const disableAPICalls = false;

// ========= END TESTING

// Store Saudade's location
const latitudeLongitude = {
	lat: routeCoords[routeCoords.length - 1][1],
	lng: routeCoords[routeCoords.length - 1][0],
};

/**
 * Create a Google Earth link in a new tab/window with passed ccordinates
 * @param {String} latLong - the coordiates that will go as the Google Earth query
 * @param {string} strLinkTitle - An optional <a> title
 * @param {string} strlinkText - Link text
 */
const createGoogleEarthLink = (strLatLong, strLinkTitle, strlinkText) => {
	let latLong = strLatLong;
	let linkTitle = strLinkTitle;
	let linkText = strlinkText;

	if (!latLong) {
		console.error('No latitude or longitude for Google Earth link.');
		return false;
	}

	if (!linkTitle) linkTitle = 'Where on earth is this?';
	if (!linkText) linkText = latLong;
	linkText = linkText.trim();

	latLong = encodeURI(latLong);

	// Build Google Earth link
	const googleEarthLink = `https://earth.google.com/web/search/${latLong}`;

	return `<a href="${googleEarthLink}" target="_blank" rel="noopener noreferrer" title="${linkTitle}">${linkText}</a>`;
};

/**
 * Convert a decimal degree direction to DMS
 * @param {Number} dirDegrees - the coordinate
 * @param {Boolean} isLongitutde - is longitude? (W/E vs N/E)
 */
const convertToDms = (dirDegrees, isLongitutde) => {
	let cardinalDirection;

	// dirDegrees is positive, then it's N or E (isLongitutde is false) and S or W ()
	if (dirDegrees > 0) {
		cardinalDirection = isLongitutde ? 'E' : 'N';
	} else {
		cardinalDirection = isLongitutde ? 'W' : 'S';
	}

	// Compute the components
	const absDecimalDegress = Math.abs(dirDegrees); // positive numbers only
	const degrees = parseInt(absDecimalDegress, 10);

	// Single out the decimal
	const decimal = absDecimalDegress - degrees;

	// Convert minutes and seconds
	const minutes = parseInt(decimal * 60, 10);
	let seconds = decimal * 3600 - minutes * 60;
	seconds = Math.round(seconds * 100) / 100;

	// Build string
	return `${degrees}° ${minutes}' ${seconds}" ${cardinalDirection}`;
};

/*
 * Reverse Geolocation - Google Maps API
 * This is the callback function for Google Maps API indicated in the API URL
 */

// eslint-disable-next-line no-unused-vars
function getLocation() {
	// Short circuit
	if (disableAPICalls !== false) return;

	const geocoder = new google.maps.Geocoder();

	geocoder
		.geocode({
			location: latitudeLongitude,
		})
		.then((response) => {
			let addressString = ''; // prevent 'undefined'
			const addyComponents = response.results[0].address_components;

			console.log('Reverse Geolocation:', addyComponents);

			// Build an address if possible, based on what Google has available
			// The returned object's address fields vary by country, below is an
			// approximation of the best way to display these items, excluding
			// plus and postal codes and 'short_name' for provinces & country names.
			if (
				addyComponents[0] &&
				addyComponents[0].types[0] !== 'plus_code'
			) {
				// no plus codes
				addressString += addyComponents[0].short_name;
			}

			if (addyComponents[1]) {
				addressString += ` ${addyComponents[1].short_name}`;
			}

			if (addyComponents[2]) {
				addressString += `, ${addyComponents[2].short_name}`;
			}

			if (addyComponents[3]) {
				addressString += `, ${addyComponents[3].long_name}`;
			}

			if (
				addyComponents[4] &&
				addyComponents[4].types[0] !== 'postal_code'
			) {
				addressString += `, ${addyComponents[4].short_name}`;
			}

			if (
				addyComponents[5] &&
				addyComponents[5].types[0] !== 'postal_code'
			) {
				addressString += `, ${addyComponents[5].short_name}`;
			}

			if (
				addyComponents[6] &&
				addyComponents[6].types[0] !== 'postal_code'
			) {
				addressString += `, ${addyComponents[6].short_name}`;
			}

			const addressCoordsRaw = `${latitudeLongitude.lat}, ${latitudeLongitude.lng}`;

			// GPS Coords
			const addressCoords = `${convertToDms(
				latitudeLongitude.lat,
				false
			)}, ${convertToDms(latitudeLongitude.lng, true)}`;

			// Create Google search based on this address
			const addressElement = `<h3>Current location</h3><div class="location-data-block">
            <div class="location-coordinates">
                <span class="icon-location"></span>${createGoogleEarthLink(
					addressCoordsRaw,
					false,
					addressCoords
				)}</div>
            <div class="location-address">
                <a href="https://www.google.com/search?q=${addressString.trim()}" target="_blank" rel="noopener noreferrer">${addressString.trim()}</a>
            </div>`;

			// Insert text into addressEl then into the DOM
			document.getElementById('lat-long').innerHTML = addressElement;
		})
		// Error on GeoCoder (https://developers.google.com/maps/documentation/javascript/reference)
		.catch((e) => console.error(`Geocoder failed due to ${e}`));
}

/*
 * Mapbox Map Generation
 * (code from MapBox API examples)
 */

if (disableAPICalls !== true) {
	// MapBox API key
	mapboxgl.accessToken =
		'pk.eyJ1IjoiamFtaWVzdGlsbCIsImEiOiJjbGI3YzlhcGEwOWZkM3JydnVibW1vYWJlIn0.s3NyxYxISDf2vRjQz20ycw';
	const currentLngLat = routeCoords[routeCoords.length - 1];
	const map = new mapboxgl.Map({
		container: 'map',
		// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
		style: 'mapbox://styles/jamiestill/clb7fzawa002o15nhr3ce8p03',
		center: currentLngLat,
		zoom: 2,
		attributionControl: false,
	});

	map.addControl(new mapboxgl.AttributionControl(), 'bottom-right');

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
		});

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
		});

		// Create a feature collection to position the pin marker
		const geojson = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [
							latitudeLongitude.lng,
							latitudeLongitude.lat,
						],
					},
				},
			],
		};

		// Pin marker to map
		geojson.features.forEach((feature) => {
			// create a HTML element for each marker (feature)
			const markerEl = document.createElement('div');
			markerEl.className = 'marker';

			// make a marker for each feature and add to the map
			new mapboxgl.Marker(markerEl)
				.setLngLat(feature.geometry.coordinates)
				.addTo(map);
		});

		// Add zoom controls
		map.addControl(
			new mapboxgl.NavigationControl({
				showCompass: false,
			}),
			'top-left'
		);

		// Add fullscreen button
		map.addControl(new mapboxgl.FullscreenControl());

		// Add scale
		map.addControl(
			new mapboxgl.ScaleControl({
				maxWidth: 80,
				unit: 'imperial',
			})
		);

		// Idea from https://stackoverflow.com/a/51683226
		class MapboxGLButtonControl {
			constructor({
				className = '',
				title = '',
				eventHandler = evtHndlr,
			}) {
				this._className = className;
				this._title = title;
				this._eventHandler = eventHandler;
			}

			// eslint-disable-next-line no-shadow, no-unused-vars
			onAdd(map) {
				this._btn = document.createElement('button');
				this._btn.className = `mapboxgl-ctrl-icon ${this._className}`;
				this._btn.type = 'button';
				this._btn.title = this._title;
				this._btn.onclick = this._eventHandler;

				this._container = document.createElement('div');
				this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
				this._container.appendChild(this._btn);

				return this._container;
			}

			onRemove() {
				this._container.parentNode.removeChild(this._container);
				this._map = undefined;
			}
		}

		// Event Handlers
		function reCenter() {
			map.flyTo({
				center: [latitudeLongitude.lng, latitudeLongitude.lat],
			});
		}

		// Instantiate new controls with custom event handlers
		const ctrlPoint = new MapboxGLButtonControl({
			className: 'mapbox-gl-recenter',
			title: 'Recenter to Saudade',
			eventHandler: reCenter,
		});

		// Add Controls to the Map
		map.addControl(ctrlPoint, 'top-right');

		map.setFog({
			color: 'rgb(186, 210, 235)', // Lower atmosphere
			'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
			'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
			'space-color': '#aae4ff', // Background color
			'star-intensity': 0, // Don't show stars
		});
	});
}

/**
 * Format the degree wind direction into secondary intercardinal directions,
 * see https://bit.ly/3iGmhoz
 * @param {Number} numWindAngle - the wind angle, 0 to 360
 */
const getCardinalDirection = (numWindAngle) => {
	let windAngle = numWindAngle;

	if (windAngle > 360) {
		console.error('Wind angle is greater than 360.');
		return false;
	}

	windAngle = Math.floor(Math.abs(windAngle) / 22.5 + 0.5); // 360/16

	const intercardinal = [
		'N',
		'NNE',
		'NE',
		'ENE',
		'E',
		'ESE',
		'SE',
		'SSE',
		'S',
		'SSW',
		'SW',
		'WSW',
		'W',
		'WNW',
		'NW',
		'NNW',
	];

	return intercardinal[windAngle % 16]; // 16 secondary intercardinal directions sectors of 360 degrees
};

// Create the weather label for insertion into HTML
const populateWeatherElement = (wxData, waveData) => {
	console.log('Weather data: ', wxData);
	console.log('Wave data: ', waveData);

	// Get the icon
	let wxIcon = wxData.current.weather[0].icon;

	// Decide which icon to use based on code from weather API
	// https://openweathermap.org/weather-conditions#How-to-get-icon-URL
	if (wxIcon.includes('01d')) {
		wxIcon = 'sun';
	} else if (wxIcon.includes('01n')) {
		wxIcon = 'moon';
	} else if (wxIcon.includes('02d')) {
		wxIcon = 'cloud-sun';
	} else if (wxIcon.includes('02n')) {
		wxIcon = 'cloud-moon';
	} else if (wxIcon.includes('03')) {
		wxIcon = 'cloud';
	} else if (wxIcon.includes('04')) {
		wxIcon = 'cloud';
	} else if (wxIcon.includes('50')) {
		wxIcon = 'fog-cloud';
	} else if (wxIcon.includes('08')) {
		wxIcon = 'drizzle';
	} else if (wxIcon.includes('09')) {
		wxIcon = 'fog';
	} else if (wxIcon.includes('10')) {
		wxIcon = 'rain';
	} else if (wxIcon.includes('11')) {
		wxIcon = 'clouds-flash';
	} else if (wxIcon.includes('13')) {
		wxIcon = 'snow';
	} else {
		wxIcon = 'globe';
	}

	wxIcon = `<span class='icon-${wxIcon}'></span>`; // Icons are in the icon font

	// Create the description (e.g. Clouds (overcast))
	let wxDescription = wxData.current.weather[0].main; // + " (" + wxData.weather[0].description + ") ";

	if (wxDescription && wxDescription.length > 0) {
		wxDescription = `<span id="location-wx-description">${wxDescription}</span>`;
	}

	// Grab the temperature
	let wxTemp;
	let wxTempC;
	const wxTempF = parseInt(wxData.current.temp, 10);

	if (!Number.isNaN(wxTempF) && wxTempF) {
		wxTempC = Math.round((wxTempF - 32) / 1.8);
		wxTemp = `, <span id="location-wx-description">${wxTempF}&deg;<abbr title="farenheit">F</abbr>
            (${wxTempC}&deg;<abbr title="centigrade">C</abbr>)</span>`;
	}

	// Parse the convert the wind speed and direction
	const wxWindSpeed = parseInt(wxData.current.wind_speed * 1.15, 10); // 1.15 to convert to knots
	const wxWindGust = parseInt(wxData.current.wind_gust * 1.15, 10);
	let wxWindDir = parseInt(wxData.current.wind_deg, 10);

	let windSpeedText = '';

	if (wxWindDir > 0 && wxWindSpeed > 0) {
		wxWindDir = getCardinalDirection(wxWindDir);
		windSpeedText = `, wind ${wxWindDir} at ${wxWindSpeed} <abbr title="knots, nautical miles per hour">kts</abbr>`;

		// Only show the gusts if they exist and are greater than the wind speed
		if (wxWindGust > 0 && wxWindGust > wxWindSpeed) {
			windSpeedText += `, gusting to ${wxWindGust} kts`;
		}
	} else {
		windSpeedText = '';
	}

	// Add in visibility
	let wxVisibility = parseInt(wxData.current.visibility, 10);

	if (!Number.isNaN(wxVisibility) && wxVisibility > 0) {
		// Convert meter to...
		let wxVisibilityKm = Math.round(wxVisibility * 100) / 100000; // kilometers
		let wxVisibilitySm = wxVisibilityKm * 0.621371; // statute miles

		// Round to two digits
		wxVisibilitySm = Math.round(wxVisibilitySm * 100) / 100;
		wxVisibilityKm = Math.round(wxVisibilityKm * 100) / 100;

		// upper minit of visibility
		if (wxVisibilitySm > 6.2) {
			wxVisibilitySm = '6 or more ';
			wxVisibilityKm += '+';
		}

		wxVisibility = `. Visibility ${wxVisibilitySm} 
            <abbr title="statute miles">miles</abbr> 
            (${wxVisibilityKm}<abbr title="kilometers">km</abbr>)`;
	} else {
		wxVisibility = '';
	}

	// Wave forecast
	let waveText = '';
	if (waveData) {
		const waveDir = getCardinalDirection(
			parseInt(waveData.daily.wave_direction_dominant[0], 10)
		);
		const waveHeight = waveData.daily.wave_height_max[0];
		const wavePeriod = Math.ceil(waveData.daily.wave_period_max[0]);
		waveText = `Waves expected at ${Math.ceil(
			waveHeight * 3.281
		)}ft (${waveHeight}m) from ${waveDir} every ${wavePeriod} seconds.`;
	} else {
		waveText = ''; // "<small><br>(No wave data for this location.)</small>";
	}

	// Build a timestamp
	let wxTimeStamp = new Date(wxData.current.dt * 1000); // epoch time returned by API

	if (wxTimeStamp) {
		// Build date
		const dateFormatted = new Intl.DateTimeFormat('en', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			timeZone: wxData.timezone,
			timeZoneName: 'short',
		});
		wxTimeStamp = dateFormatted.format(wxTimeStamp);
		wxTimeStamp = `<span class="observed-time">${wxTimeStamp}</span>`;
	}

	// Build the HTML element
	const locationElement = document.createElement('div');
	locationElement.innerHTML = `
        <h4><a target="_blank" rel="nooperner noreferrer" href="https://www.windy.com/${latitudeLongitude.lat}/${latitudeLongitude.lng}/?${latitudeLongitude.lat},${latitudeLongitude.lng}?,4">Weather conditions</a> at <i>Saudade</i></h4>
        <div class="weather-data">${wxIcon}<p>${wxDescription}${wxTemp}${windSpeedText}${wxVisibility}. ${waveText}<br>${wxTimeStamp}</p></div>`;

	// Insert the element into the DOM
	document
		.querySelector(`.map-container`)
		.parentNode.appendChild(locationElement);
};

// Where to insert WX into the DOM
const mapContainer = document.querySelector('.map-container');

if (mapContainer) {
	// Short circuit
	if (disableAPICalls !== true) {
		// Catch API errors
		const checkStatus = (response) => {
			if (response.ok) {
				return Promise.resolve(response);
			}
			return Promise.reject(new Error(response.statusText));
		};

		// Build the weather API URL
		const apiKey = '76ee0493190b9329a78ef95c73e70017';
		const wxApiURL = `https://api.openweathermap.org/data/3.0/onecall?units=imperial&exclude=minutely,hourly,daily&lat=${latitudeLongitude.lat}&lon=${latitudeLongitude.lng}&appid=${apiKey}`;

		// Build the wave API URL
		const waveApiURL = `https://marine-api.open-meteo.com/v1/marine?&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=auto&latitude=${latitudeLongitude.lat}&longitude=${latitudeLongitude.lng}`;

		// Fetch the weather data
		const fetchWx = fetch(wxApiURL)
			.then(checkStatus)
			.then((response) => response.json())
			.catch((error) => console.error('Weather fetch failed', error));

		// Fetch the wave data
		const fetchWave = fetch(waveApiURL)
			.then(checkStatus)
			.then((response) => response.json())
			.catch((error) =>
				console.error(
					error,
					'Wave fetch failed, probably since Saudade is on land.'
				)
			);

		// Get API data concurrently with Promise.all
		Promise.all([fetchWx, fetchWave]).then((data) => {
			populateWeatherElement(data[0], data[1]);
		});
	}
}

/*
 * Insert Google Earth links for figcaptions with GPS coordinates
 */

// Get the figcaptions
const figcaptions = document.querySelectorAll('figcaption .lat-long');
if (figcaptions) {
	figcaptions.forEach((figcaption) => {
		figcaption.innerHTML = createGoogleEarthLink(
			figcaption.innerText,
			'Where on earth was this photo taken?'
		);
	});
}
