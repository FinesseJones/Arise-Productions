// ==============================================================================
// ARISE PRODUCTION - LAZY LOADED COMPONENTS
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import React, { Suspense, lazy } from 'react';

// Loading component
export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
  </div>
);

// Lazy loaded 3D components (heavy)
export const Scene3D = lazy(() => import('./components/3d/Scene3D'));
export const Interactive3DRoom = lazy(() => import('./components/3d/Interactive3DRoom'));
export const PrevisRoom3D = lazy(() => import('./components/3d/rooms/PrevisRoom3D'));
export const MotionRoom3D = lazy(() => import('./components/3d/rooms/MotionRoom3D'));
export const EditRoom3D = lazy(() => import('./components/3d/rooms/EditRoom3D'));

// Lazy loaded production components
export const Timeline = lazy(() => import('./components/Timeline'));
export const MediaBin = lazy(() => import('./components/MediaBin'));
export const InspectorPanel = lazy(() => import('./components/InspectorPanel'));
export const ToolDetectionPanel = lazy(() => import('./components/ToolDetectionPanel'));
export const RenderingEngineSelector = lazy(() => import('./components/RenderingEngineSelector'));

// Lazy loaded modals
export const ProductionPitchDeckModal = lazy(() => import('./components/ProductionPitchDeckModal'));
export const StudioProUpgradeModal = lazy(() => import('./components/StudioProUpgradeModal'));
export const StudioVideoTourModal = lazy(() => import('./components/StudioVideoTourModal'));

// Wrapper for lazy loaded components with loading state
export const LazyLoadWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

// Usage example:
// <LazyLoadWrapper>
//   <Scene3D />
// </LazyLoadWrapper>
