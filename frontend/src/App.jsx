import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">H</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">HackathonBase</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Documentation</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">API Reference</a>
            </div>
            <div className="flex items-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-medium transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Build your next big idea with <span className="text-blue-600">precision.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            A minimalist, professional foundation for your hackathon project. 
            Powered by React, Vite, and an Express backend, ready for you to scale.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setCount(c => c + 1)}
              className="px-8 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Interactive Counter: {count}
            </button>
            <a 
              href="#"
              className="px-8 py-3 bg-white text-slate-700 border border-slate-300 font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
            >
              View Repository
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 border border-slate-200 hover:border-blue-300 transition-colors group">
            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3 text-slate-900">Lightning Fast</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Powered by Vite for an incredibly fast development server and optimized production builds. No waiting around.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 border border-slate-200 hover:border-blue-300 transition-colors group">
            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3 text-slate-900">Robust Backend</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Express.js provides a minimal and flexible Node.js web application framework, currently running on port 5001.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 border border-slate-200 hover:border-blue-300 transition-colors group">
            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3 text-slate-900">Modern Styling</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Beautifully designed with Tailwind CSS, emphasizing a clean, crisp white aesthetic with sharp blue highlights.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
