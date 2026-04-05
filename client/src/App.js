import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";
import Home from "./components/Home.js";
import PlayingVideos from "./components/PlayingVideos.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js";
import Profile from "./pages/Profile.js";
import Subscriptions from "./pages/Subscriptions.js";
import YourChannel from "./pages/YourChannel.js";
import History from "./pages/History.js";
import Playlist from "./pages/Playlist.js";
import YourVideos from "./pages/YourVideos.js";
import WatchLater from "./pages/WatchLater.js";
import LikedVideos from "./pages/LikedVideos.js";
import ForgetPassword from "./pages/ForgetPassword.js";
import UpdateProfile from "./pages/UpdateProfile.js";
import UpdateVideo from "./pages/UpdateVideo.js";
import { ProtectedRoute } from "./components/ProtectedRoute.js";
import { clearAuthState, loadAuthState } from "./utils/storage.js";

function App() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const authState = loadAuthState();
        setLoggedIn(authState.isLoggedIn);
        setUser(authState.user);
    }, []);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function handleLogout() {
        clearAuthState();
        setLoggedIn(false);
        setUser(null);
    }

    function handleToggleSidebar() {
        if (window.innerWidth >= 1024) {
            setIsSidebarCollapsed((previous) => !previous);
            return;
        }

        setIsSidebarOpen((previous) => !previous);
    }

    return (
        <Router>
            <Header
                isLoggedIn={isLoggedIn}
                user={user}
                onLogout={handleLogout}
                onToggleSidebar={handleToggleSidebar}
            />
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar
                    isOpen={isSidebarOpen}
                    isCollapsed={isSidebarCollapsed}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/watch/:videoId" element={<PlayingVideos />} />
                    <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Home />} />
                    <Route
                        path="/login"
                        element={
                            !isLoggedIn ? (
                                <Login setLoggedIn={setLoggedIn} setUser={setUser} />
                            ) : (
                                <Home />
                            )
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Profile user={user} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile/update"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <UpdateProfile user={user} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <History />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/your-videos"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <YourVideos />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/videos/:videoId/edit"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <UpdateVideo />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/watch-later"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <WatchLater />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/liked-videos"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <LikedVideos />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/forget-password" element={<ForgetPassword />} />
                    <Route
                        path="/subscriptions"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Subscriptions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/your-channel"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <YourChannel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/playlist"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Playlist />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <div className="flex flex-1 items-center justify-center p-10">
                                <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        Page not found
                                    </h1>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
