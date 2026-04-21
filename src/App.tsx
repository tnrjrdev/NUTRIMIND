import { AppRoutes } from "./routes";
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: '!rounded-2xl !border !border-slate-200 !bg-white !text-slate-600 !shadow-lg',
          success: {
            iconTheme: { primary: '#b89a1c', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }} 
      />
      <AppRoutes />
    </>
  );
}