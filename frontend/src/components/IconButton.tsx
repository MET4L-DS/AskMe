import { motion } from "framer-motion";
import { memo } from "react";

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
export default memo(IconButton);
