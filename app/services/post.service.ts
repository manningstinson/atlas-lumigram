// app/services/post.service.ts
import { 
  getFirestore, 
  collection, 
  doc,
  addDoc, 
  updateDoc,
  getDocs, 
  getDoc,
  deleteDoc,
  query, 
  where,
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot 
} from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { authService } from './auth.service';

const db = getFirestore(app);
const postsCollection = collection(db, 'posts');
const favoritesCollection = collection(db, 'favorites');

export interface Post {
  id?: string;
  imageUrl: string;
  caption: string;
  createdAt: Timestamp;
  createdBy: string;
  likes?: number;
  username: string; // Required username
}

export interface PostWithFavorite extends Post {
  isFavorite: boolean;
}

export const postService = {
  // Create a new post
  createPost: async (imageUrl: string, caption: string): Promise<string> => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    // Generate a username from email address
    const username = currentUser.email?.split('@')[0] || 'anonymous';
    
    const postData = {
      imageUrl,
      caption,
      createdAt: Timestamp.now(),
      createdBy: currentUser.uid,
      likes: 0,
      username: username // Always include username
    };
    
    const docRef = await addDoc(postsCollection, postData);
    return docRef.id;
  },
  
  // Get posts with pagination
  getPosts: async (lastVisible?: QueryDocumentSnapshot<DocumentData>, pageSize: number = 10) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    let postQuery;
    
    if (lastVisible) {
      postQuery = query(
        postsCollection, 
        orderBy('createdAt', 'desc'), 
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      postQuery = query(
        postsCollection, 
        orderBy('createdAt', 'desc'), 
        limit(pageSize)
      );
    }
    
    const snapshot = await getDocs(postQuery);
    const posts: Post[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({ 
        id: doc.id, 
        ...data,
        username: data.username || 'Anonymous' // Ensure username is never undefined
      } as Post);
    });
    
    // Check which posts are favorited by the current user
    const postsWithFavorites = await Promise.all(
      posts.map(async (post) => {
        const isFavorite = await postService.isPostFavorited(post.id!);
        return { ...post, isFavorite } as PostWithFavorite;
      })
    );
    
    return {
      posts: postsWithFavorites,
      lastVisible: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined
    };
  },
  
  // Check if a post is favorited by the current user
  isPostFavorited: async (postId: string): Promise<boolean> => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return false;
    
    const favQuery = query(
      favoritesCollection,
      where('postId', '==', postId),
      where('userId', '==', currentUser.uid)
    );
    
    const snapshot = await getDocs(favQuery);
    return !snapshot.empty;
  },
  
  // Toggle favorite status of a post
  toggleFavorite: async (postId: string): Promise<boolean> => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const isFavorited = await postService.isPostFavorited(postId);
    
    if (isFavorited) {
      // Remove from favorites
      const favQuery = query(
        favoritesCollection,
        where('postId', '==', postId),
        where('userId', '==', currentUser.uid)
      );
      
      const snapshot = await getDocs(favQuery);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      
      return false;
    } else {
      // Add to favorites
      await addDoc(favoritesCollection, {
        postId,
        userId: currentUser.uid,
        createdAt: Timestamp.now()
      });
      
      return true;
    }
  },
  
  // Get favorites for the current user
  getFavorites: async (lastVisible?: QueryDocumentSnapshot<DocumentData>, pageSize: number = 10) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    let favQuery;
    
    if (lastVisible) {
      favQuery = query(
        favoritesCollection,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      favQuery = query(
        favoritesCollection,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }
    
    const snapshot = await getDocs(favQuery);
    const favorites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as { id: string; postId: string }));
    
    // Get the corresponding posts for each favorite
    const favoritePosts: PostWithFavorite[] = [];
    
    for (const favorite of favorites) {
      const postDoc = await getDoc(doc(postsCollection, favorite.postId));
      if (postDoc.exists()) {
        const postData = postDoc.data();
        favoritePosts.push({ 
          id: postDoc.id, 
          ...postData, 
          username: postData.username || 'Anonymous', // Ensure username is never undefined
          isFavorite: true 
        } as PostWithFavorite);
      }
    }
    
    return {
      posts: favoritePosts,
      lastVisible: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined
    };
  }
};