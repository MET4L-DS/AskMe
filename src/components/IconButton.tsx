import { motion } from "framer-motion";

const IconButton = ({
    children,
    color = "",
    bgColor = "",
    className = "",
    onClick = () => {},
}: {
    children: React.ReactNode;
    color?: string;
    bgColor?: string;
    className?: string;
    onClick?: () => void;
}) => {
    const bgColorClasses = [
        "bg-customGreen",
        "bg-customLightGreen",
        "bg-customAccentYellow",
        "bg-customAccentMaroon",
        "bg-customNeutral",
        "bg-customGray",
        "bg-customDark100",
        "bg-customDark200",
        "bg-customDark300",
        "bg-customDark400",
        "bg-customDark500",
    ];

    const fgColorClasses = [
        "text-customGreen",
        "text-customLightGreen",
        "text-customAccentYellow",
        "text-customAccentMaroon",
        "text-customNeutral",
        "text-customGray",
        "text-customDark100",
        "text-customDark200",
        "text-customDark300",
        "text-customDark400",
        "text-customDark500",
    ];
    // const className = `text-${color} bg-${bgColor}`;
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ color: "white", backgroundColor: "hsl(262, 40%, 55%)" }}
            type="button"
            className={` grid aspect-square w-10 grid-flow-col items-center justify-center gap-1 rounded-xl text-${color} bg-${bgColor} ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
};
export default IconButton;
