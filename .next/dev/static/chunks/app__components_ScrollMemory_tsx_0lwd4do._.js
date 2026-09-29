(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/_components/ScrollMemory.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollMemory",
    ()=>ScrollMemory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ScrollMemory({ maxWaitMs = 2000 }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollMemory.useEffect": ()=>{
            const key = `scroll:${pathname}`;
            const target = Number(sessionStorage.getItem(key) ?? 0);
            let cancelled = false;
            let restoring = target > 0;
            // Suspended while restoring so the router's reset can't overwrite the value.
            let recording = !restoring;
            const save = {
                "ScrollMemory.useEffect.save": (y)=>sessionStorage.setItem(key, String(Math.round(y)))
            }["ScrollMemory.useEffect.save"];
            const previous = history.scrollRestoration;
            if ("scrollRestoration" in history) history.scrollRestoration = "manual";
            // requestAnimationFrame never fires while a tab is hidden, which would
            // leave a restore permanently pending for a page opened in the background.
            // Fall back to a timer so the work still happens either way.
            const timers = new Set();
            const schedule = {
                "ScrollMemory.useEffect.schedule": (fn)=>{
                    if (document.visibilityState === "visible") requestAnimationFrame(fn);
                    else {
                        const t = setTimeout({
                            "ScrollMemory.useEffect.schedule.t": ()=>{
                                timers.delete(t);
                                fn();
                            }
                        }["ScrollMemory.useEffect.schedule.t"], 16);
                        timers.add(t);
                    }
                }
            }["ScrollMemory.useEffect.schedule"];
            // --- restore ---------------------------------------------------------
            const endRestore = {
                "ScrollMemory.useEffect.endRestore": ()=>{
                    if (!restoring) return;
                    restoring = false;
                    recording = true;
                }
            }["ScrollMemory.useEffect.endRestore"];
            if (restoring) {
                const deadline = performance.now() + maxWaitMs;
                let settled = 0;
                const step = {
                    "ScrollMemory.useEffect.step": ()=>{
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
                    }
                }["ScrollMemory.useEffect.step"];
                schedule(step);
            }
            // --- record ----------------------------------------------------------
            let ticking = false;
            const onScroll = {
                "ScrollMemory.useEffect.onScroll": ()=>{
                    if (!recording || ticking) return;
                    ticking = true;
                    schedule({
                        "ScrollMemory.useEffect.onScroll": ()=>{
                            ticking = false;
                            if (recording) save(window.scrollY);
                        }
                    }["ScrollMemory.useEffect.onScroll"]);
                }
            }["ScrollMemory.useEffect.onScroll"];
            // Deliberate input wins over an in-flight restore.
            const onUserInput = {
                "ScrollMemory.useEffect.onUserInput": ()=>{
                    if (restoring) endRestore();
                }
            }["ScrollMemory.useEffect.onUserInput"];
            // Capture phase: runs before the router handles the click and moves us.
            const onClick = {
                "ScrollMemory.useEffect.onClick": (e)=>{
                    if (!e.target?.closest?.("a[href]")) return;
                    save(window.scrollY);
                    recording = false;
                }
            }["ScrollMemory.useEffect.onClick"];
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
            return ({
                "ScrollMemory.useEffect": ()=>{
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
                }
            })["ScrollMemory.useEffect"];
        }
    }["ScrollMemory.useEffect"], [
        pathname,
        maxWaitMs
    ]);
    return null;
}
_s(ScrollMemory, "V/ldUoOTYUs0Cb2F6bbxKSn7KxI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ScrollMemory;
var _c;
__turbopack_context__.k.register(_c, "ScrollMemory");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app__components_ScrollMemory_tsx_0lwd4do._.js.map