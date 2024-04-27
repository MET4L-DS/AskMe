import { Outlet } from "react-router-dom";

const SharedLayout = () => {
    return (
        <div className="grid grid-cols-7 gap-3 ">
            <Outlet />
        </div>
    );
};

export default SharedLayout;
