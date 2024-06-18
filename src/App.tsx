import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SharedLayout, Home, SignUp, Logout,SignIn } from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SharedLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/login" element={<SignIn />} />
                </Route>
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    );
};

export default App;
