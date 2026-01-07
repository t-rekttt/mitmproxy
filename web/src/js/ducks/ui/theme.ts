import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

export interface ThemeState {
    current: Theme;
}

const THEME_STORAGE_KEY = "mitmproxy-theme";

// Load theme from localStorage or default to light
const loadThemeFromStorage = (): Theme => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "dark" || stored === "light") {
            return stored;
        }
    }
    return "light";
};

const initialState: ThemeState = {
    current: loadThemeFromStorage(),
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.current = action.payload;
            // Persist to localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem(THEME_STORAGE_KEY, action.payload);
            }
            // Apply theme class to body
            if (typeof document !== "undefined") {
                document.body.classList.remove("theme-light", "theme-dark");
                document.body.classList.add(`theme-${action.payload}`);
            }
        },
        toggleTheme: (state) => {
            const newTheme = state.current === "light" ? "dark" : "light";
            state.current = newTheme;
            // Persist to localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            }
            // Apply theme class to body
            if (typeof document !== "undefined") {
                document.body.classList.remove("theme-light", "theme-dark");
                document.body.classList.add(`theme-${newTheme}`);
            }
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
