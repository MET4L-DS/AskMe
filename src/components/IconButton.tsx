const IconButton = ({
    children,
    color = "",
    bgColor = "",
}: {
    children: React.ReactNode;
    color?: string;
    bgColor?: string;
}) => {
    // const className = `text-${color} bg-${bgColor}`;
    return (
        <div
            style={{
                backgroundColor: bgColor,
                color: color,
            }}
            className={` grid aspect-square w-10 grid-flow-col items-center justify-center gap-1 rounded-xl text-xl`}
        >
            {children}
        </div>
    );
};
export default IconButton;
