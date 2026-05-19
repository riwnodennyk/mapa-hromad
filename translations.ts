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
    
    // Budget & popup translations
    admin_level_label: string;
    yearly_budget: string;
    billion: string;
    million: string;
    education: string;
    healthcare: string;
    infrastructure: string;
    social_services: string;
    administration: string;
    wikipedia_article: string;
    search_wikipedia: string;
    open_in_osm: string;
}

export const translations: Record<string, Translation> = {
    en: {
        title: "Hromadas of Ukraine Map",
        description: "Interactive map of hromadas of Ukraine based on OpenStreetMap data.",
        search_placeholder: "Search address...",
        loading_data: "Loading data...",
        searching_server: "Loading...",
        processing: "Processing...",
        servers_overloaded: "Servers overloaded. Try another area.",
        unknown: "Unknown",
        zoom_too_high: "Zoom in to see hromadas",
        no_trees_found: "No hromadas found in this area",
        trees_shown: "{count} hromadas shown",
        locate_me: "Where am I?",
        hromadas: "Hromadas",
        raions: "Raions",
        admin_level_label: "Admin Level",
        yearly_budget: "Yearly Budget",
        billion: "Billion",
        million: "Million",
        education: "Education",
        healthcare: "Healthcare",
        infrastructure: "Infrastructure",
        social_services: "Social Services",
        administration: "Administration",
        wikipedia_article: "📖 Wikipedia Article",
        search_wikipedia: "🔍 Search on Wikipedia",
        open_in_osm: "Open in OSM"
    },
    uk: {
        title: "Мапа громад України",
        description: "Інтерактивна мапа громад України на основі даних OpenStreetMap.",
        search_placeholder: "Пошук адреси...",
        loading_data: "Завантаження даних...",
        searching_server: "Завантаження...",
        processing: "Опрацювання...",
        servers_overloaded: "Сервери перевантажені. Спробуйте іншу ділянку.",
        unknown: "Невідомо",
        zoom_too_high: "Наблизьте карту, щоб побачити громади",
        no_trees_found: "Громад не знайдено в цій ділянці",
        trees_shown: "Показано громад: {count}",
        locate_me: "Де я?",
        hromadas: "Громади",
        raions: "Райони",
        admin_level_label: "Адмін. рівень",
        yearly_budget: "Річний бюджет",
        billion: "млрд",
        million: "млн",
        education: "Освіта",
        healthcare: "Охорона здоров'я",
        infrastructure: "Інфраструктура",
        social_services: "Соціальний захист",
        administration: "Адміністрація",
        wikipedia_article: "📖 Стаття у Вікіпедії",
        search_wikipedia: "🔍 Пошук у Вікіпедії",
        open_in_osm: "Відкрити в OSM"
    },
    de: {
        title: "Karte der Hromadas der Ukraine",
        description: "Interaktive Karte der Hromadas der Ukraine basierend auf OpenStreetMap-Daten.",
        search_placeholder: "Adresse suchen...",
        loading_data: "Daten werden geladen...",
        searching_server: "Wird geladen...",
        processing: "Verarbeitung...",
        servers_overloaded: "Server überlastet. Versuchen Sie einen anderen Bereich.",
        unknown: "Unbekannt",
        zoom_too_high: "Hineinzoomen, um Hromadas zu sehen",
        no_trees_found: "In diesem Bereich wurden keine Hromadas gefunden",
        trees_shown: "{count} Hromadas werden angezeigt",
        locate_me: "Wo bin ich?",
        hromadas: "Hromadas",
        raions: "Rajons",
        admin_level_label: "Admin-Ebene",
        yearly_budget: "Jährliches Budget",
        billion: "Milliarden",
        million: "Millionen",
        education: "Bildung",
        healthcare: "Gesundheitswesen",
        infrastructure: "Infrastruktur",
        social_services: "Sozialdienste",
        administration: "Verwaltung",
        wikipedia_article: "📖 Wikipedia-Artikel",
        search_wikipedia: "🔍 Auf Wikipedia suchen",
        open_in_osm: "In OSM öffnen"
    },
    fr: {
        title: "Carte des Hromadas d'Ukraine",
        description: "Carte interactive des Hromadas d'Ukraine basée sur les données OpenStreetMap.",
        search_placeholder: "Rechercher une adresse...",
        loading_data: "Chargement des données...",
        searching_server: "Chargement...",
        processing: "Traitement...",
        servers_overloaded: "Serveurs surchargés. Essayez une autre zone.",
        unknown: "Inconnu",
        zoom_too_high: "Zoomez pour voir les Hromadas",
        no_trees_found: "Aucune Hromada trouvée dans cette zone",
        trees_shown: "{count} Hromadas affichées",
        locate_me: "Où suis-je ?",
        hromadas: "Hromadas",
        raions: "Raïons",
        admin_level_label: "Niveau d'administration",
        yearly_budget: "Budget annuel",
        billion: "milliard",
        million: "million",
        education: "Éducation",
        healthcare: "Santé",
        infrastructure: "Infrastructure",
        social_services: "Services sociaux",
        administration: "Administration",
        wikipedia_article: "📖 Article Wikipédia",
        search_wikipedia: "🔍 Rechercher sur Wikipédia",
        open_in_osm: "Ouvrir dans OSM"
    },
    es: {
        title: "Mapa de Hromadas de Ucrania",
        description: "Mapa interactivo de Hromadas de Ucrania basado en datos de OpenStreetMap.",
        search_placeholder: "Buscar dirección...",
        loading_data: "Cargando datos...",
        searching_server: "Cargando...",
        processing: "Procesando...",
        servers_overloaded: "Servidores sobrecargados. Intente con otra área.",
        unknown: "Desconocido",
        zoom_too_high: "Acerca el mapa para ver las Hromadas",
        no_trees_found: "No se encontraron Hromadas en esta área",
        trees_shown: "Se muestran {count} Hromadas",
        locate_me: "¿Dónde estoy?",
        hromadas: "Hromadas",
        raions: "Raiones",
        admin_level_label: "Nivel de administración",
        yearly_budget: "Presupuesto anual",
        billion: "mil millones",
        million: "millones",
        education: "Educación",
        healthcare: "Salud",
        infrastructure: "Infraestructura",
        social_services: "Servicios sociales",
        administration: "Administración",
        wikipedia_article: "📖 Artículo de Wikipedia",
        search_wikipedia: "🔍 Buscar en Wikipedia",
        open_in_osm: "Abrir en OSM"
    }
};
