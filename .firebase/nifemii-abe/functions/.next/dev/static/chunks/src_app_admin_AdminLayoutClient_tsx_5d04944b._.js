(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/admin/AdminLayoutClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminLayoutClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function AdminLayoutClient({ children }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminLayoutClient.useEffect": ()=>{
            // Hide navbar and footer for admin pages
            const navbar = document.querySelector("body > nav, header nav");
            const footer = document.querySelector("body > footer, footer");
            if (navbar) navbar.style.display = "none";
            if (footer) footer.style.display = "none";
            return ({
                "AdminLayoutClient.useEffect": ()=>{
                    // Restore navbar and footer when leaving admin
                    if (navbar) navbar.style.display = "";
                    if (footer) footer.style.display = "";
                }
            })["AdminLayoutClient.useEffect"];
        }
    }["AdminLayoutClient.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-layout",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/admin/AdminLayoutClient.tsx",
        lineNumber: 25,
        columnNumber: 10
    }, this);
}
_s(AdminLayoutClient, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = AdminLayoutClient;
var _c;
__turbopack_context__.k.register(_c, "AdminLayoutClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_admin_AdminLayoutClient_tsx_5d04944b._.js.map