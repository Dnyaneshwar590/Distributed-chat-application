import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Chat from "../pages/Chat";

function AppRouter() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace/>}/>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<h1>404 - Page Not Found</h1>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;