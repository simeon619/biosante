module.exports = [
"[project]/lib/utils.ts [app-rsc] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/node_modules_d76215f3._.js",
  "server/chunks/ssr/lib_utils_ts_78807e9c._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/utils.ts [app-rsc] (ecmascript)");
    });
});
}),
];