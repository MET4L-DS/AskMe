import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SharedLayout, Home } from "./pages";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SharedLayout />}>
                    <Route index element={<Home />} />
                    {/* <Route path="/signup" element={<SignUp />} /> */}
                    {/* <Route path="/signout" element={<SignOut />} /> */}
                    {/* <Route path="/signin" element={<SignIn />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
