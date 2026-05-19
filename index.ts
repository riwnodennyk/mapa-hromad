import L from 'leaflet';
import osmtogeojson from 'osmtogeojson';
import { translations, Translation } from './translations';
import { realBudgets } from './stats';

// Language detection
const getBrowserLang = () => {
    const lang = navigator.language.split('-')[0];
    return translations[lang] ? lang : 'uk';
};

const currentLang = getBrowserLang();
const t: Translation = translations[currentLang];

// Update static UI elements
document.documentElement.lang = currentLang;
document.title = t.title;
const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) metaDescription.setAttribute('content', t.description);

const searchInput = document.getElementById('search-input') as HTMLInputElement;
if (searchInput) searchInput.placeholder = t.search_placeholder;
const locateButton = document.getElementById('locate-button') as HTMLButtonElement;
if (locateButton) locateButton.title = t.locate_me;

const loadingText = document.querySelector('#loading span') as HTMLElement;
if (loadingText) loadingText.innerText = t.loading_data;



const labelHromadas = document.getElementById('label-hromadas');
if (labelHromadas) labelHromadas.innerText = t.hromadas || 'Hromadas';

const labelRaions = document.getElementById('label-raions');
if (labelRaions) labelRaions.innerText = t.raions || 'Raions';



const urlParams = new URLSearchParams(window.location.search);
const latParam = urlParams.get('lat');
const lngParam = urlParams.get('lng') || urlParams.get('lon');
const zoomParam = urlParams.get('z') || urlParams.get('zoom');

let initialLat = 50.4501;
let initialLng = 30.5234;
let initialZoom = 16;

if (latParam && lngParam) {
    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);
    if (!isNaN(lat) && !isNaN(lng)) {
        initialLat = lat;
        initialLng = lng;
    }
}

if (zoomParam) {
    const zoom = parseInt(zoomParam);
    if (!isNaN(zoom)) {
        initialZoom = zoom;
    }
}

const map = L.map('map', {
    zoomControl: false
}).setView([initialLat, initialLng], initialZoom);

// Add Google Maps tiles to support localized labels, using a CSS filter for dark mode
L.tileLayer(`https://mt1.google.com/vt/lyrs=m&hl=${currentLang}&x={x}&y={y}&z={z}`, {
    attribution: '&copy; Google Maps',
    maxZoom: 20,
    className: 'dark-tiles'
}).addTo(map);

L.control.zoom({ position: 'topright' }).addTo(map);

