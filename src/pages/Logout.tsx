import { signOut } from "firebase/auth";
import { auth } from "../configs/firebase";
import { setUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";

const Logout = () => {
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            const user = await signOut(auth);
            alert("Logged out successfully");
            console.log(user);

            dispatch(setUser({ id: null, email: null }));
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            <button type="button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};
export default Logout;
