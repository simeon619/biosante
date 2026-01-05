(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Category",
    ()=>Category
]);
var Category = /*#__PURE__*/ function(Category) {
    Category["HYPERTENSION"] = "Hypertension & Diabète";
    Category["DIABETES"] = "Diabète";
    Category["PROSTATE"] = "Prostate & Urinaire";
    Category["WELLNESS"] = "Bien-être Général";
    return Category;
}({});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/data/products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "products",
    ()=>products
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types.ts [app-client] (ecmascript)");
;
const products = [
    {
        id: 'bioactif',
        name: 'BioActif',
        tagline: 'DIABÈTE • HYPERTENSION',
        description: 'Une solution révolutionnaire 100% naturelle qui cible la double problématique de l\'hypertension et du diabète. BioActif aide à réguler naturellement la tension artérielle tout en stabilisant le taux de sucre dans le sang, offrant ainsi une protection cardiovasculaire complète.',
        price: 12000,
        category: __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Category"].HYPERTENSION,
        // Updated with high-quality assets
        image: '/images/bioactif/bioactif-ingredients.jpg',
        gallery: [
            '/images/bioactif/bioactif-lifestyle-woman.jpg',
            '/images/bioactif/bioactif-infographic.jpg',
            '/images/bioactif/bioactif-lifestyle-monitor.jpg'
        ],
        benefits: [
            'Régule la tension artérielle',
            'Stabilise la glycémie',
            'Protection cardiaque',
            '100% Plantes naturelles'
        ],
        inStock: true,
        themeColor: 'bg-rose-50',
        badgeColor: 'bg-rose-100 text-rose-800',
        testimonials: [
            {
                id: 't1',
                author: 'Moussa K.',
                location: 'Abidjan',
                duration: '0:45',
                url: '#' // Placeholder audio link
            },
            {
                id: 't2',
                author: 'Aminata D.',
                location: 'Bouaké',
                duration: '1:12',
                url: '#' // Placeholder audio link
            }
        ]
    },
    {
        id: 'vitamax',
        name: 'VitaMax',
        tagline: 'PROSTATE • TROUBLES URINAIRES',
        description: 'Retrouvez votre confort et votre vitalité avec VitaMax. Formulé spécifiquement pour la santé masculine, il réduit l\'inflammation de la prostate, diminue les envies fréquentes d\'uriner la nuit et améliore le flux urinaire pour une meilleure qualité de vie.',
        price: 15000,
        category: __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Category"].PROSTATE,
        // Updated with high-quality assets
        image: '/images/vitamax/vitamax-ingredients.jpg',
        gallery: [
            '/images/vitamax/vitamax-lifestyle-happy.jpg',
            '/images/vitamax/vitamax-infographic.jpg',
            '/images/vitamax/vitamax-lifestyle-tablet.jpg'
        ],
        benefits: [
            'Réduit l\'inflammation',
            'Diminue les réveils nocturnes',
            'Améliore le débit urinaire',
            'Vitalité masculine'
        ],
        inStock: true,
        themeColor: 'bg-emerald-50',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        testimonials: [
            {
                id: 't3',
                author: 'Jean-Paul B.',
                location: 'Yopougon',
                duration: '0:58',
                url: '#' // Placeholder audio link
            },
            {
                id: 't4',
                author: 'Kouassi Y.',
                location: 'San-Pédro',
                duration: '1:05',
                url: '#' // Placeholder audio link
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AddToCartButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddToCartButton",
    ()=>AddToCartButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const AddToCartButton = ({ product, className })=>{
    _s();
    const { addToCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>addToCart(product),
        className: `text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg flex items-center ${className || 'bg-gray-900 hover:bg-gray-800'}`,
        children: [
            "Commander ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                className: "ml-2 w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/components/AddToCartButton.tsx",
                lineNumber: 20,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/AddToCartButton.tsx",
        lineNumber: 16,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AddToCartButton, "YPx5musMedcmtt2OkzMtHcKllYw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"]
    ];
});
_c = AddToCartButton;
var _c;
__turbopack_context__.k.register(_c, "AddToCartButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(store)/produits/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/products.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddToCartButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AddToCartButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function ProductsPage() {
    _s();
    const [dynamicProducts, setDynamicProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductsPage.useEffect": ()=>{
            const fetchProducts = {
                "ProductsPage.useEffect.fetchProducts": async ()=>{
                    try {
                        // Add timestamp to force fresh fetch and explicitly disable caching
                        const response = await fetch(`http://localhost:3333/api/products?t=${Date.now()}`, {
                            cache: 'no-store',
                            next: {
                                revalidate: 0
                            }
                        });
                        if (response.ok) {
                            const { products: dbProducts } = await response.json();
                            console.log('Fetched products from DB (List):', dbProducts.map({
                                "ProductsPage.useEffect.fetchProducts": (p)=>({
                                        id: p.id,
                                        image: p.image
                                    })
                            }["ProductsPage.useEffect.fetchProducts"]));
                            const activeProducts = dbProducts.map({
                                "ProductsPage.useEffect.fetchProducts.activeProducts": (dbp)=>{
                                    const sp = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].find({
                                        "ProductsPage.useEffect.fetchProducts.activeProducts.sp": (p)=>p.id === dbp.id
                                    }["ProductsPage.useEffect.fetchProducts.activeProducts.sp"]);
                                    return {
                                        ...sp,
                                        id: dbp.id,
                                        name: dbp.name,
                                        price: dbp.price,
                                        stock: dbp.stock,
                                        inStock: dbp.stock > 0,
                                        description: dbp.description || sp?.description || '',
                                        is_active: dbp.is_active,
                                        // Explicitly check for DB image
                                        image: dbp.image && dbp.image.length > 0 ? dbp.image : sp?.image || '',
                                        tagline: dbp.tagline || sp?.tagline || '',
                                        category: dbp.category || sp?.category || '',
                                        ingredients_image: dbp.ingredients_image || sp?.ingredients_image,
                                        infographic_image: dbp.infographic_image || sp?.infographic_image,
                                        gallery: dbp.gallery ? typeof dbp.gallery === 'string' ? JSON.parse(dbp.gallery) : dbp.gallery : sp?.gallery || [],
                                        benefits: dbp.benefits ? typeof dbp.benefits === 'string' ? JSON.parse(dbp.benefits) : dbp.benefits : sp?.benefits || []
                                    };
                                }
                            }["ProductsPage.useEffect.fetchProducts.activeProducts"]);
                            setDynamicProducts(activeProducts);
                        }
                    } catch (error) {
                        console.error('Failed to sync products:', error);
                    }
                }
            }["ProductsPage.useEffect.fetchProducts"];
            fetchProducts();
        }
    }["ProductsPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white min-h-screen text-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-8 pb-8 px-4 sm:px-6 lg:px-8 border-b border-black/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-5xl md:text-7xl font-bold tracking-tighter mb-4 font-heading text-black",
                            children: "Protocoles."
                        }, void 0, false, {
                            fileName: "[project]/app/(store)/produits/page.tsx",
                            lineNumber: 68,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl md:text-2xl font-light text-black/70 max-w-2xl",
                            children: "Formulations synergiques pour une santé restaurée."
                        }, void 0, false, {
                            fileName: "[project]/app/(store)/produits/page.tsx",
                            lineNumber: 71,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(store)/produits/page.tsx",
                    lineNumber: 67,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(store)/produits/page.tsx",
                lineNumber: 66,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-24",
                    children: dynamicProducts.map((product, index)=>{
                        // Dynamic Color Logic
                        const isBioActif = product.id === 'bioactif';
                        const accentColor = isBioActif ? 'text-red-600' : 'text-green-600';
                        const borderColor = isBioActif ? 'border-red-600' : 'border-green-600';
                        const bgAccent = isBioActif ? 'bg-red-600' : 'bg-green-600';
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-12 gap-12 items-start group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `lg:col-span-5 relative aspect-[3/4] bg-white border border-black/10 p-12 flex items-center justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/produits/${product.id}`,
                                            className: "block w-full h-full relative",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: product.image,
                                                alt: product.name,
                                                fill: true,
                                                className: "object-contain transition-transform duration-700 group-hover:scale-105",
                                                priority: index === 0,
                                                unoptimized: true
                                            }, void 0, false, {
                                                fileName: "[project]/app/(store)/produits/page.tsx",
                                                lineNumber: 92,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(store)/produits/page.tsx",
                                            lineNumber: 91,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-4 left-4 text-xs font-mono uppercase tracking-widest text-black/40",
                                            children: [
                                                "Fig. 0",
                                                index + 1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/produits/page.tsx",
                                            lineNumber: 101,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(store)/produits/page.tsx",
                                    lineNumber: 90,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `lg:col-span-7 space-y-8 ${index % 2 === 1 ? 'lg:order-1 lg:text-right' : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `inline-block border ${borderColor} px-3 py-1 rounded-full mb-6 ${index % 2 === 1 ? 'ml-auto' : ''}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-xs font-bold uppercase tracking-widest ${accentColor}`,
                                                        children: product.category
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(store)/produits/page.tsx",
                                                        lineNumber: 110,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/produits/page.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/produits/${product.id}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: `text-5xl md:text-6xl font-bold tracking-tight mb-4 hover:opacity-70 transition-opacity ${accentColor}`,
                                                        children: product.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(store)/produits/page.tsx",
                                                        lineNumber: 113,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/produits/page.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xl leading-relaxed font-light text-black/80 max-w-xl",
                                                    children: product.description
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/produits/page.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/produits/page.tsx",
                                            lineNumber: 108,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex flex-col gap-3 pt-6 ${index % 2 === 1 ? 'items-end' : ''}`,
                                            children: product.benefits.map((benefit, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 text-sm font-medium opacity-80 text-black",
                                                    children: [
                                                        index % 2 === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `w-1.5 h-1.5 ${bgAccent} rounded-full`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/produits/page.tsx",
                                                            lineNumber: 123,
                                                            columnNumber: 69
                                                        }, this),
                                                        benefit,
                                                        index % 2 === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `w-1.5 h-1.5 ${bgAccent} rounded-full`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/produits/page.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 69
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/app/(store)/produits/page.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 45
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/(store)/produits/page.tsx",
                                            lineNumber: 120,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex flex-col sm:flex-row gap-6 pt-8 items-center ${index % 2 === 1 ? 'sm:justify-end' : ''}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: index % 2 === 1 ? 'text-right' : 'text-left',
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs uppercase tracking-widest opacity-50 mb-1",
                                                            children: "Prix Unitaire"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/produits/page.tsx",
                                                            lineNumber: 132,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-3xl font-bold font-mono text-black",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(product.price)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(store)/produits/page.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(store)/produits/page.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddToCartButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddToCartButton"], {
                                                    product: product,
                                                    className: "w-full sm:w-auto h-14 px-12 bg-black text-white hover:bg-black/90 rounded-full text-base tracking-wide shadow-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(store)/produits/page.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(store)/produits/page.tsx",
                                            lineNumber: 130,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(store)/produits/page.tsx",
                                    lineNumber: 107,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, product.id, true, {
                            fileName: "[project]/app/(store)/produits/page.tsx",
                            lineNumber: 88,
                            columnNumber: 29
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/(store)/produits/page.tsx",
                    lineNumber: 79,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(store)/produits/page.tsx",
                lineNumber: 78,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(store)/produits/page.tsx",
        lineNumber: 64,
        columnNumber: 9
    }, this);
}
_s(ProductsPage, "6ULWfZnWZyz9kKCB370sMACtkmc=");
_c = ProductsPage;
var _c;
__turbopack_context__.k.register(_c, "ProductsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_950cfb90._.js.map