const treeLayer = L.geoJSON(undefined as any, {
    style: (feature) => {
        return {
            fillColor: '#38bdf8',
            color: '#38bdf8',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.2
        };
    },
    onEachFeature: (feature, layer) => {
        const props = feature.properties;
        const name = props['name'] || t.unknown || 'Unknown';

        let wikiLinkHtml = '';
        if (props['wikipedia']) {
            const parts = props['wikipedia'].split(':');
            let wikiUrl = '';
            if (parts.length === 2) {
                wikiUrl = `https://${parts[0]}.wikipedia.org/wiki/${encodeURIComponent(parts[1])}`;
            } else {
                wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(props['wikipedia'])}`;
            }
            wikiLinkHtml = `<p><a href="${wikiUrl}" target="_blank" style="color: #10b981;">${t.wikipedia_article}</a></p>`;
        } else if (props['name']) {
            wikiLinkHtml = `<p><a href="https://uk.wikipedia.org/wiki/${encodeURIComponent(props['name'])}" target="_blank" style="color: #10b981;">${t.search_wikipedia}</a></p>`;
        }

        let totalBudgetMillion = 0;

        const katottg = props['ref:katotth'] || props['katotth'] || props['ua:katotth'] || props['ref:ua:katotth'] ||
            props['ref:katottg'] || props['katottg'] || props['ua:katottg'] || props['ref:ua:katottg'] || '';
        if (katottg && realBudgets[katottg] !== undefined) {
            totalBudgetMillion = realBudgets[katottg];
        }

        const adminLevel = props['admin_level'] || '7';
        let budgetHtml = '';

        if (totalBudgetMillion > 0) {
            let totalBudgetDisplay = '';
            if (totalBudgetMillion >= 1000) {
                totalBudgetDisplay = `${(totalBudgetMillion / 1000).toFixed(2)} ${t.billion} ₴`;
            } else {
                totalBudgetDisplay = `${totalBudgetMillion.toFixed(1)} ${t.million} ₴`;
            }

            // Real-life public finance profiles (Official consolidated average municipal expenditures in Ukraine)
            let f1 = 0.45, f2 = 0.08, f3 = 0.20, f4 = 0.12, f5 = 0.15; // Hromada baseline

            if (adminLevel === '6') {
                // Raion baseline
                f1 = 0.05; // Education
                f2 = 0.10; // Healthcare
                f3 = 0.15; // Infrastructure
                f4 = 0.20; // Social Services
                f5 = 0.50; // Administration & staffing
            }

            const m1 = f1 * totalBudgetMillion;
            const m2 = f2 * totalBudgetMillion;
            const m3 = f3 * totalBudgetMillion;
            const m4 = f4 * totalBudgetMillion;
            const m5 = f5 * totalBudgetMillion;

            budgetHtml = `
                <div class="budget-info">
                    <h4>💰 ${t.yearly_budget}: ${totalBudgetDisplay}</h4>
                    <ul class="budget-breakdown">
                        <li><span>📚 ${t.education}:</span> <span>${m1.toFixed(1)} ${t.million} ₴</span></li>
                        <li><span>🏥 ${t.healthcare}:</span> <span>${m2.toFixed(1)} ${t.million} ₴</span></li>
                        <li><span>🏗️ ${t.infrastructure}:</span> <span>${m3.toFixed(1)} ${t.million} ₴</span></li>
                        <li><span>🤝 ${t.social_services}:</span> <span>${m4.toFixed(1)} ${t.million} ₴ </span></li>
                        <li><span>🏛️ ${t.administration}:</span> <span>${m5.toFixed(1)} ${t.million} ₴</span></li>
                    </ul>
                </div>
            `;
        }

        const content = `
            <div class="building-info">
                <h3>${name}</h3>
                ${wikiLinkHtml}
                ${budgetHtml}
                ${feature.id ? `<p><a href="https://www.openstreetmap.org/${feature.id}" target="_blank">${t.open_in_osm}</a></p>` : ''}
            </div>
        `;
        layer.bindPopup(content);

        const hasBudget = totalBudgetMillion > 0;
        const tooltipHint = hasBudget
            ? (currentLang === 'uk' ? '(Натисніть для Вікіпедії та Бюджету)' :
                currentLang === 'de' ? '(Klicken für Wikipedia & Budget)' :
                    currentLang === 'fr' ? '(Cliquez pour Wikipédia & Budget)' :
                        currentLang === 'es' ? '(Haga clic para Wikipedia y Presupuesto)' :
                            '(Click for Wikipedia & Budget)')
            : (currentLang === 'uk' ? '(Натисніть для Вікіпедії)' :
                currentLang === 'de' ? '(Klicken für Wikipedia)' :
                    currentLang === 'fr' ? '(Cliquez pour Wikipédia)' :
                        currentLang === 'es' ? '(Haga clic para Wikipedia)' :
                            '(Click for Wikipedia)');

        const tooltipContent = `
            <div style="text-align: center;">
                <div>${name}</div>
                <div style="font-size: 10px; opacity: 0.8; margin-top: 2px;">${tooltipHint}</div>
            </div>
        `;
        layer.bindTooltip(tooltipContent, { sticky: true, className: 'building-tooltip' });

        layer.on('mouseover', function (this: any) {
            this.setStyle({
                fillOpacity: 0.4,
                weight: 3
            });
        });

        layer.on('mouseout', function (this: any) {
            this.setStyle({
                fillOpacity: 0.2,
                weight: 2
            });
        });
    }
}).addTo(map);



let lastFetchedBounds: L.LatLngBounds | null = null;
const loadedTreeIds = new Set<string>();
let cachedFeatures: any[] = [];

const CACHE_KEY = 'tree_map_data_cache';
const MAX_CACHE_SIZE = 20 * 1024 * 1024; // 20MB

function transformFeatures(features: any[]): any[] {
    return features;
}

function loadCache() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            cachedFeatures = transformFeatures(JSON.parse(cached));
            console.log(`Loaded ${cachedFeatures.length} trees from cache`);
            applyCache();
        }
    } catch (e) {
        console.error('Failed to load cache:', e);
        cachedFeatures = [];
    }
}

function saveCache() {
    try {
        let cacheString = JSON.stringify(cachedFeatures);
        // If exceeds 2MB, remove oldest 20% until it fits
        while (cacheString.length > MAX_CACHE_SIZE && cachedFeatures.length > 0) {
            const toRemove = Math.max(1, Math.floor(cachedFeatures.length * 0.2));
            cachedFeatures.splice(0, toRemove);
            cacheString = JSON.stringify(cachedFeatures);
        }
        localStorage.setItem(CACHE_KEY, cacheString);
    } catch (e) {
        console.error('Failed to save cache:', e);
    }
}

function applyCache() {
    const activeLevel = document.querySelector('input[name="admin_level"]:checked') as HTMLInputElement;
    const adminLevel = activeLevel ? activeLevel.value : '7';

    const featuresToShow = cachedFeatures.filter(f => {
        if (loadedTreeIds.has(f.id)) return false;
        if (!f.properties) return false;
        const fLevel = f.properties['admin_level'];
        if (adminLevel === '7') {
            return fLevel === '7' || (fLevel === '4' && (f.properties['name'] === 'Київ' || f.properties['name:uk'] === 'Київ'));
        }
        return fLevel === adminLevel;
    });

    if (featuresToShow.length > 0) {
        featuresToShow.forEach(f => loadedTreeIds.add(f.id));
        treeLayer.addData({
            type: 'FeatureCollection',
            features: featuresToShow
        } as any);
        console.log(`Applied ${featuresToShow.length} trees from cache to map`);
    }
}

function updateCache(newFeatures: any[]) {
    const zoom = map.getZoom();
    if (zoom < 8) {
        console.log(`Zoom level ${zoom} too low for caching, skipping storage`);
        return;
    }

    // Add new features, avoiding duplicates in the cache array itself
    const existingIds = new Set(cachedFeatures.map(f => f.id));
    const uniqueNewFeatures = newFeatures.filter(f => !existingIds.has(f.id));

    if (uniqueNewFeatures.length > 0) {
        cachedFeatures.push(...uniqueNewFeatures);
        saveCache();
    }
}

let currentFetchController: AbortController | null = null;

async function fetchTrees() {
    if (currentFetchController) {
        currentFetchController.abort();
    }
    currentFetchController = new AbortController();
    const signal = currentFetchController.signal;
    const loading = document.getElementById('loading');
    const loadingText = loading?.querySelector('span');
    const spinner = loading?.querySelector('.loading-spinner') as HTMLElement;

    const setStatus = (msg: string | null, showSpinner: boolean = true) => {
        if (!loading || !loadingText) return;
        if (msg) {
            loading.style.display = 'flex';
            loadingText.innerText = msg;
            if (spinner) spinner.style.display = showSpinner ? 'block' : 'none';
        } else {
            loading.style.display = 'none';
        }
    };

    const zoom = map.getZoom();
    const bounds = map.getBounds();

    if (zoom < 8) {
        setStatus(t.zoom_too_high, false);
        return;
    }

    // Check if current bounds are already covered by the last fetch
    if (lastFetchedBounds && lastFetchedBounds.contains(bounds)) {
        console.log('Area already cached, skipping fetch');

        // Still check if anything is visible (in case user changed filters or moved within coverage)
        const currentBounds = map.getBounds();
        let count = 0;
        treeLayer.eachLayer((layer: any) => {
            const bounds = layer.getBounds ? layer.getBounds() : null;
            const latlng = layer.getLatLng ? layer.getLatLng() : null;
            if ((bounds && currentBounds.intersects(bounds)) || (latlng && currentBounds.contains(latlng))) {
                count++;
            }
        });

        if (count === 0) {
            setStatus(t.no_trees_found, false);
        } else {
            setStatus(t.trees_shown.replace('{count}', count.toString()), false);
        }
        return;
    }

    // Calculate padded bbox (50% extra on each side)
    const latPadding = (bounds.getNorth() - bounds.getSouth()) * 0.5;
    const lngPadding = (bounds.getEast() - bounds.getWest()) * 0.5;

    const south = bounds.getSouth() - latPadding;
    const north = bounds.getNorth() + latPadding;
    const west = bounds.getWest() - lngPadding;
    const east = bounds.getEast() + lngPadding;

    const paddedBbox = `${south},${west},${north},${east}`;

    const activeLevel = document.querySelector('input[name="admin_level"]:checked') as HTMLInputElement;
    const adminLevel = activeLevel ? activeLevel.value : '7';

    const selectedQueries = [
        `relation["admin_level"="${adminLevel}"][~"^(ref:)?(ua:)?katott[gh]$"~"."](${paddedBbox});`,
        `way["admin_level"="${adminLevel}"][~"^(ref:)?(ua:)?katott[gh]$"~"."](${paddedBbox});`
    ];

    if (adminLevel === '7') {
        // Kyiv is admin_level=4 in OSM, so we explicitly fetch it when mapping Hromadas
        selectedQueries.push(
            `relation["admin_level"="4"]["name"="Київ"](${paddedBbox});`,
            `relation["admin_level"="4"]["name:uk"="Київ"](${paddedBbox});`
        );
    }

    const query = `
        [out:json][timeout:30];
        (
          ${selectedQueries.join('\n')}
        );
        out body;
        >;
        out skel qt;
    `;

    setStatus(t.searching_server);

    const OVERPASS_INSTANCES = [
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.osm.ch/api/interpreter',
        'https://overpass.openstreetmap.fr/api/interpreter',
        'https://lz4.overpass-api.de/api/interpreter',
        'https://overpass.nchc.org.tw/api/interpreter'
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const fetchPromises = OVERPASS_INSTANCES.map(async (instance) => {
        const hostname = new URL(instance).hostname;
        try {
            const response = await fetch(instance, {
                method: 'POST',
                body: query,
                signal: signal
            });
            if (response.ok) {
                const data = await response.json();
                if (data.elements && data.elements.length > 0) {
                    return { data, hostname };
                }
                throw new Error('No trees found in this area');
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (e) {
            console.warn(`Mirror ${hostname} failed:`, e);
            throw e;
        }
    });

    try {
        const result = await Promise.any(fetchPromises);
        console.log(`Success from ${result.hostname}. Elements:`, result.data.elements?.length);

        setStatus(t.processing);

        const geojson = osmtogeojson(result.data);

        if (signal.aborted) return;

        const transformedFeatures = transformFeatures((geojson as any).features);

        const activeLevel = document.querySelector('input[name="admin_level"]:checked') as HTMLInputElement;
        const adminLevel = activeLevel ? activeLevel.value : '7';

        const newFeatures = transformedFeatures.filter((f: any) => {
            if (loadedTreeIds.has(f.id)) return false;
            if (!f.properties) return false;
            const fLevel = f.properties['admin_level'];
            if (adminLevel === '7') {
                return fLevel === '7' || (fLevel === '4' && (f.properties['name'] === 'Київ' || f.properties['name:uk'] === 'Київ'));
            }
            return fLevel === adminLevel;
        });

        if (newFeatures.length > 0) {
            newFeatures.forEach((f: any) => loadedTreeIds.add(f.id));
            treeLayer.addData({
                type: 'FeatureCollection',
                features: newFeatures
            } as any);
            updateCache(newFeatures);
        }

        lastFetchedBounds = L.latLngBounds([south, west], [north, east]);
        controller.abort();

        // Check if there are any trees visible on the map after fetch
        const currentBounds = map.getBounds();
        let count = 0;
        treeLayer.eachLayer((layer: any) => {
            const bounds = layer.getBounds ? layer.getBounds() : null;
            const latlng = layer.getLatLng ? layer.getLatLng() : null;
            if ((bounds && currentBounds.intersects(bounds)) || (latlng && currentBounds.contains(latlng))) {
                count++;
            }
        });

        if (count === 0) {
            setStatus(t.no_trees_found, false);
        } else {
            setStatus(t.trees_shown.replace('{count}', count.toString()), false);
        }

    } catch (error) {
        if (signal.aborted) return;
        console.error('All mirrors failed:', error);
        setStatus(t.servers_overloaded, false);
    } finally {
        clearTimeout(timeoutId);
    }
}

// Re-fetch when filters change
document.querySelectorAll('.filter-item input').forEach(input => {
    input.addEventListener('change', () => {
        if (currentFetchController) currentFetchController.abort();
        treeLayer.clearLayers();
        loadedTreeIds.clear();
        lastFetchedBounds = null;
        applyCache();
        fetchTrees();
    });
});

let fetchTimeout: any = null;
function updateUrl() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const url = new URL(window.location.href);
    url.searchParams.set('lat', center.lat.toFixed(5));
    url.searchParams.set('lng', center.lng.toFixed(5));
    url.searchParams.set('z', zoom.toString());
    window.history.replaceState({}, '', url.toString());
}

function debouncedFetch() {
    // Apply cache immediately for instant feedback when moving to already-visited areas
    applyCache();
    updateUrl();

    // Refresh count status immediately from cache/existing layers
    const currentBounds = map.getBounds();
    const loading = document.getElementById('loading');
    const loadingText = loading?.querySelector('span');
    const zoom = map.getZoom();

    const t_trees_shown = translations[currentLang].trees_shown;
    const t_no_trees_found = translations[currentLang].no_trees_found;
    const t_zoom_too_high = translations[currentLang].zoom_too_high;

    if (loading && loadingText) {
        if (zoom < 8) {
            loading.style.display = 'flex';
            loadingText.innerText = t_zoom_too_high;
            const spinner = loading.querySelector('.loading-spinner') as HTMLElement;
            if (spinner) spinner.style.display = 'none';
        } else {
            let count = 0;
            treeLayer.eachLayer((layer: any) => {
                const bounds = layer.getBounds ? layer.getBounds() : null;
                const latlng = layer.getLatLng ? layer.getLatLng() : null;
                if ((bounds && currentBounds.intersects(bounds)) || (latlng && currentBounds.contains(latlng))) {
                    count++;
                }
            });

            if (count === 0) {
                loading.style.display = 'flex';
                loadingText.innerText = t_no_trees_found;
                const spinner = loading.querySelector('.loading-spinner') as HTMLElement;
                if (spinner) spinner.style.display = 'none';
            } else {
                loading.style.display = 'flex';
                loadingText.innerText = t_trees_shown.replace('{count}', count.toString());
                const spinner = loading.querySelector('.loading-spinner') as HTMLElement;
                if (spinner) spinner.style.display = 'none';
            }
        }
    }

    if (fetchTimeout) clearTimeout(fetchTimeout);
    fetchTimeout = setTimeout(fetchTrees, 400);
}

map.on('moveend', debouncedFetch);
loadCache();
fetchTrees();

// --- Search Functionality ---

const searchResults = document.getElementById('search-results') as HTMLDivElement;

let searchTimeout: any = null;

async function performSearch(query: string) {
    if (query.length < 3) {
        searchResults.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
        const data = await response.json();

        if (data && data.length > 0) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'block';

            data.forEach((item: any) => {
                const div = document.createElement('div');
                div.className = 'search-result-item';

                // Try to get a clean name and address
                const name = item.display_name.split(',')[0];
                const address = item.display_name.split(',').slice(1).join(',').trim();

                div.innerHTML = `
                    <span class="search-result-name">${name}</span>
                    <span class="search-result-address">${address}</span>
                `;

                div.onclick = () => {
                    const lat = parseFloat(item.lat);
                    const lon = parseFloat(item.lon);

                    map.setView([lat, lon], 17);

                    // Clear search
                    searchInput.value = '';
                    searchResults.style.display = 'none';

                    // Optional: add a pulse effect or temporary marker
                    const pulse = L.circleMarker([lat, lon], {
                        radius: 10,
                        color: '#38bdf8',
                        fillColor: '#38bdf8',
                        fillOpacity: 0.5
                    }).addTo(map);

                    setTimeout(() => {
                        map.removeLayer(pulse);
                    }, 2000);
                };
                searchResults.appendChild(div);
            });
        } else {
            searchResults.style.display = 'none';
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}

searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value;
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(query), 400);
});

searchInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        if (searchTimeout) clearTimeout(searchTimeout);

        // Check if we already have results
        let firstResult = searchResults.querySelector('.search-result-item') as HTMLElement;

        if (!firstResult && searchInput.value.length >= 3) {
            // Try to fetch results immediately if none are shown
            await performSearch(searchInput.value);
            firstResult = searchResults.querySelector('.search-result-item') as HTMLElement;
        }

        if (firstResult) {
            firstResult.click();
        }
    }
});

// --- Locate Me Functionality ---
if (locateButton) {
    locateButton.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        const originalColor = locateButton.style.color;
        locateButton.style.color = '#38bdf8';

        const my_location_zoom_level = 11;
        const getPosition = (options: PositionOptions) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], my_location_zoom_level);

                    const userMarker = L.circleMarker([latitude, longitude], {
                        radius: 8,
                        color: '#38bdf8',
                        fillColor: '#38bdf8',
                        fillOpacity: 0.6,
                        weight: 2
                    }).addTo(map);

                    const pulse = L.circle([latitude, longitude], {
                        radius: 50,
                        color: '#38bdf8',
                        fillOpacity: 0,
                        weight: 1
                    }).addTo(map);

                    let radius = 50;
                    const animatePulse = () => {
                        radius += 2;
                        pulse.setRadius(radius);
                        pulse.setStyle({ opacity: 1 - (radius / 200) });
                        if (radius < 200) {
                            requestAnimationFrame(animatePulse);
                        } else {
                            map.removeLayer(pulse);
                        }
                    };
                    requestAnimationFrame(animatePulse);

                    setTimeout(() => {
                        map.removeLayer(userMarker);
                    }, 4000);

                    locateButton.style.color = originalColor;
                },
                (error) => {
                    console.error('Geolocation error:', error);

                    // Fallback to lower accuracy if high accuracy failed
                    if (options.enableHighAccuracy && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
                        console.log('High accuracy failed, trying standard accuracy...');
                        getPosition({ enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 });
                        return;
                    }

                    // Last resort: IP-based geolocation
                    if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
                        console.log('Browser geolocation failed, trying IP-based fallback...');
                        fetch('https://ipapi.co/json/')
                            .then(res => res.json())
                            .then(data => {
                                if (data.latitude && data.longitude) {
                                    const lat = data.latitude;
                                    const lon = data.longitude;
                                    map.setView([lat, lon], my_location_zoom_level); // Lower zoom for IP-based as it's less accurate

                                    const userMarker = L.circleMarker([lat, lon], {
                                        radius: 8,
                                        color: '#38bdf8',
                                        fillColor: '#38bdf8',
                                        fillOpacity: 0.6,
                                        weight: 2
                                    }).addTo(map);

                                    setTimeout(() => map.removeLayer(userMarker), 4000);
                                    locateButton.style.color = originalColor;
                                } else {
                                    throw new Error('IP geolocation failed');
                                }
                            })
                            .catch(err => {
                                console.error('IP fallback failed:', err);
                                locateButton.style.color = originalColor;
                                alert('Could not find your location. Please check your system settings.');
                            });
                        return;
                    }

                    locateButton.style.color = originalColor;

                    let errorMsg = 'Could not find your location';
                    if (error.code === error.PERMISSION_DENIED) {
                        errorMsg = 'Location access denied. Please enable it in your browser settings.';
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        errorMsg = 'Location information is unavailable.';
                    } else if (error.code === error.TIMEOUT) {
                        errorMsg = 'Location request timed out.';
                    }
                    alert(errorMsg);
                },
                options
            );
        };

        getPosition({
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 0
        });
    });
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target as Node) && !searchResults.contains(e.target as Node)) {
        searchResults.style.display = 'none';
    }
});
