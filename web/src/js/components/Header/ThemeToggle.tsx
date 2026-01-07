import React from "react";
import { useAppDispatch, useAppSelector } from "../../ducks";
import { toggleTheme } from "../../ducks/ui/theme";

export default function ThemeToggle() {
    const dispatch = useAppDispatch();
    const currentTheme = useAppSelector((state) => state.ui.theme.current);

    const handleToggle = () => {
        dispatch(toggleTheme());
    };

    return (
        <button
            className="btn btn-default btn-sm theme-toggle"
            onClick={handleToggle}
            title={`Switch to ${currentTheme === "light" ? "dark" : "light"} theme`}
        >
            <i className={`fa fa-${currentTheme === "light" ? "moon-o" : "sun-o"}`} />
        </button>
    );
}
