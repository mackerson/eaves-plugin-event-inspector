import { jsxs as t, jsx as r } from "/node_modules/react/jsx-runtime";
import { useState as h, useEffect as y } from "/node_modules/react";
const { Button: c, Input: j, Badge: I, AppIcon: L } = window.EnclaveAPI.UI;
function O() {
  const [n, f] = h([]), [o, d] = h("all"), [m, b] = h(""), [g, N] = h(!0);
  y(() => {
    const e = async () => {
      try {
        const a = await window.electron.getEventHistory();
        a && Array.isArray(a) && f((s) => {
          var p, x;
          return s.length !== a.length || a.length > 0 && s.length > 0 && ((p = s[s.length - 1]) == null ? void 0 : p.timestamp) !== ((x = a[a.length - 1]) == null ? void 0 : x.timestamp) ? a.map((i, E) => ({
            id: `event-${i.timestamp}-${i.type}-${E}`,
            type: i.type,
            category: w(i.type),
            data: i.data,
            source: i.source || "unknown",
            timestamp: i.timestamp
          })) : s;
        });
      } catch (a) {
        console.error("Failed to load event history:", a);
      }
    };
    e();
    const l = setInterval(e, 1e3);
    return () => clearInterval(l);
  }, []);
  const w = (e) => e.startsWith("agent:") || e.startsWith("project:") || e.startsWith("channel:") || e.startsWith("message:") || e.startsWith("task:") || e.startsWith("note:") || e.startsWith("app:") ? "system" : e.startsWith("chat:") || e.startsWith("tool:") ? "ai" : e.startsWith("plugin:") ? "plugin" : "custom", u = n.filter((e) => {
    if (o !== "all" && e.category !== o)
      return !1;
    if (m) {
      const l = m.toLowerCase();
      return e.type.toLowerCase().includes(l) || e.source.toLowerCase().includes(l) || JSON.stringify(e.data).toLowerCase().includes(l);
    }
    return !0;
  });
  y(() => {
    if (g) {
      const e = document.getElementById("event-list");
      e && (e.scrollTop = e.scrollHeight);
    }
  }, [u, g]);
  const v = async () => {
    f([]);
    try {
      await window.electron.clearEventHistory();
    } catch (e) {
      console.error("Failed to clear event history:", e);
    }
  }, C = () => {
    const e = JSON.stringify(u, null, 2), l = new Blob([e], { type: "application/json" }), a = URL.createObjectURL(l), s = document.createElement("a");
    s.href = a, s.download = `enclave-events-${Date.now()}.json`, s.click(), URL.revokeObjectURL(a);
  }, k = (e) => {
    switch (e) {
      case "system":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "ai":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "plugin":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "custom":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  }, S = (e) => new Date(e).toLocaleTimeString("en-US", {
    hour12: !1,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3
  });
  return /* @__PURE__ */ t("div", { className: "flex flex-col h-full bg-background", children: [
    /* @__PURE__ */ t("div", { className: "p-4 border-b border-border space-y-3", children: [
      /* @__PURE__ */ t("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ r("h2", { className: "text-xl font-semibold", children: "Event Inspector" }),
        /* @__PURE__ */ t("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ r(
            c,
            {
              variant: "outline",
              size: "sm",
              onClick: v,
              title: "Clear all events",
              children: "Clear"
            }
          ),
          /* @__PURE__ */ r(
            c,
            {
              variant: "outline",
              size: "sm",
              onClick: C,
              title: "Export events to JSON",
              children: "Export"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ t(
          c,
          {
            variant: o === "all" ? "default" : "outline",
            size: "sm",
            onClick: () => d("all"),
            children: [
              "All (",
              n.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ t(
          c,
          {
            variant: o === "system" ? "default" : "outline",
            size: "sm",
            onClick: () => d("system"),
            children: [
              "System (",
              n.filter((e) => e.category === "system").length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ t(
          c,
          {
            variant: o === "ai" ? "default" : "outline",
            size: "sm",
            onClick: () => d("ai"),
            children: [
              "AI (",
              n.filter((e) => e.category === "ai").length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ t(
          c,
          {
            variant: o === "plugin" ? "default" : "outline",
            size: "sm",
            onClick: () => d("plugin"),
            children: [
              "Plugin (",
              n.filter((e) => e.category === "plugin").length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ t(
          c,
          {
            variant: o === "custom" ? "default" : "outline",
            size: "sm",
            onClick: () => d("custom"),
            children: [
              "Custom (",
              n.filter((e) => e.category === "custom").length,
              ")"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ t("div", { className: "flex gap-2 items-center", children: [
        /* @__PURE__ */ r(
          j,
          {
            type: "text",
            placeholder: "Search events...",
            value: m,
            onChange: (e) => b(e.target.value),
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ t("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: g,
              onChange: (e) => N(e.target.checked),
              className: "rounded"
            }
          ),
          "Auto-scroll"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ r(
      "div",
      {
        id: "event-list",
        className: "flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm",
        children: u.length === 0 ? /* @__PURE__ */ t("div", { className: "text-center text-muted-foreground py-8", children: [
          /* @__PURE__ */ r("div", { className: "mb-2 flex justify-center", children: /* @__PURE__ */ r(L, { name: "search", size: 48 }) }),
          /* @__PURE__ */ r("p", { children: "No events to display" }),
          /* @__PURE__ */ r("p", { className: "text-xs mt-1", children: m ? "Try a different search term" : "Events will appear here in real-time" })
        ] }) : u.map((e) => /* @__PURE__ */ r(
          "div",
          {
            className: "p-3 rounded-lg bg-card border border-border hover:bg-accent transition-colors",
            children: /* @__PURE__ */ t("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ r("div", { className: "text-muted-foreground text-xs whitespace-nowrap pt-0.5", children: S(e.timestamp) }),
              /* @__PURE__ */ r(
                I,
                {
                  variant: "outline",
                  className: `${k(e.category)} text-xs`,
                  children: e.category
                }
              ),
              /* @__PURE__ */ t("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ t("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ r("span", { className: "font-semibold text-foreground", children: e.type }),
                  e.source !== "core" && /* @__PURE__ */ t("span", { className: "text-xs text-muted-foreground", children: [
                    "from ",
                    e.source
                  ] })
                ] }),
                e.data && /* @__PURE__ */ t("details", { className: "mt-2", children: [
                  /* @__PURE__ */ r("summary", { className: "cursor-pointer text-xs text-muted-foreground hover:text-foreground", children: "View data" }),
                  /* @__PURE__ */ r("pre", { className: "mt-2 p-2 rounded bg-muted text-xs overflow-x-auto", children: JSON.stringify(e.data, null, 2) })
                ] })
              ] })
            ] })
          },
          e.id
        ))
      }
    ),
    /* @__PURE__ */ r("div", { className: "p-3 border-t border-border bg-card", children: /* @__PURE__ */ t("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ t("span", { children: [
        "Showing ",
        u.length,
        " of ",
        n.length,
        " events"
      ] }),
      /* @__PURE__ */ r("span", { children: "Max buffer: 1000 events" })
    ] }) })
  ] });
}
export {
  O as EventInspectorComponent,
  O as default
};
//# sourceMappingURL=index.js.map
