
const loadTheme = (currentTheme) => {
    const existingTheme = document.getElementById("themeStylesheet");
    if (existingTheme) {
        existingTheme.remove();
    }

    const themeElement = document.createElement("link");
    themeElement.id = "themeStylesheet";
    themeElement.rel = "stylesheet";
    themeElement.href = `/styles/themes/${currentTheme}.css`;
    document.head.appendChild(themeElement);
}

window.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme") || "vapor";
    loadTheme(theme);
});

window.addEventListener("storage", (event) => {
    if (event.key === "theme") {
        loadTheme(event.newValue || "vapor");
    }
});
