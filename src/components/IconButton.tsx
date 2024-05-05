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
    // const className = `text-${color} bg-${bgColor}`;
    return (
        <button
            type="button"
            style={{
                backgroundColor: bgColor,
                color: color,
            }}
            className={` grid aspect-square w-10 grid-flow-col items-center justify-center gap-1 rounded-xl ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
export default IconButton;
