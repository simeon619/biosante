module.exports = [
"[project]/lib/utils.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/node_modules_0e1ce2d1._.js",
  "server/chunks/ssr/lib_utils_ts_2428e286._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/utils.ts [app-ssr] (ecmascript)");
    });
});
}),
];