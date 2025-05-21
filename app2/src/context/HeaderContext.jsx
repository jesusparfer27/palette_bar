// context/ThemeContext.js
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "./ThemeContext";
import { Draggable } from "gsap/Draggable";
import { throttle } from "lodash"; // O implementa tu propio throttle

gsap.registerPlugin(Draggable);


const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const { setPalette, colorGroups, palette, hexToRgba } = useTheme();

    const [isExpanded, setIsExpanded] = useState(false)
    const [clickDelay, setClickDelay] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [dotsClickable, setDotsClickable] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false)
    const [showHr, setShowHr] = useState(false);
    const currentDragIndex = useRef(null);

    const svgContainerRef = useRef(null)
    const svgIconRef = useRef(null)
    const dotsRefs = useRef([]);
    dotsRefs.current = [];
    const textRef = useRef(null);
    const headerRef = useRef(null);

//     const throttledSetPalette = useRef(
//   throttle((palette) => {
//     setPalette(palette);
//   }, 100)
// ).current;
    

    useEffect(() => {
               

        if (!isExpanded) return;

        const icon = svgIconRef.current;
        const container = svgContainerRef.current;

        if (!icon || !container) return;

        console.log("📏 Container height:", container.getBoundingClientRect().height);

        const dragInstance = Draggable.create(icon, {
            type: "y",
            bounds: container,
            trigger: icon,
            inertia: false,

            onPress() {
        icon.style.cursor = "pointer"; // Fuerza el cursor pointer al hacer clic
    },

            onDrag() {
                if (isAnimating) return;

                icon.style.cursor = "pointer"; // Asegura que siga siendo pointer durante el drag

                const iconRect = icon.getBoundingClientRect();
                const iconCenterY = iconRect.top + iconRect.height / 2;

                let nearestIndex = null;
                let nearestDistance = Infinity;

                dotsRefs.current.forEach((dot, index) => {
                    if (!dot) return;
                    const dotRect = dot.getBoundingClientRect();
                    const dotCenterY = dotRect.top + dotRect.height / 2;
                    const distance = Math.abs(iconCenterY - dotCenterY);

                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestIndex = index;
                    }
                });

                // Guarda el índice más cercano, pero no llames a setPalette aquí
                if (nearestIndex !== currentDragIndex.current) {
                    currentDragIndex.current = nearestIndex;
                    console.log("Índice cercano durante drag:", nearestIndex);
                    // Aquí podrías actualizar visuales no React o dejar pendiente
                }
              
         
                        setPalette(colorGroups[currentDragIndex.current]);
                    
                
            },

            onRelease() {

                icon.style.cursor = "pointer"; // Asegura que siga siendo pointer durante el drag
                if (isAnimating) return;

                if (currentDragIndex.current === null) return;

                const closestDot = dotsRefs.current[currentDragIndex.current];
                if (!closestDot) return;

                const dotRect = closestDot.getBoundingClientRect();
                const iconRect = icon.getBoundingClientRect();

                const offsetY = dotRect.top + dotRect.height / 2 - (iconRect.top + iconRect.height / 2);

                // Snap con GSAP
                gsap.to(icon, {
                    y: `+=${offsetY}`,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete() {
                        // Ahora sí actualiza la paleta en React sin interrumpir el drag
                        setPalette(colorGroups[currentDragIndex.current]);
                    }
                });
            },
        });
        return () => {
            dragInstance[0]?.kill();
        };
    }, [isExpanded, isAnimating, setPalette]);




    const collapseAnimation = () => {
        const tl = gsap.timeline();
        const dots = dotsRefs.current;


        tl.to(svgIconRef.current, {
            y: 0,
            rotate: 0,
            duration: 0.6,
            ease: "power2.inOut"
        });
        tl.to(dots, {
            y: 20,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in"
        });

        tl.to(svgContainerRef.current, {
            height: '48px',
            transformOrigin: "bottom",
            duration: 0.6,
            ease: "power2.inOut"
        });

        setIsExpanded(false);
    };



    const handleClick = () => {
        console.log('isExpanded before toggle:', isExpanded);
        if (isExpanded) return;
        const tl = gsap.timeline();

        setIsAnimating(true); // <-- bloquea interacciones

        const dots = isExpanded
            ? dotsRefs.current
            : dotsRefs.current.slice().reverse();

        if (isExpanded) {
            tl.to(dots, {
                y: 20,
                opacity: 0,
                duration: 0.3,
                stagger: 0.04,
                ease: "power2.in"
            });

            tl.to(svgIconRef.current, {
                y: 0,
                rotate: 0,
                duration: 0.4,
                ease: "power2.inOut"
            });

            tl.to(svgContainerRef.current, {
                height: '48px',
                transformOrigin: "bottom",
                duration: 0.4,
                ease: "power2.inOut"
            });

            tl.to(svgIconRef.current, {
                rotate: 0,
                duration: 0.4,
                ease: "power2.out"
            }, "<");
        } else {
            tl.to(svgContainerRef.current, {
                height: '360px',
                transformOrigin: "bottom",
                duration: 0.4,
                ease: "power2.inOut"
            });

            tl.to(svgIconRef.current, {
                rotate: 180,
                duration: 0.4,
                ease: "power2.out"
            }, "<");

            tl.fromTo(
                dots,
                {
                    y: 20,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.out",
                }
            );
            tl.call(() => {
                const defaultIndex = colorGroups.findIndex(group => group.name === palette.name);
                console.log('🎯 Default index:', defaultIndex);
                console.log('🎨 Palette name:', palette.name);
                console.log('🎨 colorGroups[defaultIndex]:', colorGroups[defaultIndex]?.name);
                const targetDot = dotsRefs.current[defaultIndex];

                if (targetDot && svgIconRef.current) {
                    // 🔥 Asegúrate de que los transforms previos están limpios
                    gsap.set(svgIconRef.current, { y: 0 });

                    const dotRect = targetDot.getBoundingClientRect();
                    const svgRect = svgIconRef.current.getBoundingClientRect();

                    const offsetY = dotRect.top + dotRect.height / 2 - (svgRect.top + svgRect.height / 2);

                    gsap.to(svgIconRef.current, {
                        y: offsetY,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            });
        }

       tl.call(() => {
        setIsExpanded(!isExpanded);
        setClickDelay(true);
    });
    tl.call(() => {
        setClickDelay(false);
        setIsAnimating(false); // <-- habilita de nuevo interacciones
    }, null, ); // Ajusta el delay si lo ves necesario
    };



    const handleDotClick = (index) => {
        const tl = gsap.timeline();
        const targetDot = dotsRefs.current[index];

        const dotRect = targetDot.getBoundingClientRect();
        const svgRect = svgIconRef.current.getBoundingClientRect();

        const dotCenterY = dotRect.top + dotRect.height / 2;
        const svgCenterY = svgRect.top + svgRect.height / 2;

        const offsetY = dotCenterY - svgCenterY;

        tl.to(svgIconRef.current, {
            y: `+=${offsetY}`,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const addToDotsRefs = (el) => {
        if (el && !dotsRefs.current.includes(el)) {
            dotsRefs.current.push(el);
        }
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (clickDelay) return;
            const svgContainer = svgContainerRef.current;
            const svgIcon = svgIconRef.current;
            const dots = dotsRefs.current;

            const isClickInsideSvg = svgContainer && svgContainer.contains(event.target);
            const isClickInsideDots = dots.some(dot => dot && dot.contains(event.target));

            if (!isClickInsideSvg && !isClickInsideDots && isExpanded) {
                collapseAnimation();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded, clickDelay]);


    useEffect(() => {
        gsap.set(headerRef.current, { opacity: 0 });
        const timer = setTimeout(() => {
            gsap.to(headerRef.current, {
                opacity: 1,
                duration: 1.5,
                ease: "power2.out"
            });
        }, 2800); // 0.5s delay

        return () => clearTimeout(timer);
    }, []);




    return (
        <HeaderContext.Provider value={{
            collapseAnimation,
            setIsExpanded,
            svgIconRef,
            svgContainerRef,
            dotsRefs,
            isOpen,
            setIsOpen,
            handleClick,
            addToDotsRefs,
            handleDotClick,
            textRef,
            headerRef,
            isExpanded,
            clickDelay,
            setClickDelay,
            showHr,
            setShowHr
        }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeaderContext = () => useContext(HeaderContext);
