"use strict";
const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
};
const loadTheme = () => {
    const theme = JSON.parse(localStorage.getItem("settings"))?.theme;
    if (theme == null) {
        return;
    }
    setTheme(theme);
};
loadTheme();

//# sourceMappingURL=theme.js.map
