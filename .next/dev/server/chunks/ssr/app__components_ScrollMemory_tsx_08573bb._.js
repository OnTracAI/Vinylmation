module.exports = [
"[project]/app/_components/ScrollMemory.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollMemory",
    ()=>ScrollMemory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function ScrollMemory({ maxWaitMs = 2000 }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const key = `scroll:${pathname}`;
        const target = Number(sessionStorage.getItem(key) ?? 0);
        let cancelled = false;
        let restoring = target > 0;
        // Suspended while restoring so the router's reset can't overwrite the value.
        let recording = !restoring;
        const save = (y)=>sessionStorage.setItem(key, String(Math.round(y)));
        const previous = history.scrollRestoration;
        if ("scrollRestoration" in history) history.scrollRestoration = "manual";
        // requestAnimationFrame never fires while a tab is hidden, which would
        // leave a restore permanently pending for a page opened in the background.
        // Fall back to a timer so the work still happens either way.
        const timers = new Set();
        const schedule = (fn)=>{
            if (document.visibilityState === "visible") requestAnimationFrame(fn);
            else {
                const t = setTimeout(()=>{
                    timers.delete(t);
                    fn();
                }, 16);
                timers.add(t);
            }
        };
        // --- restore ---------------------------------------------------------
        const endRestore = ()=>{
            if (!restoring) return;
            restoring = false;
            recording = true;
        };
        if (restoring) {
            const deadline = performance.now() + maxWaitMs;
            let settled = 0;
            const step = ()=>{
                if (cancelled || !restoring) return;
                const reachable = document.documentElement.scrollHeight - window.innerHeight;
                const goal = Math.min(target, Math.max(reachable, 0));
                if (Math.abs(window.scrollY - goal) > 2) {
                    window.scrollTo(0, goal);
                    settled = 0;
                } else if (reachable >= target) {
                    // Held the position for a few frames — the router is done moving us.
                    if (++settled >= 3) return endRestore();
                }
                if (performance.now() < deadline) schedule(step);
                else endRestore();
            };
            schedule(step);
        }
        // --- record ----------------------------------------------------------
        let ticking = false;
        const onScroll = ()=>{
            if (!recording || ticking) return;
            ticking = true;
            schedule(()=>{
                ticking = false;
                if (recording) save(window.scrollY);
            });
        };
        // Deliberate input wins over an in-flight restore.
        const onUserInput = ()=>{
            if (restoring) endRestore();
        };
        // Capture phase: runs before the router handles the click and moves us.
        const onClick = (e)=>{
            if (!e.target?.closest?.("a[href]")) return;
            save(window.scrollY);
            recording = false;
        };
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        window.addEventListener("wheel", onUserInput, {
            passive: true
        });
        window.addEventListener("touchstart", onUserInput, {
            passive: true
        });
        window.addEventListener("keydown", onUserInput);
        document.addEventListener("click", onClick, true);
        window.addEventListener("pagehide", onScroll);
        return ()=>{
            cancelled = true;
            for (const t of timers)clearTimeout(t);
            timers.clear();
            if (recording) save(window.scrollY);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("wheel", onUserInput);
            window.removeEventListener("touchstart", onUserInput);
            window.removeEventListener("keydown", onUserInput);
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("pagehide", onScroll);
            if ("scrollRestoration" in history) history.scrollRestoration = previous;
        };
    }, [
        pathname,
        maxWaitMs
    ]);
    return null;
}
}),
];

//# sourceMappingURL=app__components_ScrollMemory_tsx_08573bb._.js.map