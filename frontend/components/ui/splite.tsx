'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Import from our wrapper that bypasses exports restrictions
const Spline = dynamic(
  () => import('./splite-wrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black/20">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    ),
  }
)

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('SplineScene mounted, scene URL:', scene)
  }, [scene])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center bg-black/20">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <div 
        className={className} 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%', 
          height: '100%',
          zIndex: 0,
          backgroundColor: 'transparent'
        }}
      >
        <Spline scene={scene} />
      </div>
    </Suspense>
  )
}
