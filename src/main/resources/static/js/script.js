const byId = id => document.getElementById(id);
const unread = new Set();

function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function date(value, options = { month: "short", day: "numeric" }) {
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-US", options);
}

async function load(url) {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(String(response.status));
    return response.json();
}

function errorState(id, label) {
    const container = byId(id);
    container.className = "error";
    container.textContent = `Could not load ${label}.`;
}

function renderNews(items) {
    const container = byId("newsContainer");
    container.className = "";
    container.replaceChildren();
    if (!items.length) return container.append(node("div", "empty", "No news yet."));
    items.slice(0, 2).forEach(item => {
        const article = node("article", "news-item");
        article.append(node("time", "", date(item.date, { month: "long", day: "numeric", year: "numeric" })), node("h3", "", item.title), node("p", "", item.content));
        container.append(article);
    });
}

function renderAnnouncements(items) {
    const container = byId("announcementContainer");
    container.className = "";
    container.replaceChildren();
    items.forEach((item, index) => {
        const key = String(item.id ?? index);
        unread.add(key);
        const article = node("article", "announcement");
        article.dataset.key = key;
        article.append(node("strong", "", item.title), node("p", "", item.content));
        container.append(article);
    });
    byId("announcementCount").textContent = unread.size;
    if (!items.length) container.append(node("div", "empty", "Nothing new."));
}

function renderPolicies(items) {
    const container = byId("policyContainer");
    container.className = "";
    container.replaceChildren();
    items.slice(0, 3).forEach(item => {
        const row = node("div", "policy-row");
        const body = node("div");
        body.append(node("b", "", item.title), node("span", "", `${item.category || "Company"} · Updated ${date(item.lastUpdated)}`));
        row.append(node("span", "doc-icon", "▤"), body, node("i", "", "→"));
        container.append(row);
    });
}

function renderHolidays(items) {
    const container = byId("holidayContainer");
    container.className = "";
    container.replaceChildren();
    items.slice(0, 3).forEach(item => {
        const parsed = new Date(`${item.date}T00:00:00`);
        const dateBlock = node("div", "date");
        dateBlock.append(node("strong", "", Number.isNaN(parsed.getTime()) ? "—" : parsed.getDate()), node("small", "", Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-US", { month: "short" })));
        const body = node("div");
        body.append(node("b", "", item.holidayName), node("span", "", Number.isNaN(parsed.getTime()) ? item.date : parsed.toLocaleDateString("en-US", { weekday: "long" })));
        const row = node("div", "holiday-row");
        row.append(dateBlock, body, node("span", "", item.type));
        container.append(row);
    });
}

let toastTimer;
function toast(message) {
    const element = byId("toast");
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove("show"), 2200);
}

function setup() {
    byId("todayLabel").textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
    byId("menuButton").addEventListener("click", () => {
        const open = document.querySelector(".navbar").classList.toggle("open");
        byId("menuButton").setAttribute("aria-expanded", String(open));
    });
    byId("markReadButton").addEventListener("click", () => {
        unread.clear();
        document.querySelectorAll(".announcement").forEach(item => item.classList.add("read"));
        byId("announcementCount").textContent = "0";
        byId("markReadButton").disabled = true;
        toast("All announcements marked as read.");
    });
    document.querySelectorAll("[data-message]").forEach(item => item.addEventListener("click", event => { event.preventDefault(); toast(item.dataset.message); }));
    byId("searchInput").addEventListener("input", event => {
        const term = event.target.value.trim().toLowerCase();
        document.querySelectorAll(".news-item,.announcement,.policy-row,.holiday-row").forEach(item => item.hidden = Boolean(term) && !item.textContent.toLowerCase().includes(term));
    });
    try { window.startIntraOpsShader(byId("heroShader")); } catch (error) { console.warn("Shader unavailable", error); }
}

setup();
Promise.allSettled([
    load("/api/news").then(renderNews).catch(() => errorState("newsContainer", "news")),
    load("/api/announcements").then(renderAnnouncements).catch(() => errorState("announcementContainer", "announcements")),
    load("/api/policy").then(renderPolicies).catch(() => errorState("policyContainer", "policies")),
    load("/api/holidays").then(renderHolidays).catch(() => errorState("holidayContainer", "holidays"))
]);
