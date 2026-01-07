
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase-config';
import firebase from 'firebase/compat/app';
import { UserProfile } from './types';
import LandingPage from './screens/LandingPage';
import HomePage from './screens/HomePage';
import ProfilePage from './screens/ProfilePage';
import ChatPage from './screens/ChatPage';
import DMScreen from './screens/DMScreen';
import SearchPage from './screens/SearchPage';
import StoriesPage from './screens/StoriesPage';
import AccountSettings from './screens/AccountSettings';
import EditProfilePage from './screens/EditProfilePage';
import PostDetail from './screens/PostDetail';
import NotificationsPage from './screens/NotificationsPage';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

interface AuthContextType {
  user: firebase.User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });
export const useAuth = () => useContext(AuthContext);

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      
      if (unsubscribeProfile) { unsubscribeProfile(); unsubscribeProfile = null; }

      if (u) {
        // Track session for "Devices login History"
        const sessionId = window.sessionStorage.getItem('hfire_session_id') || Math.random().toString(36).substring(7);
        window.sessionStorage.setItem('hfire_session_id', sessionId);

        const getDeviceInfo = () => {
          const ua = navigator.userAgent;
          if (/android/i.test(ua)) return "Android Device";
          if (/iPad|iPhone|iPod/.test(ua)) return "iOS Device";
          if (/Macintosh/.test(ua)) return "macOS Computer";
          if (/Windows/.test(ua)) return "Windows PC";
          return "Web Browser";
        };

        const sessionRef = db.collection('users').doc(u.uid).collection('sessions').doc(sessionId);
        sessionRef.set({
          id: sessionId,
          device: getDeviceInfo(),
          userAgent: navigator.userAgent,
          lastActive: firebase.firestore.FieldValue.serverTimestamp(),
          location: 'Detected Session'
        }, { merge: true });

        unsubscribeProfile = db.collection('users').doc(u.uid).onSnapshot((doc) => {
          if (doc.exists) setProfile(doc.data() as UserProfile);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      <Router>
        <div className="flex flex-col md:flex-row min-h-screen bg-dark">
          {user && (
            <>
              <div className="hidden md:block w-64 fixed h-full border-r border-border">
                <Sidebar />
              </div>
              <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
                <MobileNav />
              </div>
            </>
          )}
          
          <main className={`flex-1 w-full ${user ? 'md:ml-64 mb-16 md:mb-0' : ''}`}>
            <Routes>
              <Route path="/" element={user ? <Navigate to="/home" /> : <LandingPage />} />
              <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
              <Route path="/profile/:userId?" element={user ? <ProfilePage /> : <Navigate to="/" />} />
              <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/" />} />
              <Route path="/chat/:convId" element={user ? <DMScreen /> : <Navigate to="/" />} />
              <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/" />} />
              <Route path="/stories/:userId?" element={user ? <StoriesPage /> : <Navigate to="/" />} />
              <Route path="/settings" element={user ? <AccountSettings /> : <Navigate to="/" />} />
              <Route path="/edit-profile" element={user ? <EditProfilePage /> : <Navigate to="/" />} />
              <Route path="/post/:postId" element={user ? <PostDetail /> : <Navigate to="/" />} />
              <Route path="/notifications" element={user ? <NotificationsPage /> : <Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
