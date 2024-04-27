import { signOut } from "firebase/auth";
import { auth } from "../configs/firebase";

const Logout = () => {
    const handleLogout = async () => {
        try {
            const user = await signOut(auth);
            alert("Logged out successfully");
            console.log(user);
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
