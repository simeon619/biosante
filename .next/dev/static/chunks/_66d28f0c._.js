(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_URL = 'http://localhost:3333/api';
const api = {
    /**
     * Estimate delivery fee based on address and cart total
     */ estimateDelivery: async (address, cartTotal)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/deliveries/estimate`, {
                address,
                cartTotal
            });
            return response.data;
        } catch (error) {
            console.error('Error estimating delivery:', error);
            return null;
        }
    },
    /**
     * Search for places
     */ searchPlaces: async (query)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/deliveries/search`, {
                params: {
                    query
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching places:', error);
            return [];
        }
    },
    /**
     * Create a delivery for a confirmed order
     */ createDelivery: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/deliveries/create`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating delivery:', error);
            throw error;
        }
    },
    /**
     * Initiate payment with Moneroo
     * Creates order and returns checkout URL for redirect
     */ initiatePayment: async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/payments/initiate`, data);
        return response.data;
    },
    /**
     * Verify payment status
     * Called when customer returns from Moneroo checkout
     */ verifyPayment: async (paymentId, orderId)=>{
        const params = {};
        if (orderId) params.orderId = orderId;
        const url = paymentId ? `${API_URL}/payments/verify/${paymentId}` : `${API_URL}/payments/verify`;
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(url, {
            params
        });
        return response.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/data/companies.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "companies",
    ()=>companies
]);
const companies = [
    {
        "id": "utb",
        "name": "UTB (Union des Transports de Bouaké)",
        "hub_principal": "Abidjan (Adjamé, Koumassi, Yopougon)",
        "type": "National",
        "regions_desservies": [
            "Centre",
            "Nord",
            "Ouest",
            "Est",
            "Sud-Ouest"
        ],
        "contact_colis": "0707000000",
        "destinations": [
            "Abidjan",
            "Yamoussoukro",
            "Bouaké",
            "Daloa",
            "Gagnoa",
            "San Pedro",
            "Man",
            "Korhogo",
            "Odienné",
            "Bondoukou",
            "Abengourou",
            "Soubré",
            "Bouaflé",
            "Divo",
            "Toumodi",
            "Sinfra",
            "Issia",
            "Duékoué",
            "Agnibilékrou",
            "Tanda",
            "Bocanda",
            "Daoukro"
        ]
    },
    {
        "id": "tsr",
        "name": "TSR (Transport Sans Rayon)",
        "hub_principal": "Abidjan (Adjamé)",
        "type": "National",
        "regions_desservies": [
            "Nord",
            "Ouest",
            "Est",
            "Centre"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "Yamoussoukro",
            "Bouaké",
            "Korhogo",
            "Ferkessédougou",
            "Boundiali",
            "Tengréla",
            "Man",
            "Danané",
            "Duékoué",
            "Guiglo",
            "Daloa",
            "Issia",
            "Vavoua",
            "Séguéla",
            "Mankono",
            "Bondoukou",
            "Bouna",
            "Daoukro"
        ]
    },
    {
        "id": "sbta",
        "name": "SBTA",
        "hub_principal": "Abidjan (Adjamé, Yopougon, Koumassi)",
        "type": "Grand Régional",
        "regions_desservies": [
            "Sud-Ouest",
            "Centre-Ouest",
            "Est"
        ],
        "contact_colis": "0576207777",
        "destinations": [
            "Abidjan",
            "Divo",
            "Lakota",
            "Gagnoa",
            "Soubré",
            "Méagui",
            "San Pedro",
            "Sassandra",
            "Grand-Béréby",
            "Oumé",
            "Diegonefla",
            "Abengourou",
            "Bondoukou"
        ]
    },
    {
        "id": "ot_ci",
        "name": "OT-CI (Omnis Transport)",
        "hub_principal": "Abidjan (Adjamé)",
        "type": "Régional & International",
        "regions_desservies": [
            "Ouest",
            "International"
        ],
        "contact_colis": "0708611770",
        "destinations": [
            "Abidjan",
            "Man",
            "Danané",
            "Zouan-Hounien",
            "Duékoué",
            "Toulepleu"
        ]
    },
    {
        "id": "etv",
        "name": "ETV (Entente Transport Voyageurs)",
        "hub_principal": "Abidjan (Adjamé, Abobo)",
        "type": "Spécialiste Nord",
        "regions_desservies": [
            "Nord"
        ],
        "contact_colis": "0777657448",
        "destinations": [
            "Abidjan",
            "Bouaké",
            "Niakara",
            "Tafiré",
            "Korhogo",
            "Ferkessédougou",
            "Ouangolodougou",
            "Pogo",
            "Diawala",
            "Niellé"
        ]
    },
    {
        "id": "ocean_ci",
        "name": "Océan Côte d'Ivoire",
        "hub_principal": "Abidjan (Treichville, Adjamé)",
        "type": "Spécialiste Est",
        "regions_desservies": [
            "Est",
            "Sud-Est"
        ],
        "contact_colis": "0799242366",
        "destinations": [
            "Abidjan",
            "Aboisso",
            "Adzopé",
            "Akoupé",
            "Abengourou",
            "Agnibilékrou",
            "Bondoukou",
            "Koun-Fao",
            "Tanda"
        ]
    },
    {
        "id": "jet_express",
        "name": "JET Express",
        "hub_principal": "Abidjan (Adjamé, Koumassi)",
        "type": "Spécialiste Sud-Ouest",
        "regions_desservies": [
            "Sud-Ouest"
        ],
        "contact_colis": "0700146565",
        "destinations": [
            "Abidjan",
            "San Pedro",
            "Tabou",
            "Grand-Béréby",
            "Gabiadiji"
        ]
    },
    {
        "id": "stb",
        "name": "STB (Société de Transport Bakayoko)",
        "hub_principal": "Abidjan (Abobo, Adjamé)",
        "type": "Spécialiste Nord",
        "regions_desservies": [
            "Nord"
        ],
        "contact_colis": "0504145580",
        "destinations": [
            "Abidjan",
            "Korhogo"
        ]
    },
    {
        "id": "mt",
        "name": "MT (Massa Transport)",
        "hub_principal": "Abidjan (Adjamé)",
        "type": "Régional Ouest",
        "regions_desservies": [
            "Ouest"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "Daloa",
            "Duékoué",
            "Man",
            "Danané",
            "Bangolo"
        ]
    },
    {
        "id": "avs",
        "name": "AVS (Aek Voyageurs)",
        "hub_principal": "Abidjan (Deux-Plateaux, Adjamé)",
        "type": "Premium Centre",
        "regions_desservies": [
            "Centre"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "Toumodi",
            "Yamoussoukro",
            "Bouaké"
        ]
    },
    {
        "id": "gti",
        "name": "GTI Transport",
        "hub_principal": "Gagnoa / Abidjan",
        "type": "Régional",
        "regions_desservies": [
            "Centre-Ouest",
            "Est"
        ],
        "contact_colis": "0545206204",
        "destinations": [
            "Abidjan",
            "Gagnoa",
            "Abengourou",
            "Oumé"
        ]
    },
    {
        "id": "cte",
        "name": "CTE",
        "hub_principal": "Abidjan",
        "type": "Régional Nord",
        "regions_desservies": [
            "Nord"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "Bouaké",
            "Katiola",
            "Korhogo",
            "Ferkessédougou"
        ]
    },
    {
        "id": "bad",
        "name": "Badjan Transport",
        "hub_principal": "Abidjan (Adjamé)",
        "type": "Historique Est",
        "regions_desservies": [
            "Est"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "Bondoukou",
            "Bouna",
            "Tanda"
        ]
    },
    {
        "id": "sido",
        "name": "SIDO Transport",
        "hub_principal": "Abidjan (Abobo)",
        "type": "Régional Nord",
        "regions_desservies": [
            "Nord"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "Boundiali",
            "Korhogo",
            "Tengréla"
        ]
    },
    {
        "id": "waridi",
        "name": "Waridi Transport",
        "hub_principal": "Abidjan",
        "type": "Régional Nord-Ouest",
        "regions_desservies": [
            "Nord-Ouest"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "Séguéla",
            "Kani",
            "Dianra",
            "Mankono"
        ]
    },
    {
        "id": "adja",
        "name": "Adja Transport",
        "hub_principal": "Abidjan",
        "type": "Régional Nord-Ouest",
        "regions_desservies": [
            "Nord-Ouest"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "Odienné",
            "Touba",
            "Madinani"
        ]
    },
    {
        "id": "st",
        "name": "ST (Sama Transport)",
        "hub_principal": "Abidjan",
        "type": "Régional Ouest",
        "regions_desservies": [
            "Ouest"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "Daloa",
            "Man",
            "Issia"
        ]
    },
    {
        "id": "ck",
        "name": "CK (Carrefour Kléber)",
        "hub_principal": "Abidjan",
        "type": "Régional Sud-Ouest",
        "regions_desservies": [
            "Sud-Ouest"
        ],
        "contact_colis": "",
        "destinations": [
            "Abidjan",
            "San Pedro",
            "Sassandra",
            "Tabou"
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CheckoutPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckoutPage",
    ()=>CheckoutPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crosshair$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crosshair$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crosshair.js [app-client] (ecmascript) <export default as Crosshair>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/banknote.js [app-client] (ecmascript) <export default as Banknote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$companies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/data/companies.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const CheckoutPage = ({ cart, onBack, onClearCart })=>{
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        phone: '',
        email: '',
        addressNote: '',
        address: ''
    });
    const [paymentError, setPaymentError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [paymentMethod, setPaymentMethod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('cash');
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [orderPlaced, setOrderPlaced] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // New: Region & Company Selection
    const [isAbidjanRegion, setIsAbidjanRegion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedCompany, setSelectedCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [availableCompanies, setAvailableCompanies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Real-time Fee Estimation State
    const [estimatedFee, setEstimatedFee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1000);
    const [isEstimating, setIsEstimating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [distanceKm, setDistanceKm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Autocomplete State
    const [suggestions, setSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showSuggestions, setShowSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const searchTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Totals Calculation
    const subTotal = cart.reduce((sum, item)=>sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((acc, item)=>acc + item.quantity, 0);
    const isEligibleForOffer = totalItems >= 2;
    // Final Delivery Fee logic:
    // If eligible -> 0
    // Else -> estimatedFee (from backend)
    const deliveryFee = isEligibleForOffer ? 0 : estimatedFee;
    const discountAmount = isEligibleForOffer ? subTotal * 0.05 : 0;
    const total = subTotal + deliveryFee - discountAmount;
    // Detect if location is in Greater Abidjan
    const checkIsAbidjan = (address)=>{
        const abidjanKeywords = [
            'Abidjan',
            'Anyama',
            'Bingerville',
            'Port-Bouët',
            'Grand-Bassam',
            'Songon',
            'Cocody',
            'Plateau',
            'Yopougon',
            'Adjamé',
            'Marcory',
            'Koumassi',
            'Treichville',
            'Attécoubé',
            'Abobo'
        ];
        const isAbidjan = abidjanKeywords.some((keyword)=>address.toLowerCase().includes(keyword.toLowerCase()));
        setIsAbidjanRegion(isAbidjan);
        if (!isAbidjan) {
            // Find companies serving this city
            // Simple string matching for now
            const foundCompanies = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$companies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["companies"].filter((c)=>c.destinations.some((dest)=>address.toLowerCase().includes(dest.toLowerCase())));
            setAvailableCompanies(foundCompanies);
        // If upcountry, estimated fee might be different or fixed. 
        // For now, keeping default estimation but could override here.
        // setEstimatedFee(2000); // Example
        } else {
            setAvailableCompanies([]);
            setSelectedCompany(null);
        }
        return isAbidjan;
    };
    // Core Update Logic
    const updateLocation = async (lat, lng, fromMapDrag = false)=>{
        setLocation({
            lat,
            lng
        });
        setIsEstimating(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].estimateDelivery(`${lat},${lng}`, subTotal);
            if (result) {
                setEstimatedFee(result.fee);
                setDistanceKm(result.distanceKm);
                if (fromMapDrag && result.destination?.address) {
                    setFormData((prev)=>{
                        const newState = {
                            ...prev,
                            address: result.destination.address
                        };
                        checkIsAbidjan(result.destination.address);
                        return newState;
                    });
                }
            }
        } catch (e) {
            console.error(e);
        } finally{
            setIsEstimating(false);
        }
    };
    // Initialize Map
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            // Only init map if in Abidjan Mode
            if (!isAbidjanRegion) return;
            // Safety Check for Leaflet
            if (typeof L === 'undefined') {
                // alert("Erreur de chargement de la carte. Veuillez vérifier votre connexion internet.");
                return;
            }
            try {
                if (mapContainerRef.current && !mapRef.current) {
                    // Start centered on Abidjan
                    const defaultLat = 5.3484;
                    const defaultLng = -4.0305;
                    // Restrict to Côte d'Ivoire
                    const map = L.map(mapContainerRef.current, {
                        maxBounds: [
                            [
                                4.3,
                                -8.7
                            ],
                            [
                                10.8,
                                -2.5
                            ]
                        ],
                        minZoom: 6
                    }).setView([
                        defaultLat,
                        defaultLng
                    ], 13);
                    // PROXY LOCAL (Nginx) - Caches tiles to avoid OSM limits and speed up loading
                    // Source: geo-services/docker-compose.yml (nginx-tiles service)
                    L.tileLayer('http://localhost:8081/osm/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(map);
                    // Icon
                    const icon = L.icon({
                        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                        iconSize: [
                            25,
                            41
                        ],
                        iconAnchor: [
                            12,
                            41
                        ]
                    });
                    const marker = L.marker([
                        defaultLat,
                        defaultLng
                    ], {
                        draggable: true,
                        icon
                    }).addTo(map);
                    markerRef.current = marker;
                    setLocation({
                        lat: defaultLat,
                        lng: defaultLng
                    });
                    // Events
                    marker.on('dragend', {
                        "CheckoutPage.useEffect": function(event) {
                            const { lat, lng } = marker.getLatLng();
                            updateLocation(lat, lng, true);
                        }
                    }["CheckoutPage.useEffect"]);
                    map.on('click', {
                        "CheckoutPage.useEffect": function(e) {
                            marker.setLatLng(e.latlng);
                            const { lat, lng } = e.latlng;
                            updateLocation(lat, lng, true);
                        }
                    }["CheckoutPage.useEffect"]);
                    mapRef.current = map;
                    // Initial estimate at start location
                    if (!location) {
                        updateLocation(defaultLat, defaultLng);
                    }
                }
            } catch (error) {
                console.error("Map initialization failed:", error);
            }
        }
    }["CheckoutPage.useEffect"], [
        subTotal,
        isAbidjanRegion
    ]); // Re-run if switching back to Abidjan
    // Handle Input Change with Debounce Search
    const handleAddressChange = (e)=>{
        const val = e.target.value;
        setFormData({
            ...formData,
            address: val
        });
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (val.length > 2) {
            searchTimeoutRef.current = setTimeout(async ()=>{
                const results = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].searchPlaces(val);
                setSuggestions(results);
                setShowSuggestions(true);
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };
    const handleSuggestionClick = (place)=>{
        // Update text
        setFormData({
            ...formData,
            address: place.display_name
        });
        // Check Region
        const isAbj = checkIsAbidjan(place.display_name);
        if (isAbj) {
            // Update Map & Fee
            if (mapRef.current && markerRef.current) {
                const newLatLng = new L.LatLng(place.lat, place.lon);
                markerRef.current.setLatLng(newLatLng);
                mapRef.current.panTo(newLatLng);
            }
            // Trigger update logic
            setLocation({
                lat: place.lat,
                lng: place.lon
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].estimateDelivery(`${place.lat},${place.lon}`, subTotal).then((res)=>{
                if (res) {
                    setEstimatedFee(res.fee);
                    setDistanceKm(res.distanceKm);
                }
            });
        } else {
            // Outside Abidjan: Just set location for reference or fee calc, but hide map
            setLocation({
                lat: place.lat,
                lng: place.lon
            });
            // Estimation might be different for upcountry companies
            // For now keep standard estimation
            __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].estimateDelivery(`${place.lat},${place.lon}`, subTotal).then((res)=>{
                if (res) {
                    setEstimatedFee(res.fee);
                    setDistanceKm(res.distanceKm);
                }
            });
        }
        // Clear UI
        setSuggestions([]);
        setShowSuggestions(false);
    };
    const handleGeolocation = ()=>{
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        setIsEstimating(true);
        navigator.geolocation.getCurrentPosition((position)=>{
            const { latitude, longitude } = position.coords;
            // Check bounds (Roughly CI)
            if (latitude < 4.3 || latitude > 10.8 || longitude < -8.7 || longitude > -2.5) {
                alert("Votre position semble être hors de la Côte d'Ivoire.");
                setIsEstimating(false);
                return;
            }
            if (mapRef.current && markerRef.current) {
                const newLatLng = new L.LatLng(latitude, longitude);
                markerRef.current.setLatLng(newLatLng);
                mapRef.current.setView(newLatLng, 15);
                // Trigger update
                updateLocation(latitude, longitude, true);
            }
        }, (error)=>{
            console.error(error);
            setIsEstimating(false);
            alert("Impossible de récupérer votre position. Vérifiez vos autorisations GPS.");
        });
    };
    // Handle Address Text Change (Blur or specific button)
    const handleAddressBlur = async ()=>{
        if (!formData.address) return;
        setIsEstimating(true);
        try {
            // Forward Geocoding via Backend
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].estimateDelivery(formData.address, subTotal);
            if (result && result.destination) {
                const { lat, lon, address } = result.destination;
                checkIsAbidjan(address);
                // Update map
                if (isAbidjanRegion && mapRef.current && markerRef.current) {
                    const newLatLng = new L.LatLng(lat, lon);
                    markerRef.current.setLatLng(newLatLng);
                    mapRef.current.panTo(newLatLng);
                }
                // Update state
                setLocation({
                    lat,
                    lng: lon
                });
                setEstimatedFee(result.fee);
                setDistanceKm(result.distanceKm);
            }
        } catch (e) {
            console.error("Address lookup failed", e);
        } finally{
            setIsEstimating(false);
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setPaymentError(null);
        if (!formData.name || !formData.phone || !location) {
            alert("Veuillez remplir vos informations.");
            return;
        }
        // Validate Company Selection for Upcountry
        if (!isAbidjanRegion && !selectedCompany) {
            alert("Veuillez choisir une compagnie de transport.");
            return;
        }
        setIsSubmitting(true);
        const finalAddress = !isAbidjanRegion && selectedCompany ? `${formData.address} (Via ${selectedCompany.name})` : `${formData.address} (GPS: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)})`;
        // CASH ON DELIVERY FLOW
        if (paymentMethod === 'cash') {
            const orderId = 'CMD-' + Math.floor(Math.random() * 1000000);
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].createDelivery({
                    orderId,
                    address: `${finalAddress} ${formData.addressNote ? '- ' + formData.addressNote : ''}`,
                    lat: location.lat,
                    lon: location.lng,
                    fee: deliveryFee,
                    customerName: formData.name,
                    customerPhone: formData.phone
                });
                setOrderPlaced(true);
                onClearCart();
            } catch (error) {
                console.error(error);
                setPaymentError("Erreur lors de la commande. Veuillez réessayer.");
            } finally{
                setIsSubmitting(false);
            }
            return;
        }
        // ONLINE PAYMENT FLOW (Moneroo)
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].initiatePayment({
                cart: cart,
                customer: {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email || undefined
                },
                delivery: {
                    address: finalAddress,
                    lat: location.lat,
                    lon: location.lng,
                    fee: deliveryFee,
                    addressNote: formData.addressNote || undefined
                }
            });
            sessionStorage.setItem('pendingOrderId', result.orderId);
            window.location.href = result.checkoutUrl;
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentError(error.response?.data?.message || "Erreur lors de l'initialisation du paiement. Veuillez réessayer.");
            setIsSubmitting(false);
        }
    };
    const handleWhatsApp = ()=>{
        // ... (Same logic as before)
        // keeping it simple
        const url = `https://wa.me/2250143678397?text=Mon%20numero%20commande%20${Math.floor(Math.random() * 1000)}`;
        window.open(url, '_blank');
    };
    if (orderPlaced) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                            className: "w-10 h-10 text-green-600"
                        }, void 0, false, {
                            fileName: "[project]/components/CheckoutPage.tsx",
                            lineNumber: 385,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/CheckoutPage.tsx",
                        lineNumber: 384,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-gray-900 mb-2",
                        children: "Commande Reçue !"
                    }, void 0, false, {
                        fileName: "[project]/components/CheckoutPage.tsx",
                        lineNumber: 387,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 mb-8",
                        children: [
                            "Merci ",
                            formData.name,
                            ". Nous vous contacterons au ",
                            formData.phone,
                            " pour la livraison."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CheckoutPage.tsx",
                        lineNumber: 388,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onBack,
                                className: "w-full py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50",
                                children: "Retour à l'accueil"
                            }, void 0, false, {
                                fileName: "[project]/components/CheckoutPage.tsx",
                                lineNumber: 392,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleWhatsApp,
                                className: "w-full py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E]",
                                children: "Suivre sur WhatsApp"
                            }, void 0, false, {
                                fileName: "[project]/components/CheckoutPage.tsx",
                                lineNumber: 395,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CheckoutPage.tsx",
                        lineNumber: 391,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/CheckoutPage.tsx",
                lineNumber: 383,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/CheckoutPage.tsx",
            lineNumber: 382,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 flex flex-col text-gray-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-4 md:px-8 flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "p-2 hover:bg-gray-100 rounded-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            className: "w-6 h-6"
                        }, void 0, false, {
                            fileName: "[project]/components/CheckoutPage.tsx",
                            lineNumber: 409,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/CheckoutPage.tsx",
                        lineNumber: 408,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-bold",
                        children: "Finaliser la commande"
                    }, void 0, false, {
                        fileName: "[project]/components/CheckoutPage.tsx",
                        lineNumber: 411,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/CheckoutPage.tsx",
                lineNumber: 407,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-bold text-lg mb-4 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            className: "w-5 h-5 mr-2 text-primary-600"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 420,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        isAbidjanRegion ? "Lieu de livraison" : "Ville & Compagnie"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CheckoutPage.tsx",
                                    lineNumber: 419,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4 relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            className: "pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm",
                                            placeholder: "Rechercher une ville (ex: Bouaké) ou quartier...",
                                            value: formData.address,
                                            onChange: handleAddressChange,
                                            onBlur: ()=>setTimeout(()=>setShowSuggestions(false), 200)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 425,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            className: "absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 433,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        isEstimating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-3 top-3.5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-5 h-5 animate-spin text-primary-600"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 434,
                                                columnNumber: 88
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 434,
                                            columnNumber: 46
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        showSuggestions && suggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto",
                                            children: suggestions.map((place, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 text-sm",
                                                    onClick: ()=>handleSuggestionClick(place),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-medium text-gray-800 truncate",
                                                            children: place.display_name.split(',')[0]
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                            lineNumber: 445,
                                                            columnNumber: 45
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 truncate",
                                                            children: place.display_name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                            lineNumber: 446,
                                                            columnNumber: 45
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 438,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CheckoutPage.tsx",
                                    lineNumber: 424,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                isAbidjanRegion ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500 mb-4",
                                            children: "Ou déplacez le marqueur rouge sur la carte pour plus de précision."
                                        }, void 0, false, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 456,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-h-[400px] rounded-xl overflow-hidden border border-gray-300 relative z-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: mapContainerRef,
                                                    className: "w-full h-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: handleGeolocation,
                                                    className: "absolute bottom-4 right-4 z-[400] bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all border border-gray-200",
                                                    title: "Ma position",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crosshair$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crosshair$3e$__["Crosshair"], {
                                                        className: "w-6 h-6 text-gray-700"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 469,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 463,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 460,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                                        className: "w-5 h-5 text-yellow-600 mt-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 477,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-yellow-800",
                                                                children: "Livraison hors Abidjan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 479,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-yellow-700 mt-1",
                                                                children: "Pour les villes de l'intérieur, nous expédions par car. Veuillez choisir votre compagnie de transport préférée ci-dessous."
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 480,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 478,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 476,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 475,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        availableCompanies.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 gap-3",
                                            children: availableCompanies.map((company)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: `flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${selectedCompany?.id === company.id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "radio",
                                                            name: "company",
                                                            className: "sr-only",
                                                            checked: selectedCompany?.id === company.id,
                                                            onChange: ()=>setSelectedCompany(company)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                            lineNumber: 498,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                                                className: "w-5 h-5 text-gray-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 506,
                                                                columnNumber: 53
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                            lineNumber: 505,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-bold text-gray-900",
                                                                    children: company.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                                    lineNumber: 509,
                                                                    columnNumber: 53
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-gray-500",
                                                                    children: company.type
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                                    lineNumber: 510,
                                                                    columnNumber: 53
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                            lineNumber: 508,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        selectedCompany?.id === company.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                            className: "w-5 h-5 text-primary-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                            lineNumber: 513,
                                                            columnNumber: 53
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, company.id, true, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 491,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 489,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "Aucune compagnie trouvée pour cette destination."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 520,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm mt-2",
                                                    children: "Essayez une ville proche ou contactez-nous."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 521,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 519,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CheckoutPage.tsx",
                                    lineNumber: 474,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500",
                                                    children: "Distance (depuis Yopougon)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 530,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-bold text-lg",
                                                    children: [
                                                        distanceKm,
                                                        " km"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 531,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 529,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-right",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500",
                                                    children: "Frais de livraison"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 534,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                isEstimating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "w-5 h-5 animate-spin mx-auto text-primary-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 536,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-bold text-xl text-primary-600",
                                                    children: isEligibleForOffer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-green-600",
                                                        children: "Offerts"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 539,
                                                        columnNumber: 63
                                                    }, ("TURBOPACK compile-time value", void 0)) : `${estimatedFee} FCFA`
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CheckoutPage.tsx",
                                            lineNumber: 533,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CheckoutPage.tsx",
                                    lineNumber: 528,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CheckoutPage.tsx",
                            lineNumber: 418,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/CheckoutPage.tsx",
                        lineNumber: 417,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-bold text-gray-800 mb-4",
                                        children: "Récapitulatif"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CheckoutPage.tsx",
                                        lineNumber: 552,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            cart.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold text-gray-500",
                                                                    children: [
                                                                        item.quantity,
                                                                        "x"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                                    lineNumber: 557,
                                                                    columnNumber: 41
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: item.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                                    lineNumber: 558,
                                                                    columnNumber: 41
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                            lineNumber: 556,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                (item.price * item.quantity).toLocaleString(),
                                                                " F"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                            lineNumber: 560,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/components/CheckoutPage.tsx",
                                                    lineNumber: 555,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t border-gray-100 my-2 pt-2 space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-gray-600",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Sous-total"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 565,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    subTotal.toLocaleString(),
                                                                    " F"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 566,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 564,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-gray-600",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Livraison"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 569,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: deliveryFee === 0 ? 'Gratuite' : `${deliveryFee} F`
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 570,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 568,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    discountAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-green-600 font-medium",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Réduction (-5%)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 574,
                                                                columnNumber: 41
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "-",
                                                                    discountAmount.toLocaleString(),
                                                                    " F"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 575,
                                                                columnNumber: 41
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 573,
                                                        columnNumber: 37
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-xl font-bold text-gray-900 pt-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Total à payer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 579,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    total.toLocaleString(),
                                                                    " F"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 580,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 578,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 563,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CheckoutPage.tsx",
                                        lineNumber: 553,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CheckoutPage.tsx",
                                lineNumber: 551,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-bold text-gray-800 mb-4",
                                        children: "Vos Coordonnées"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CheckoutPage.tsx",
                                        lineNumber: 588,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSubmit,
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Nom complet"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                className: "absolute left-3 top-3 w-5 h-5 text-gray-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 593,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                className: "pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all",
                                                                placeholder: "Votre nom",
                                                                required: true,
                                                                value: formData.name,
                                                                onChange: (e)=>setFormData({
                                                                        ...formData,
                                                                        name: e.target.value
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 594,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 592,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 590,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Téléphone"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 605,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                className: "absolute left-3 top-3 w-5 h-5 text-gray-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 607,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "tel",
                                                                className: "pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all",
                                                                placeholder: "+225...",
                                                                required: true,
                                                                value: formData.phone,
                                                                onChange: (e)=>setFormData({
                                                                        ...formData,
                                                                        phone: e.target.value
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 608,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 606,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 604,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Email (facultatif)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 619,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                className: "absolute left-3 top-3 w-5 h-5 text-gray-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 621,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "email",
                                                                className: "pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all",
                                                                placeholder: "votre@email.com",
                                                                value: formData.email,
                                                                onChange: (e)=>setFormData({
                                                                        ...formData,
                                                                        email: e.target.value
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 622,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 620,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 618,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Note pour le livreur (facultatif)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 632,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        className: "w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all",
                                                        placeholder: "Ex: Appeler en arrivant, maison portail bleu...",
                                                        rows: 2,
                                                        value: formData.addressNote,
                                                        onChange: (e)=>setFormData({
                                                                ...formData,
                                                                addressNote: e.target.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 633,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 631,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-3",
                                                        children: "Mode de paiement"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 644,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: `flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "radio",
                                                                        name: "paymentMethod",
                                                                        value: "cash",
                                                                        checked: paymentMethod === 'cash',
                                                                        onChange: ()=>setPaymentMethod('cash'),
                                                                        className: "sr-only"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                        lineNumber: 653,
                                                                        columnNumber: 41
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `p-2 rounded-full ${paymentMethod === 'cash' ? 'bg-green-100' : 'bg-gray-100'}`,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__["Banknote"], {
                                                                            className: `w-6 h-6 ${paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-500'}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                                            lineNumber: 662,
                                                                            columnNumber: 45
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                        lineNumber: 661,
                                                                        columnNumber: 41
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-semibold text-gray-900",
                                                                                children: "Paiement à la livraison"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                                lineNumber: 665,
                                                                                columnNumber: 45
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm text-gray-500",
                                                                                children: "Payez en espèces au livreur"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                                lineNumber: 666,
                                                                                columnNumber: 45
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                        lineNumber: 664,
                                                                        columnNumber: 41
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    paymentMethod === 'cash' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                        className: "w-5 h-5 text-green-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                        lineNumber: 669,
                                                                        columnNumber: 45
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 647,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: `flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "radio",
                                                                        name: "paymentMethod",
                                                                        value: "online",
                                                                        checked: paymentMethod === 'online',
                                                                        onChange: ()=>setPaymentMethod('online'),
                                                                        className: "sr-only"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                        lineNumber: 680,
                                                                        columnNumber: 41
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `p-2 rounded-full ${paymentMethod === 'online' ? 'bg-primary-100' : 'bg-gray-100'}`,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                                                            className: `w-6 h-6 ${paymentMethod === 'online' ? 'text-primary-600' : 'text-gray-500'}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CheckoutPage.tsx",
                                                                            lineNumber: 689,
                                                                            columnNumber: 45
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                        lineNumber: 688,
                                                                        columnNumber: 41
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-semibold text-gray-900",
                                                                                children: "Paiement Mobile Money"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                                lineNumber: 692,
                                                                                columnNumber: 45
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mt-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs font-medium px-2 py-0.5 bg-orange-100 text-orange-700 rounded",
                                                                                        children: "Orange"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                                        lineNumber: 694,
                                                                                        columnNumber: 49
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs font-medium px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded",
                                                                                        children: "MTN"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                                        lineNumber: 695,
                                                                                        columnNumber: 49
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded",
                                                                                        children: "Wave"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                                        lineNumber: 696,
                                                                                        columnNumber: 49
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded",
                                                                                        children: "Moov"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                                        lineNumber: 697,
                                                                                        columnNumber: 49
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                                lineNumber: 693,
                                                                                columnNumber: 45
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                        lineNumber: 691,
                                                                        columnNumber: 41
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    paymentMethod === 'online' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                        className: "w-5 h-5 text-primary-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                                        lineNumber: 701,
                                                                        columnNumber: 45
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                                lineNumber: 674,
                                                                columnNumber: 37
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 645,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 643,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            paymentError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm",
                                                children: paymentError
                                            }, void 0, false, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 708,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: isSubmitting,
                                                className: "w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center mt-4",
                                                children: [
                                                    isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        className: "animate-spin mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 719,
                                                        columnNumber: 37
                                                    }, ("TURBOPACK compile-time value", void 0)) : paymentMethod === 'cash' ? 'Confirmer la commande' : 'Payer maintenant',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                        className: "ml-2 w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CheckoutPage.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 713,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-center text-xs text-gray-500 mt-2",
                                                children: paymentMethod === 'cash' ? 'Paiement en espèces à la livraison. Satisfait ou remboursé.' : 'Paiement sécurisé par Mobile Money'
                                            }, void 0, false, {
                                                fileName: "[project]/components/CheckoutPage.tsx",
                                                lineNumber: 727,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CheckoutPage.tsx",
                                        lineNumber: 589,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CheckoutPage.tsx",
                                lineNumber: 587,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CheckoutPage.tsx",
                        lineNumber: 548,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/CheckoutPage.tsx",
                lineNumber: 414,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/CheckoutPage.tsx",
        lineNumber: 405,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CheckoutPage, "3w3tttncOvBBq3u/uj0csnDhjOU=");
_c = CheckoutPage;
var _c;
__turbopack_context__.k.register(_c, "CheckoutPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/panier/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CheckoutPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CheckoutPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Page() {
    _s();
    const { cart, clearCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CheckoutPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckoutPage"], {
        cart: cart,
        onBack: ()=>router.push('/produits'),
        onClearCart: clearCart
    }, void 0, false, {
        fileName: "[project]/app/panier/page.tsx",
        lineNumber: 12,
        columnNumber: 9
    }, this);
}
_s(Page, "3iNpsC7o20G/Plzhft8XftfnlKE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Page;
var _c;
__turbopack_context__.k.register(_c, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_66d28f0c._.js.map