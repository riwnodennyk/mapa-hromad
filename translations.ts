export interface Translation {
    title: string;
    description: string;
    search_placeholder: string;
    loading_data: string;
    searching_server: string;
    processing: string;
    servers_overloaded: string;
    legend_title?: string;
    unknown: string;
    zoom_too_high: string;
    no_trees_found: string;
    trees_shown: string;
    locate_me: string;
    hromadas?: string;
    raions?: string;
}

export const translations: Record<string, Translation> = {
    en: {
        title: "Communities Map",
        description: "Interactive map showing communities based on OpenStreetMap data.",
        search_placeholder: "Search address...",
        loading_data: "Loading data...",
        searching_server: "Searching for fastest server...",
        processing: "Processing...",
        servers_overloaded: "Servers overloaded. Try another area.",
        unknown: "Unknown",
        zoom_too_high: "Zoom in to see areas",
        no_trees_found: "No areas found in this region",
        trees_shown: "{count} areas are shown",
        locate_me: "Locate me",
        hromadas: "Hromadas",
        raions: "Raions"
    },
    uk: {
        title: "Мапа громад",
        description: "Інтерактивна мапа громад на основі даних OpenStreetMap.",
        search_placeholder: "Пошук адреси...",
        loading_data: "Завантаження даних...",
        searching_server: "Пошук найшвидшого сервера...",
        processing: "Опрацювання...",
        servers_overloaded: "Сервери перевантажені. Спробуйте іншу ділянку.",
        unknown: "Невідомо",
        zoom_too_high: "Наблизьте карту, щоб побачити громади",
        no_trees_found: "Громад не знайдено в цій області",
        trees_shown: "Показано громад: {count}",
        locate_me: "Де я?",
        hromadas: "Громади",
        raions: "Райони"
    },
    de: {
        title: "Baumarten-Karte",
        description: "Interaktive Karte, die zeigt, wo bestimmte Baumarten wachsen, basierend auf OpenStreetMap-Daten.",
        search_placeholder: "Adresse suchen...",
        loading_data: "Daten werden geladen...",
        searching_server: "Suche nach dem schnellsten Server...",
        processing: "Verarbeitung...",
        servers_overloaded: "Server überlastet. Versuchen Sie einen anderen Bereich.",
        unknown: "Unbekannt",
        zoom_too_high: "Hineinzoomen, um Bäume zu sehen",
        no_trees_found: "In diesem Bereich wurden keine Bäume gefunden",
        trees_shown: "{count} Bäume werden angezeigt",
        locate_me: "Meinen Standort finden"
    },
    fr: {
        title: "Carte des espèces d'arbres",
        description: "Carte interactive montrant où poussent des types d'arbres spécifiques basés sur les données OpenStreetMap.",
        search_placeholder: "Rechercher une adresse...",
        loading_data: "Chargement des données...",
        searching_server: "Recherche du serveur le plus rapide...",
        processing: "Traitement...",
        servers_overloaded: "Serveurs surchargés. Essayez une autre zone.",
        unknown: "Inconnu",
        zoom_too_high: "Zoomez pour voir les arbres",
        no_trees_found: "Aucun arbre trouvé dans cette zone",
        trees_shown: "{count} arbres sont affichés",
        locate_me: "Me localiser"
    },
    es: {
        title: "Mapa de especies de árboles",
        description: "Mapa interactivo que muestra dónde crecen tipos específicos de árboles según los datos de OpenStreetMap.",
        search_placeholder: "Buscar dirección...",
        loading_data: "Cargando datos...",
        searching_server: "Buscando el servidor más rápido...",
        processing: "Procesando...",
        servers_overloaded: "Servidores sobrecargados. Intente con otra área.",
        unknown: "Desconocido",
        zoom_too_high: "Acerca el mapa para ver los árboles",
        no_trees_found: "No se encontraron árboles en esta área",
        trees_shown: "Se muestran {count} árboles",
        locate_me: "Mi ubicación"
    }
};
