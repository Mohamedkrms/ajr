import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = createRoot(document.getElementById('root'));

if (!PUBLISHABLE_KEY) {
  root.render(
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>
      <h2 style={{ color: '#ef4444' }}>مفتاح Clerk مفقود (Missing Clerk Publishable Key)</h2>
      <p>الرجاء إضافة <b>VITE_CLERK_PUBLISHABLE_KEY</b> في ملف <code>client/.env</code> حتى يعمل التطبيق.</p>
    </div>
  )
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" localization="ar-SA">
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}
