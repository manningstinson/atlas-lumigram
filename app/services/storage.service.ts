// app/services/storage.service.ts
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebaseConfig';

const storage = getStorage(app);

export const storageService = {
  uploadImage: async (uri: string, path: string): Promise<string> => {
    try {
      // Convert image uri to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Create a reference to the storage location
      const storageRef = ref(storage, path);
      
      // Upload the file
      const uploadTask = await uploadBytesResumable(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};