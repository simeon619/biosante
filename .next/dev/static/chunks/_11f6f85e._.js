(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/exp_cie.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v([{"id":"utb","name":"UTB (Union des Transports de Bouaké)","hub_principal":"Abidjan (Adjamé, Koumassi, Yopougon)","type":"National","regions_desservies":["Centre","Nord","Ouest","Est","Sud-Ouest"],"contact_colis":"0707000000","destinations":["Abidjan","Yamoussoukro","Bouaké","Daloa","Gagnoa","San Pedro","Man","Korhogo","Odienné","Bondoukou","Abengourou","Soubré","Bouaflé","Divo","Toumodi","Sinfra","Issia","Duékoué","Agnibilékrou","Tanda","Bocanda","Daoukro"]},{"id":"tsr","name":"TSR (Transport Sans Rayon)","hub_principal":"Abidjan (Adjamé)","type":"National","regions_desservies":["Nord","Ouest","Est","Centre"],"contact_colis":"","destinations":["Abidjan","Yamoussoukro","Bouaké","Korhogo","Ferkessédougou","Boundiali","Tengréla","Man","Danané","Duékoué","Guiglo","Daloa","Issia","Vavoua","Séguéla","Mankono","Bondoukou","Bouna","Daoukro"]},{"id":"sbta","name":"SBTA","hub_principal":"Abidjan (Adjamé, Yopougon, Koumassi)","type":"Grand Régional","regions_desservies":["Sud-Ouest","Centre-Ouest","Est"],"contact_colis":"0576207777","destinations":["Abidjan","Divo","Lakota","Gagnoa","Soubré","Méagui","San Pedro","Sassandra","Grand-Béréby","Oumé","Diegonefla","Abengourou","Bondoukou"]},{"id":"ot_ci","name":"OT-CI (Omnis Transport)","hub_principal":"Abidjan (Adjamé)","type":"Régional & International","regions_desservies":["Ouest","International"],"contact_colis":"0708611770","destinations":["Abidjan","Man","Danané","Zouan-Hounien","Duékoué","Toulepleu"]},{"id":"etv","name":"ETV (Entente Transport Voyageurs)","hub_principal":"Abidjan (Adjamé, Abobo)","type":"Spécialiste Nord","regions_desservies":["Nord"],"contact_colis":"0777657448","destinations":["Abidjan","Bouaké","Niakara","Tafiré","Korhogo","Ferkessédougou","Ouangolodougou","Pogo","Diawala","Niellé"]},{"id":"ocean_ci","name":"Océan Côte d'Ivoire","hub_principal":"Abidjan (Treichville, Adjamé)","type":"Spécialiste Est","regions_desservies":["Est","Sud-Est"],"contact_colis":"0799242366","destinations":["Abidjan","Aboisso","Adzopé","Akoupé","Abengourou","Agnibilékrou","Bondoukou","Koun-Fao","Tanda"]},{"id":"jet_express","name":"JET Express","hub_principal":"Abidjan (Adjamé, Koumassi)","type":"Spécialiste Sud-Ouest","regions_desservies":["Sud-Ouest"],"contact_colis":"0700146565","destinations":["Abidjan","San Pedro","Tabou","Grand-Béréby","Gabiadiji"]},{"id":"stb","name":"STB (Société de Transport Bakayoko)","hub_principal":"Abidjan (Abobo, Adjamé)","type":"Spécialiste Nord","regions_desservies":["Nord"],"contact_colis":"0504145580","destinations":["Abidjan","Korhogo"]},{"id":"mt","name":"MT (Massa Transport)","hub_principal":"Abidjan (Adjamé)","type":"Régional Ouest","regions_desservies":["Ouest"],"contact_colis":"","destinations":["Abidjan","Daloa","Duékoué","Man","Danané","Bangolo"]},{"id":"avs","name":"AVS (Aek Voyageurs)","hub_principal":"Abidjan (Deux-Plateaux, Adjamé)","type":"Premium Centre","regions_desservies":["Centre"],"contact_colis":"","destinations":["Abidjan","Toumodi","Yamoussoukro","Bouaké"]},{"id":"gti","name":"GTI Transport","hub_principal":"Gagnoa / Abidjan","type":"Régional","regions_desservies":["Centre-Ouest","Est"],"contact_colis":"0545206204","destinations":["Abidjan","Gagnoa","Abengourou","Oumé"]},{"id":"cte","name":"CTE","hub_principal":"Abidjan","type":"Régional Nord","regions_desservies":["Nord"],"contact_colis":"","destinations":["Abidjan","Bouaké","Katiola","Korhogo","Ferkessédougou"]},{"id":"bad","name":"Badjan Transport","hub_principal":"Abidjan (Adjamé)","type":"Historique Est","regions_desservies":["Est"],"contact_colis":"","destinations":["Abidjan","Bondoukou","Bouna","Tanda"]},{"id":"sido","name":"SIDO Transport","hub_principal":"Abidjan (Abobo)","type":"Régional Nord","regions_desservies":["Nord"],"contact_colis":"","destinations":["Abidjan","Boundiali","Korhogo","Tengréla"]},{"id":"waridi","name":"Waridi Transport","hub_principal":"Abidjan","type":"Régional Nord-Ouest","regions_desservies":["Nord-Ouest"],"contact_colis":"","destinations":["Abidjan","Séguéla","Kani","Dianra","Mankono"]},{"id":"adja","name":"Adja Transport","hub_principal":"Abidjan","type":"Régional Nord-Ouest","regions_desservies":["Nord-Ouest"],"contact_colis":"","destinations":["Abidjan","Odienné","Touba","Madinani"]},{"id":"st","name":"ST (Sama Transport)","hub_principal":"Abidjan","type":"Régional Ouest","regions_desservies":["Ouest"],"contact_colis":"","destinations":["Abidjan","Daloa","Man","Issia"]},{"id":"ck","name":"CK (Carrefour Kléber)","hub_principal":"Abidjan","type":"Régional Sud-Ouest","regions_desservies":["Sud-Ouest"],"contact_colis":"","destinations":["Abidjan","San Pedro","Sassandra","Tabou"]}]);}),
"[project]/data/shippingCompanies.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ABIDJAN_AREA",
    ()=>ABIDJAN_AREA,
    "findCompaniesByCity",
    ()=>findCompaniesByCity,
    "getAllDestinations",
    ()=>getAllDestinations,
    "isInAbidjanArea",
    ()=>isInAbidjanArea,
    "shippingCompanies",
    ()=>shippingCompanies
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$exp_cie$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/exp_cie.json (json)");
;
const shippingCompanies = __TURBOPACK__imported__module__$5b$project$5d2f$exp_cie$2e$json__$28$json$29$__["default"];
function findCompaniesByCity(city) {
    const normalizedCity = city.toLowerCase().trim();
    return shippingCompanies.filter((company)=>company.destinations.some((dest)=>dest.toLowerCase().includes(normalizedCity)));
}
function getAllDestinations() {
    const allDestinations = new Set();
    shippingCompanies.forEach((company)=>{
        company.destinations.forEach((dest)=>{
            // Exclude "Abidjan" since it's the local zone
            if (dest.toLowerCase() !== 'abidjan') {
                allDestinations.add(dest);
            }
        });
    });
    return Array.from(allDestinations).sort();
}
const ABIDJAN_AREA = [
    'Abidjan',
    'Plateau',
    'Cocody',
    'Marcory',
    'Treichville',
    'Yopougon',
    'Abobo',
    'Adjamé',
    'Koumassi',
    'Port-Bouët',
    'Anyama',
    'Bingerville',
    'Grand-Bassam',
    'Songon',
    'Brofodoumé',
    'Dabou',
    'Assinie'
];
function isInAbidjanArea(location) {
    const normalizedLocation = location.toLowerCase().trim();
    return ABIDJAN_AREA.some((area)=>normalizedLocation.includes(area.toLowerCase()));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(store)/account/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccountPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen.js [app-client] (ecmascript) <export default as Edit2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crosshair$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crosshair$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crosshair.js [app-client] (ecmascript) <export default as Crosshair>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.js [app-client] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$fr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/locale/fr.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$shippingCompanies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/shippingCompanies.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
function AccountPage() {
    _s();
    const { user, addresses, logout, loading: authLoading, refreshAddresses, updateProfile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const ORDERS_PER_PAGE = 3;
    const [showAddAddress, setShowAddAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingAddressId, setEditingAddressId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newAddress, setNewAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        label: '',
        address_full: '',
        lat: 0,
        lon: 0
    });
    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [profileData, setProfileData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        phone: '',
        email: ''
    });
    const [isUpdatingProfile, setIsUpdatingProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // OTP Phone Change State
    const [otpStep, setOtpStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [otpCode, setOtpCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [otpError, setOtpError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [otpTimer, setOtpTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pendingNewPhone, setPendingNewPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Address Search State (Nominatim)
    const [suggestions, setSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showSuggestions, setShowSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Shipping State
    const [deliveryMode, setDeliveryMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('local');
    const [selectedCity, setSelectedCity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [citySearchQuery, setCitySearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [availableCompanies, setAvailableCompanies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCompany, setSelectedCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCitySuggestions, setShowCitySuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [manualCompany, setManualCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Map Refs
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const addressInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AccountPage.useEffect": ()=>{
            if (!authLoading && !user) {
                router.push('/login?redirect=/account');
            }
            if (user) {
                __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getOrders(user.id).then({
                    "AccountPage.useEffect": (res)=>setOrders(res.orders)
                }["AccountPage.useEffect"]).catch({
                    "AccountPage.useEffect": (err)=>console.error('Error fetching orders:', err)
                }["AccountPage.useEffect"]).finally({
                    "AccountPage.useEffect": ()=>setLoading(false)
                }["AccountPage.useEffect"]);
                setProfileData({
                    name: user.name || '',
                    phone: user.phone || '',
                    email: user.email || ''
                });
            }
        }
    }["AccountPage.useEffect"], [
        user,
        authLoading,
        router
    ]);
    const handleUpdateProfile = async (e)=>{
        e.preventDefault();
        // Check if phone number is being changed
        if (profileData.phone !== user?.phone) {
            // Need OTP verification for phone change
            setPendingNewPhone(profileData.phone);
            setOtpStep('requesting');
            setOtpError('');
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].requestPhoneChangeOtp(user?.id || '', profileData.phone);
                if (result.success) {
                    setOtpStep('verifying');
                    setOtpTimer(result.expiresIn || 300);
                } else {
                    setOtpError(result.message);
                    setOtpStep('idle');
                }
            } catch (err) {
                setOtpError(err.response?.data?.message || 'Erreur lors de l\'envoi du code');
                setOtpStep('idle');
            }
            return;
        }
        // No phone change - update normally
        setIsUpdatingProfile(true);
        try {
            await updateProfile({
                name: profileData.name,
                email: profileData.email
            });
            setIsEditingProfile(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            alert(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally{
            setIsUpdatingProfile(false);
        }
    };
    const handleVerifyPhoneOtp = async ()=>{
        if (!otpCode || otpCode.length !== 4) {
            setOtpError('Veuillez entrer un code à 4 chiffres');
            return;
        }
        setOtpStep('requesting');
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].verifyPhoneChangeOtp(user?.id || '', otpCode, pendingNewPhone);
            if (result.success) {
                setOtpStep('success');
                // Update local profile data
                setProfileData((prev)=>({
                        ...prev,
                        phone: pendingNewPhone
                    }));
                // Also update name/email if changed
                await updateProfile({
                    name: profileData.name,
                    email: profileData.email
                });
                setTimeout(()=>{
                    setOtpStep('idle');
                    setOtpCode('');
                    setPendingNewPhone('');
                    setIsEditingProfile(false);
                    // Refresh user data
                    window.location.reload();
                }, 1500);
            } else {
                setOtpError(result.message);
                setOtpStep('verifying');
            }
        } catch (err) {
            setOtpError(err.response?.data?.message || 'Code invalide');
            setOtpStep('verifying');
        }
    };
    const handleCancelOtp = ()=>{
        setOtpStep('idle');
        setOtpCode('');
        setOtpError('');
        setPendingNewPhone('');
        setProfileData((prev)=>({
                ...prev,
                phone: user?.phone || ''
            }));
    };
    // Address Search Logic
    const handleAddressChange = async (e)=>{
        const value = e.target.value;
        setNewAddress((prev)=>({
                ...prev,
                address_full: value
            }));
        if (value.length < 3) {
            setSuggestions([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=ci&limit=5`);
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (err) {
            console.error("Geocoding error:", err);
        } finally{
            setIsSearching(false);
        }
    };
    const handleSuggestionClick = (place)=>{
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        const addressIsInAbidjan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$shippingCompanies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInAbidjanArea"])(place.display_name);
        if (deliveryMode === 'local' && !addressIsInAbidjan) {
            alert('Cette zone n\'est pas couverte par la livraison locale. Veuillez choisir "Villes de l\'Intérieur" pour les destinations hors Abidjan.');
            return;
        }
        if (deliveryMode === 'shipping' && addressIsInAbidjan) {
            alert('Vous avez sélectionné une adresse à Abidjan alors que vous êtes en mode "Villes de l\'Intérieur".');
            return;
        }
        setNewAddress((prev)=>({
                ...prev,
                address_full: place.display_name,
                lat,
                lon
            }));
        setShowSuggestions(false);
        if (mapRef.current) {
            mapRef.current.setView([
                lat,
                lon
            ], 16);
            if (markerRef.current) {
                markerRef.current.setLatLng([
                    lat,
                    lon
                ]);
            }
        }
    };
    const handleCitySelect = async (city)=>{
        setSelectedCity(city);
        setCitySearchQuery(city);
        setShowCitySuggestions(false);
        const companies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$shippingCompanies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findCompaniesByCity"])(city);
        setAvailableCompanies(companies);
        setSelectedCompany(companies.length > 0 ? companies[0] : null);
        // Geocode city to center map
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', Côte d\'Ivoire')}&limit=1`);
            const data = await res.json();
            if (data && data[0]) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                setNewAddress((prev)=>({
                        ...prev,
                        lat,
                        lon
                    }));
                if (mapRef.current) {
                    mapRef.current.setView([
                        lat,
                        lon
                    ], 12);
                    if (markerRef.current) {
                        markerRef.current.setLatLng([
                            lat,
                            lon
                        ]);
                    }
                }
            }
        } catch (e) {}
    };
    const highlightText = (text, term)=>{
        if (!term) return text;
        const parts = text.split(new RegExp(`(${term})`, 'gi'));
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: parts.map((part, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: part.toLowerCase() === term.toLowerCase() ? 'bg-amber-100 text-amber-900 font-bold' : '',
                    children: part
                }, i, false, {
                    fileName: "[project]/app/(store)/account/page.tsx",
                    lineNumber: 275,
                    columnNumber: 21
                }, this))
        }, void 0, false, {
            fileName: "[project]/app/(store)/account/page.tsx",
            lineNumber: 273,
            columnNumber: 13
        }, this);
    };
    const handleGeolocation = ()=>{
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        navigator.geolocation.getCurrentPosition(async (position)=>{
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                const addressIsInAbidjan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$shippingCompanies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInAbidjanArea"])(data.display_name);
                if (deliveryMode === 'local' && !addressIsInAbidjan) {
                    alert('Votre position actuelle n\'est pas couverte par la livraison locale. Veuillez choisir "Villes de l\'Intérieur" pour les destinations hors Abidjan.');
                    return;
                }
                if (deliveryMode === 'shipping' && addressIsInAbidjan) {
                    alert('Votre position actuelle est à Abidjan alors que vous êtes en mode "Villes de l\'Intérieur".');
                    return;
                }
                setNewAddress((prev)=>({
                        ...prev,
                        address_full: data.display_name || "Ma position",
                        lat: latitude,
                        lon: longitude
                    }));
                if (mapRef.current) {
                    mapRef.current.setView([
                        latitude,
                        longitude
                    ], 16);
                    if (markerRef.current) {
                        markerRef.current.setLatLng([
                            latitude,
                            longitude
                        ]);
                    }
                }
            } catch (err) {
                console.error("Geocoding current position failed:", err);
            }
        }, (error)=>{
            console.error("Geolocation error:", error);
            alert("Impossible de récupérer votre position.");
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AccountPage.useEffect": ()=>{
            if (!mapContainerRef.current) return;
            const L = window.L;
            if (!L) return;
            const initialLat = newAddress.lat || 5.3484;
            const initialLon = newAddress.lon || -4.0305;
            const timer = setTimeout({
                "AccountPage.useEffect.timer": ()=>{
                    try {
                        if (mapRef.current) {
                            mapRef.current.remove();
                        }
                        mapRef.current = L.map(mapContainerRef.current, {
                            minZoom: 7,
                            maxZoom: 18
                        }).setView([
                            initialLat,
                            initialLon
                        ], 13);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
                        markerRef.current = L.marker([
                            initialLat,
                            initialLon
                        ], {
                            draggable: true
                        }).addTo(mapRef.current);
                        markerRef.current.on('dragend', {
                            "AccountPage.useEffect.timer": async ()=>{
                                const pos = markerRef.current.getLatLng();
                                setNewAddress({
                                    "AccountPage.useEffect.timer": (prev)=>({
                                            ...prev,
                                            lat: pos.lat,
                                            lon: pos.lng
                                        })
                                }["AccountPage.useEffect.timer"]);
                                try {
                                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`);
                                    const data = await res.json();
                                    setNewAddress({
                                        "AccountPage.useEffect.timer": (prev)=>({
                                                ...prev,
                                                address_full: data.display_name
                                            })
                                    }["AccountPage.useEffect.timer"]);
                                } catch (e) {}
                            }
                        }["AccountPage.useEffect.timer"]);
                    } catch (err) {}
                }
            }["AccountPage.useEffect.timer"], 300);
            return ({
                "AccountPage.useEffect": ()=>clearTimeout(timer)
            })["AccountPage.useEffect"];
        }
    }["AccountPage.useEffect"], [
        showAddAddress,
        newAddress.lat,
        newAddress.lon,
        deliveryMode
    ]); // Re-initialize map if deliveryMode changes
    const handleAddAddress = async (e)=>{
        e.preventDefault();
        if (!user) return;
        let finalAddress = newAddress.address_full;
        let finalLat = newAddress.lat;
        let finalLon = newAddress.lon;
        if (deliveryMode === 'shipping') {
            if (!selectedCity) {
                alert("Veuillez sélectionner une ville");
                return;
            }
            const companyName = manualCompany || selectedCompany?.name;
            if (!companyName) {
                alert("Veuillez sélectionner une compagnie de transport");
                return;
            }
            finalAddress = `${selectedCity} (Via ${companyName})`;
            finalLat = 0;
            finalLon = 0;
        } else {
            if (!finalAddress || finalLat === 0 || finalLon === 0) {
                alert("Veuillez spécifier une adresse valide sur la carte pour Abidjan.");
                return;
            }
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$shippingCompanies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInAbidjanArea"])(finalAddress)) {
                alert('L\'adresse sélectionnée n\'est pas dans la zone de livraison locale d\'Abidjan. Veuillez la corriger ou passer en mode "Villes de l\'Intérieur".');
                return;
            }
        }
        try {
            const addressData = {
                ...newAddress,
                address_full: finalAddress,
                lat: finalLat,
                lon: finalLon
            };
            if (editingAddressId) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].updateAddress(user.id, editingAddressId, addressData);
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].addAddress(user.id, {
                    ...addressData,
                    is_default: addresses.length === 0
                });
            }
            setNewAddress({
                label: '',
                address_full: '',
                lat: 0,
                lon: 0
            });
            setDeliveryMode('local');
            setSelectedCity('');
            setCitySearchQuery('');
            setManualCompany('');
            setShowAddAddress(false);
            setEditingAddressId(null);
            await refreshAddresses();
        } catch (err) {
            console.error('Error saving address:', err);
        }
    };
    const startEdit = (addr)=>{
        setNewAddress({
            label: addr.label,
            address_full: addr.address_full,
            lat: addr.lat,
            lon: addr.lon
        });
        setEditingAddressId(addr.id);
        // Determine delivery mode based on address
        if (addr.lat === 0 && addr.lon === 0 && addr.address_full.includes('(Via')) {
            setDeliveryMode('shipping');
            const cityMatch = addr.address_full.match(/(.*) \(Via/);
            if (cityMatch && cityMatch[1]) {
                setSelectedCity(cityMatch[1].trim());
                setCitySearchQuery(cityMatch[1].trim());
                const companyMatch = addr.address_full.match(/Via (.*)\)/);
                if (companyMatch && companyMatch[1]) {
                    const companyName = companyMatch[1].trim();
                    const companies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$shippingCompanies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findCompaniesByCity"])(cityMatch[1].trim());
                    const foundCompany = companies.find((c)=>c.name === companyName);
                    if (foundCompany) {
                        setSelectedCompany(foundCompany);
                        setManualCompany('');
                    } else {
                        setSelectedCompany(null);
                        setManualCompany(companyName);
                    }
                }
            }
        } else {
            setDeliveryMode('local');
        }
        setShowAddAddress(true);
    };
    const handleDeleteAddress = async (id)=>{
        if (!user) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].deleteAddress(user.id, id);
            await refreshAddresses();
        } catch (err) {
            console.error('Error deleting address:', err);
        }
    };
    const handleSetDefault = async (id)=>{
        if (!user) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].setDefaultAddress(user.id, id);
            await refreshAddresses();
        } catch (err) {
            console.error('Error setting default address:', err);
        }
    };
    const handleLogout = ()=>{
        logout();
        router.push('/');
    };
    if (authLoading || loading && !orders.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-white flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "w-8 h-8 text-slate-900 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/app/(store)/account/page.tsx",
                        lineNumber: 492,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]",
                        children: "Chargement de votre compte..."
                    }, void 0, false, {
                        fileName: "[project]/app/(store)/account/page.tsx",
                        lineNumber: 493,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(store)/account/page.tsx",
                lineNumber: 491,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(store)/account/page.tsx",
            lineNumber: 490,
            columnNumber: 13
        }, this);
    }
    const getStatusInfo = (status)=>{
        switch(status.toLowerCase()){
            case 'pending':
                return {
                    label: 'En attente',
                    color: 'text-amber-700 bg-amber-50',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"]
                };
            case 'paid':
                return {
                    label: 'Payé',
                    color: 'text-emerald-700 bg-emerald-50',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"]
                };
            case 'confirmed':
                return {
                    label: 'Confirmée',
                    color: 'text-blue-700 bg-blue-50',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"]
                };
            case 'processing':
                return {
                    label: 'En préparation',
                    color: 'text-indigo-700 bg-indigo-50',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
                };
            case 'shipped':
                return {
                    label: 'Expédiée',
                    color: 'text-purple-700 bg-purple-50',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"]
                };
            case 'delivered':
                return {
                    label: 'Livrée',
                    color: 'text-slate-700 bg-slate-50',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"]
                };
            case 'completed':
                return {
                    label: 'Terminée',
                    color: 'text-green-700 bg-green-50',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"]
                };
            case 'cancelled':
                return {
                    label: 'Annulée',
                    color: 'text-rose-700 bg-rose-50',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"]
                };
            default:
                return {
                    label: 'En attente',
                    color: 'text-amber-700 bg-amber-50',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"]
                };
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js",
                    onLoad: ()=>{
                    // Trigger a state change or similar if needed to re-init map
                    // But since we use useLayoutEffect or similar, it might be fine
                    }
                }, void 0, false, {
                    fileName: "[project]/app/(store)/account/page.tsx",
                    lineNumber: 526,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                    rel: "stylesheet",
                    href: "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                }, void 0, false, {
                    fileName: "[project]/app/(store)/account/page.tsx",
                    lineNumber: 533,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lg:col-span-4 space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-xl p-5 border border-slate-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center text-slate-500",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                        lineNumber: 542,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 541,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-base font-semibold text-slate-900",
                                                            children: user?.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 545,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-slate-400",
                                                            children: user?.phone
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 546,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 540,
                                            columnNumber: 29
                                        }, this),
                                        !isEditingProfile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setIsEditingProfile(true),
                                            className: "p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                lineNumber: 554,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 550,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 539,
                                    columnNumber: 25
                                }, this),
                                isEditingProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        (otpStep === 'verifying' || otpStep === 'requesting' || otpStep === 'success') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl",
                                                children: otpStep === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center py-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                className: "w-8 h-8 text-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                lineNumber: 568,
                                                                columnNumber: 57
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 567,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-lg font-bold text-slate-900",
                                                            children: "Numéro mis à jour !"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 570,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-slate-500 mt-1",
                                                            children: "Un SMS de confirmation a été envoyé au nouveau numéro."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 571,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 566,
                                                    columnNumber: 49
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center mb-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                                                        className: "w-6 h-6 text-slate-600"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                                        lineNumber: 577,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 576,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-bold text-slate-900",
                                                                    children: "Vérification du nouveau numéro"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 579,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-slate-500 mt-1",
                                                                    children: [
                                                                        "Un code a été envoyé au",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                                            lineNumber: 581,
                                                                            columnNumber: 84
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium text-slate-700",
                                                                            children: pendingNewPhone
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                                            lineNumber: 582,
                                                                            columnNumber: 61
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 580,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 575,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "text-xs font-medium text-slate-500 mb-2 block text-center",
                                                                    children: "Code à 4 chiffres"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 587,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    maxLength: 4,
                                                                    value: otpCode,
                                                                    onChange: (e)=>setOtpCode(e.target.value.replace(/\D/g, '')),
                                                                    className: "w-full text-center text-2xl tracking-[0.5em] font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:outline-none focus:border-slate-400",
                                                                    placeholder: "• • • •",
                                                                    autoFocus: true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 588,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 586,
                                                            columnNumber: 53
                                                        }, this),
                                                        otpError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-center text-sm text-red-500 mb-4",
                                                            children: otpError
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 600,
                                                            columnNumber: 57
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: handleCancelOtp,
                                                                    className: "flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50",
                                                                    children: "Annuler"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 604,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: handleVerifyPhoneOtp,
                                                                    disabled: otpStep === 'requesting' || otpCode.length !== 4,
                                                                    className: "flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50",
                                                                    children: otpStep === 'requesting' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                        className: "w-4 h-4 animate-spin mx-auto"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                                        lineNumber: 615,
                                                                        columnNumber: 89
                                                                    }, this) : 'Vérifier'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 610,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 603,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                lineNumber: 564,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 563,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: handleUpdateProfile,
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-slate-500 mb-1 block",
                                                            children: "Nom"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 626,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: profileData.name,
                                                            onChange: (e)=>setProfileData({
                                                                    ...profileData,
                                                                    name: e.target.value
                                                                }),
                                                            className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-400 focus:outline-none transition-all",
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 627,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 625,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-slate-500 mb-1 block",
                                                            children: [
                                                                "Téléphone",
                                                                profileData.phone !== user?.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "ml-2 text-amber-600 text-xs",
                                                                    children: "(🔐 OTP requis)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 639,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 636,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "tel",
                                                            value: profileData.phone,
                                                            onChange: (e)=>setProfileData({
                                                                    ...profileData,
                                                                    phone: e.target.value
                                                                }),
                                                            className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-400 focus:outline-none transition-all",
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 642,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 635,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-slate-500 mb-1 block",
                                                            children: "Email"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 651,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            value: profileData.email,
                                                            onChange: (e)=>setProfileData({
                                                                    ...profileData,
                                                                    email: e.target.value
                                                                }),
                                                            className: "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-400 focus:outline-none transition-all",
                                                            placeholder: "Optionnel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 652,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 650,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2 pt-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "submit",
                                                            disabled: isUpdatingProfile || otpStep !== 'idle',
                                                            className: "flex-1 bg-slate-900 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-slate-800 disabled:opacity-50 transition-all",
                                                            children: isUpdatingProfile || otpStep === 'requesting' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                className: "w-4 h-4 animate-spin mx-auto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                lineNumber: 666,
                                                                columnNumber: 94
                                                            }, this) : 'Enregistrer'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 661,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setIsEditingProfile(false),
                                                            className: "px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all",
                                                            children: "Annuler"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 668,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 660,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 624,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        user?.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-xs text-slate-400 mt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 682,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: user.email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 683,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 681,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleLogout,
                                            className: "mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-rose-500 text-sm font-medium hover:text-rose-600 transition-colors w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 690,
                                                    columnNumber: 37
                                                }, this),
                                                "Déconnexion"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 686,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(store)/account/page.tsx",
                            lineNumber: 538,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-xl p-5 border border-slate-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-base font-semibold text-slate-900",
                                            children: "Adresses de livraison"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 700,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setEditingAddressId(null);
                                                setNewAddress({
                                                    label: '',
                                                    address_full: '',
                                                    lat: 5.3484,
                                                    lon: -4.0305
                                                });
                                                setDeliveryMode('local');
                                                setSelectedCity('');
                                                setCitySearchQuery('');
                                                setManualCompany('');
                                                setShowAddAddress(!showAddAddress);
                                            },
                                            className: "p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                lineNumber: 713,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 701,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 699,
                                    columnNumber: 25
                                }, this),
                                showAddAddress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleAddAddress,
                                    className: "mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-medium text-slate-500 mb-1 block",
                                                    children: "Libellé"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 720,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "Bureau, Domicile...",
                                                    required: true,
                                                    value: newAddress.label,
                                                    onChange: (e)=>setNewAddress({
                                                            ...newAddress,
                                                            label: e.target.value
                                                        }),
                                                    className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 721,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 719,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-2 p-1 bg-white border-2 border-slate-100 rounded-2xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setDeliveryMode('local'),
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", deliveryMode === 'local' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 741,
                                                            columnNumber: 41
                                                        }, this),
                                                        "Abidjan & Environs"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 733,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setDeliveryMode('shipping'),
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", deliveryMode === 'shipping' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 752,
                                                            columnNumber: 41
                                                        }, this),
                                                        "Villes de l'Intérieur"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 744,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 732,
                                            columnNumber: 33
                                        }, this),
                                        deliveryMode === 'local' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1 relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1",
                                                        children: "Adresse Complète (Abidjan)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                        lineNumber: 760,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                ref: addressInputRef,
                                                                type: "text",
                                                                placeholder: "Saisissez votre quartier...",
                                                                required: deliveryMode === 'local',
                                                                value: newAddress.address_full,
                                                                onChange: handleAddressChange,
                                                                className: "w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 pl-10 text-sm focus:border-slate-900 outline-none font-bold pr-12"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                lineNumber: 762,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                lineNumber: 771,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: handleGeolocation,
                                                                className: "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crosshair$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crosshair$3e$__["Crosshair"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 778,
                                                                    columnNumber: 53
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                lineNumber: 773,
                                                                columnNumber: 49
                                                            }, this),
                                                            showSuggestions && suggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200",
                                                                children: suggestions.map((place, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleSuggestionClick(place),
                                                                        className: "w-full p-4 text-left hover:bg-slate-50 flex items-start gap-3 transition-colors border-b border-slate-50 last:border-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                                className: "w-4 h-4 text-slate-200 mt-1 flex-shrink-0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                                lineNumber: 790,
                                                                                columnNumber: 65
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-slate-600 font-bold",
                                                                                children: place.display_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                                lineNumber: 791,
                                                                                columnNumber: 65
                                                                            }, this)
                                                                        ]
                                                                    }, idx, true, {
                                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                                        lineNumber: 784,
                                                                        columnNumber: 61
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                lineNumber: 782,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                        lineNumber: 761,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                lineNumber: 759,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4 animate-in fade-in slide-in-from-top-2 duration-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1",
                                                            children: "Ville de destination"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 802,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: citySearchQuery,
                                                                    onChange: (e)=>{
                                                                        setCitySearchQuery(e.target.value);
                                                                        setShowCitySuggestions(true);
                                                                        setSelectedCity('');
                                                                    },
                                                                    onFocus: ()=>setShowCitySuggestions(true),
                                                                    placeholder: "Cherchez votre ville (ex: Bouaké, Korhogo...)",
                                                                    className: "w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 pl-10 text-sm focus:border-slate-900 outline-none font-bold"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 804,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                    className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 816,
                                                                    columnNumber: 49
                                                                }, this),
                                                                showCitySuggestions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-100 rounded-2xl shadow-2xl z-[60] max-h-60 overflow-y-auto overflow-x-hidden",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$shippingCompanies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllDestinations"])().filter((city)=>city.toLowerCase().includes(citySearchQuery.toLowerCase())).map((city, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>handleCitySelect(city),
                                                                            className: "w-full p-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 font-bold text-xs text-slate-600",
                                                                            children: highlightText(city, citySearchQuery)
                                                                        }, idx, false, {
                                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                                            lineNumber: 823,
                                                                            columnNumber: 65
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 819,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 803,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 801,
                                                    columnNumber: 41
                                                }, this),
                                                selectedCity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4 animate-in fade-in slide-in-from-top-2 duration-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1",
                                                            children: "Compagnie de transport"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 839,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-1 gap-2",
                                                            children: [
                                                                availableCompanies.map((company, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            setSelectedCompany(company);
                                                                            setManualCompany('');
                                                                        },
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-3 rounded-xl border-2 text-left transition-all", selectedCompany?.name === company.name ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "border-slate-100 bg-white hover:border-slate-200 text-slate-900"),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "font-bold text-xs",
                                                                                children: company.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                                lineNumber: 856,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[8px] uppercase tracking-wider font-bold", selectedCompany?.name === company.name ? "text-white/60" : "text-slate-400"),
                                                                                children: company.hub_principal
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                                lineNumber: 857,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, idx, true, {
                                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                                        lineNumber: 842,
                                                                        columnNumber: 57
                                                                    }, this)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>{
                                                                        setSelectedCompany(null);
                                                                        setManualCompany('');
                                                                    },
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-3 rounded-xl border-2 text-left transition-all", !selectedCompany && !manualCompany ? "border-slate-900 bg-slate-900 text-white" : "border-slate-100 bg-white hover:border-slate-200 text-slate-900"),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "font-bold text-xs",
                                                                        children: "Autre compagnie"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                                        lineNumber: 873,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 860,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 840,
                                                            columnNumber: 49
                                                        }, this),
                                                        (!selectedCompany || availableCompanies.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: manualCompany,
                                                            onChange: (e)=>setManualCompany(e.target.value),
                                                            placeholder: "Nom de la compagnie...",
                                                            className: "w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-slate-900 outline-none font-bold"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 878,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 838,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 800,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative rounded-2xl overflow-hidden border-2 border-slate-100 h-48 bg-slate-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: mapContainerRef,
                                                    className: "h-full w-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 892,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-2 left-2 right-2 pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm inline-flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"], {
                                                                className: "w-3 h-3 text-slate-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                lineNumber: 895,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-black text-slate-500 uppercase tracking-tight",
                                                                children: "Déplacez le marqueur pour préciser"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                lineNumber: 896,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                        lineNumber: 894,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 893,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 891,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    className: "flex-1 bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10",
                                                    children: editingAddressId ? 'Modifier' : 'Enregistrer'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 902,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        setShowAddAddress(false);
                                                        setEditingAddressId(null);
                                                        setNewAddress({
                                                            label: '',
                                                            address_full: '',
                                                            lat: 0,
                                                            lon: 0
                                                        });
                                                        setDeliveryMode('local');
                                                        setSelectedCity('');
                                                        setManualCompany('');
                                                    },
                                                    className: "px-6 py-3 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all",
                                                    children: "Annuler"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 905,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 901,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 718,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: addresses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-3xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"], {
                                                className: "w-12 h-12 text-slate-100 mx-auto mb-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                lineNumber: 926,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-bold text-slate-300 uppercase tracking-widest",
                                                children: "Aucune adresse enregistrée"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                lineNumber: 927,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(store)/account/page.tsx",
                                        lineNumber: 925,
                                        columnNumber: 33
                                    }, this) : addresses.map((addr)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "group relative bg-slate-50 hover:bg-white p-5 rounded-[2rem] border-2 border-transparent hover:border-slate-100 transition-all duration-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", addr.is_default ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "bg-white text-slate-400 border-2 border-slate-100"),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                                        className: "w-5 h-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                                        lineNumber: 938,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 934,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-black text-slate-900",
                                                                            children: addr.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                                            lineNumber: 941,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[10px] text-slate-400 font-bold truncate max-w-[150px] uppercase tracking-tighter",
                                                                            children: addr.address_full
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                                            lineNumber: 942,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 940,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 933,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>startEdit(addr),
                                                                    className: "p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                                        lineNumber: 950,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 946,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleDeleteAddress(addr.id),
                                                                    className: "p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                                        lineNumber: 956,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 952,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 945,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 932,
                                                    columnNumber: 41
                                                }, this),
                                                !addr.is_default && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleSetDefault(addr.id),
                                                    className: "mt-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors",
                                                    children: "Définir par défaut"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 961,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, addr.id, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 931,
                                            columnNumber: 37
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 923,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(store)/account/page.tsx",
                            lineNumber: 698,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(store)/account/page.tsx",
                    lineNumber: 536,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lg:col-span-8 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg sm:text-xl font-bold text-slate-900",
                                    children: "Mes Commandes"
                                }, void 0, false, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 979,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-medium text-slate-400",
                                    children: [
                                        orders.length,
                                        " commande",
                                        orders.length > 1 ? 's' : ''
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 980,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(store)/account/page.tsx",
                            lineNumber: 978,
                            columnNumber: 21
                        }, this),
                        orders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-xl p-8 sm:p-12 text-center border border-slate-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                    className: "w-12 h-12 text-slate-200 mx-auto mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 985,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-slate-900 mb-2",
                                    children: "Aucune commande"
                                }, void 0, false, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 986,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-400 text-sm mb-6",
                                    children: "Vous n'avez pas encore passé de commande."
                                }, void 0, false, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 987,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: "inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors",
                                    children: "Découvrir nos produits"
                                }, void 0, false, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 988,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(store)/account/page.tsx",
                            lineNumber: 984,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: orders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE).map((order)=>{
                                        const { label, color, icon: Icon } = getStatusInfo(order.status);
                                        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/payment/${order.id}`,
                                            className: "block bg-white rounded-xl p-4 sm:p-5 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 mb-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-medium text-slate-500",
                                                                            children: [
                                                                                "#",
                                                                                order.id.slice(0, 8).toUpperCase()
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                                            lineNumber: 1012,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1", color),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                                    className: "w-3 h-3"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                                    lineNumber: 1014,
                                                                                    columnNumber: 65
                                                                                }, this),
                                                                                label
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                                            lineNumber: 1013,
                                                                            columnNumber: 61
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 1011,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-slate-400",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(order.created_at), "d MMM yyyy, HH:mm", {
                                                                        locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$fr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fr"]
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 1018,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 1010,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-right",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-lg font-bold text-slate-900",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(Number(order.total))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                lineNumber: 1023,
                                                                columnNumber: 57
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 1022,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 1009,
                                                    columnNumber: 49
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-slate-50 rounded-lg p-3 mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] font-semibold text-slate-400 uppercase mb-2",
                                                            children: "Produits"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 1029,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1",
                                                            children: [
                                                                items?.slice(0, 3).map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-700 font-medium truncate flex-1",
                                                                                children: item.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                                lineNumber: 1033,
                                                                                columnNumber: 65
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-500 ml-2",
                                                                                children: [
                                                                                    "×",
                                                                                    item.quantity
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/(store)/account/page.tsx",
                                                                                lineNumber: 1034,
                                                                                columnNumber: 65
                                                                            }, this)
                                                                        ]
                                                                    }, idx, true, {
                                                                        fileName: "[project]/app/(store)/account/page.tsx",
                                                                        lineNumber: 1032,
                                                                        columnNumber: 61
                                                                    }, this)),
                                                                items?.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-slate-400 mt-1",
                                                                    children: [
                                                                        "+",
                                                                        items.length - 3,
                                                                        " autre",
                                                                        items.length - 3 > 1 ? 's' : ''
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 1038,
                                                                    columnNumber: 61
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 1030,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 1028,
                                                    columnNumber: 49
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1 text-xs text-slate-400",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: "w-3 h-3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 1046,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "truncate max-w-[180px]",
                                                                    children: order.address_full
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                                    lineNumber: 1047,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 1045,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                            className: "w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/account/page.tsx",
                                                            lineNumber: 1049,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/account/page.tsx",
                                                    lineNumber: 1044,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, order.id, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 1003,
                                            columnNumber: 45
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 995,
                                    columnNumber: 29
                                }, this),
                                orders.length > ORDERS_PER_PAGE && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center gap-2 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentPage((p)=>Math.max(1, p - 1)),
                                            disabled: currentPage === 1,
                                            className: "px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all",
                                            children: "Précédent"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 1059,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "px-3 py-2 text-sm font-medium text-slate-500",
                                            children: [
                                                currentPage,
                                                " / ",
                                                Math.ceil(orders.length / ORDERS_PER_PAGE)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 1066,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentPage((p)=>Math.min(Math.ceil(orders.length / ORDERS_PER_PAGE), p + 1)),
                                            disabled: currentPage >= Math.ceil(orders.length / ORDERS_PER_PAGE),
                                            className: "px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all",
                                            children: "Suivant"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(store)/account/page.tsx",
                                            lineNumber: 1069,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(store)/account/page.tsx",
                                    lineNumber: 1058,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(store)/account/page.tsx",
                    lineNumber: 976,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(store)/account/page.tsx",
            lineNumber: 525,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(store)/account/page.tsx",
        lineNumber: 524,
        columnNumber: 9
    }, this);
}
_s(AccountPage, "GDSGH7toj6/JTwZnZJPpSP5CdbE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AccountPage;
var _c;
__turbopack_context__.k.register(_c, "AccountPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_11f6f85e._.js.map