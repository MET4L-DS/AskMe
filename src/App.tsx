import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SharedLayout, Home, SignUp, Logout, Login } from "./pages";
import SignIn from "./pages/SignIn";

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
        </BrowserRouter>
    );
};

export default App;
