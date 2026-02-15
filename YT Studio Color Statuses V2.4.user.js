// ==UserScript==
// @name         YT Studio Color Statuses V2.4 - Visibility, Restrictions, Likes, Views
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Sistema de colores centralizado en YouTube Studio para Visibility, Restrictions, Likes y Views
// @author       Zalex108
// @V URL        https://forum.vivaldi.net/topic/115759/ystudio-colorize-content-statuses
// @match        https://studio.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // =====================================
    // 🔧 TAG DE CONFIGURACIÓN CENTRAL
    // =====================================
    const colorMap = {
        visibility: {
            "Public":   { color: "green",  weight: "450" },
            "Private":  { color: "orange", weight: "450" },
            "Unlisted": { color: "yellow", weight: "450" },
            "Removed":  { color: "purple", weight: "450" },
            "Blocked":  { color: "red",    weight: "450" },
            "Partially blocked":  	{ color: "orange",    weight: "450" }
        },
        restrictions: {
            "Copyright": 			{ color: "red", weight: "450" },
            "Terms and policies":  	{ color: "purple",  weight: "450" }
        },
        likes: {
            low:    	{ color: "red",    weight: "450" },    // 	<10 likes
            medium: 	{ color: "orange", weight: "450" },    // 10–99 likes
            high:   	{ color: "green",  weight: "450" }     //  100+ likes
        },
        views: {
            low:    	{ color: "red",    weight: "450" },    //  	 <100 views
            medium: 	{ color: "orange", weight: "450" },    // 100–999 views
            high:   	{ color: "green",  weight: "450" }     // 	1000+ views
        }
    };

    // =====================================
    // Función genérica para aplicar colores
    // =====================================
    function applyMapStyle(labels, map, isRange = false) {
        labels.forEach(label => {

            // Reset para nodos reciclados
            label.style.color = "";
            label.style.fontWeight = "";

            const text = label.textContent.trim();

            if (!isRange && map[text]) {
                // Mapeo exacto
                label.style.color = map[text].color;
                label.style.fontWeight = map[text].weight;
            }

            if (isRange) {
                // Mapear según rangos (Likes o Views)
                const num = parseInt(text.replace(/,/g, "")); // elimina comas
                if (!isNaN(num)) {
                    if (num < 10) {
                        if(map.low){ label.style.color = map.low.color; label.style.fontWeight = map.low.weight; }
                    } else if (num < 100) {
                        if(map.medium){ label.style.color = map.medium.color; label.style.fontWeight = map.medium.weight; }
                    } else {
                        if(map.high){ label.style.color = map.high.color; label.style.fontWeight = map.high.weight; }
                    }
                }
            }

        });
    }

    // =====================================
    // Función principal de coloreado
    // =====================================
    function colorize() {

        // VISIBILITY
        const visibilityLabels = document.querySelectorAll('.tablecell-visibility .label-span');
        applyMapStyle(visibilityLabels, colorMap.visibility);

        // RESTRICTIONS
        const restrictionsLabels = document.querySelectorAll('.tablecell-restrictions #restrictions-text');
        applyMapStyle(restrictionsLabels, colorMap.restrictions);

        // LIKES
        const likesLabels = document.querySelectorAll('.tablecell-likes .likes-label');
        applyMapStyle(likesLabels, colorMap.likes, true);

        // VIEWS
        const viewsLabels = document.querySelectorAll('.tablecell-views');
        applyMapStyle(viewsLabels, colorMap.views, true);
    }

    // =====================================
    // Observador SPA
    // =====================================
    const observer = new MutationObserver(() => {
        colorize();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Primera ejecución con delay
    window.addEventListener('load', () => {
        setTimeout(colorize, 1500);
    });

})();
