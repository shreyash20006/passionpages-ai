import { auth } from './firebase';

export const getAuthToken = async () => {
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken();
};

