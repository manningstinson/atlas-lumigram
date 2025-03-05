// app/services/auth.service.ts
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { app } from '../../firebaseConfig';

const auth = getAuth(app);

export const authService = {
  // Register a new user
  register: async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },
  
  // Login existing user
  login: async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },
  
  // Sign out current user
  logout: async () => {
    return signOut(auth);
  },
  
  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },
  
  // Listen to auth state changes
  subscribeToAuthChanges: (onUserChanged: (user: User | null) => void) => {
    return onAuthStateChanged(auth, onUserChanged);
  }
};