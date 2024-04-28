const IconButton = ({
    children,
    color = "",
    bgColor = "",
    className = "",
}: {
    children: React.ReactNode;
    color?: string;
    bgColor?: string;
    className?: string;
}) => {
    // const className = `text-${color} bg-${bgColor}`;
    return (
        <div
            style={{
                backgroundColor: bgColor,
                color: color,
            }}
            className={` grid aspect-square w-10 grid-flow-col items-center justify-center gap-1 rounded-xl ${className}`}
        >
            {children}
        </div>
    );
};
export default IconButton;
