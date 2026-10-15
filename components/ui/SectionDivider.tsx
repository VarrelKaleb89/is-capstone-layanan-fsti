"use client";

import { motion } from "framer-motion";

type DividerType = "wave" | "curve" | "slant" | "triangle" | "zigzag" | "tilt";

interface SectionDividerProps {
    type?: DividerType;
    /** Color of the SVG shape fill — matches the NEXT section's background */
    fillColor?: string;
    /** Background color behind the SVG — matches the PREVIOUS section's background */
    bgColor?: string;
    /** Flip vertically */
    flip?: boolean;
    /** Custom height class */
    heightClass?: string;
    /** Animate on scroll */
    animate?: boolean;
}

const SectionDivider = ({
    type = "wave",
    fillColor = "#f8fafc", // default: light-bg
    bgColor = "transparent",
    flip = false,
    heightClass = "h-16 md:h-24",
    animate = true,
}: SectionDividerProps) => {

    const getSvgPath = () => {
        switch (type) {
            case "wave":
                return (
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        <path
                            d="M0,64 C120,100 240,20 360,64 C480,108 600,28 720,64 C840,100 960,20 1080,64 C1200,108 1320,28 1440,64 L1440,120 L0,120 Z"
                            fill={fillColor}
                            shapeRendering="geometricPrecision"
                        />
                    </svg>
                );

            case "curve":
                return (
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        <path
                            d="M0,120 C360,0 1080,0 1440,120 L1440,120 L0,120 Z"
                            fill={fillColor}
                        />
                    </svg>
                );

            case "slant":
                return (
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        <polygon points="0,120 1440,0 1440,120" fill={fillColor} />
                    </svg>
                );

            case "triangle":
                return (
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        <polygon points="0,120 720,0 1440,120" fill={fillColor} />
                    </svg>
                );

            case "zigzag":
                return (
                    <svg
                        viewBox="0 0 1440 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        <polygon
                            points="0,80 80,30 160,80 240,30 320,80 400,30 480,80 560,30 640,80 720,30 800,80 880,30 960,80 1040,30 1120,80 1200,30 1280,80 1360,30 1440,80 1440,80 0,80"
                            fill={fillColor}
                        />
                    </svg>
                );

            case "tilt":
                return (
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        <path
                            d="M0,120 L0,80 Q360,0 720,40 Q1080,80 1440,0 L1440,120 Z"
                            fill={fillColor}
                        />
                    </svg>
                );

            default:
                return null;
        }
    };

    const content = (
        <div
            className={`w-full ${heightClass} overflow-hidden relative`}
            style={{
                backgroundColor: bgColor,
                transform: flip ? "scaleY(-1)" : undefined,
            }}
        >
            <div className="absolute inset-0 w-full h-full">
                {getSvgPath()}
            </div>
        </div>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {content}
            </motion.div>
        );
    }

    return content;
};

export default SectionDivider;
