// context/ThemeContext.js
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const colorGroups = [
  { name: "White Snow", colors: ["#222222", "#ffffff"] },   // Azul profundo y azul claro
  { name: "Ocean Breeze", colors: ["#1E3A5F", "#A8DADC"] },   // Azul profundo y azul claro
  { name: "Sky Light", colors: ["#5DADE2", "#D6EAF8"] },      // Azul celeste y azul muy claro
  { name: "Deep Sea", colors: ["#154360", "#1F618D"] },       // Azul marino y azul medio
  { name: "Forest Haze", colors: ["#14532D", "#A7F3D0"] },    // Verde oscuro y verde menta
  { name: "Emerald Dream", colors: ["#064E3B", "#10B981"] },  // Verde esmeralda y verde brillante
  { name: "Mint Fresh", colors: ["#D1FAE5", "#6EE7B7"] },     // Verde muy claro y verde pastel
  { name: "Pine Grove", colors: ["#065F46", "#34D399"] },     // Verde pino y verde suave
  { name: "Rose Blush", colors: ["#C2185B", "#F8BBD0"] },     // Rosa intenso y rosa claro
  { name: "Crimson Sunset", colors: ["#8E0038", "#FF6F61"] }, // Rojo oscuro y coral
  { name: "Pink Mist", colors: ["#F48FB1", "#FCE4EC"] },      // Rosa medio y rosa muy claro
  { name: "Berry Burst", colors: ["#880E4F", "#E91E63"] },    // Fucsia oscuro y fucsia brillante
  { name: "Urban Fog", colors: ["#2E2E2E", "#BDBDBD"] },      // Gris oscuro y gris claro
  { name: "Slate Light", colors: ["#37474F", "#ECEFF1"] },    // Gris azulado y gris muy claro
  { name: "Charcoal Mist", colors: ["#212121", "#757575"] },  // Carbón y gris medio
  { name: "Blackout", colors: ["#ffffff", "#000000"] },// Gris medio y gris claro
];

    const hexToRgba = (hex, alpha = 0.3) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }


    const [palette, setPalette] = useState(colorGroups.find(palette => palette.name === "Blackout")); // Por defecto: Blackout


    return (
        <ThemeContext.Provider value={{ palette, setPalette, colorGroups, hexToRgba }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
