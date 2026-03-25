// Environment configuration with safe fallbacks
export const ENV = {
  // Firebase Configuration
  FIREBASE: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAlU3et850ae8Y4IE5qxz8A5qImqZQIzZk",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "passionpagesai-cf962.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "passionpagesai-cf962",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "passionpagesai-cf962.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "944678664399",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:944678664399:web:dbdbe230fea3b1c1371fba",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HC0M5RB43H"
  },

  // Supabase Configuration  
  SUPABASE: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  },

  // API Configuration
  API: {
    backendUrl: import.meta.env.VITE_BACKEND_URL || ""
  }
};

// Check if required environment variables are present
export const checkEnv = () => {
  const missing = [];
  
  if (!ENV.SUPABASE.url) missing.push('VITE_SUPABASE_URL');
  if (!ENV.SUPABASE.anonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  
  if (missing.length > 0) {
    console.warn('[ENV] Missing environment variables:', missing.join(', '));
    console.warn('[ENV] Some features may not work correctly.');
  }
  
  return missing.length === 0;
};
