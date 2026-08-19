"use client";

/**
 * ClientSections — Client Component wrapper that loads heavy framer-motion sections
 * with ssr:false to prevent the 587KB framer-motion bundle from being included in
 * the server-rendered JS payload, significantly improving mobile Time-to-Interactive.
 *
 * WHY: dynamic() with ssr:false is only allowed inside Client Components in Next.js App Router.
 */

import dynamic from "next/dynamic";

// These components all import framer-motion. By loading them only on the client
// after hydration, we avoid bundling 587KB of framer-motion into the initial page JS.
const VolumeLettersShowcaseLazy = dynamic(
  () => import("@/components/VolumeLettersShowcase"),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-white" /> }
);

const DynamicServicesHubLazy = dynamic(
  () => import("@/components/DynamicServicesHub"),
  { ssr: false, loading: () => <div className="min-h-[500px] bg-slate-50" /> }
);

const SpecializedServicesGridLazy = dynamic(
  () => import("@/components/SpecializedServicesGrid"),
  { ssr: false, loading: () => <div className="min-h-[300px] bg-white" /> }
);

export function VolumeLettersShowcaseClient() {
  return <VolumeLettersShowcaseLazy />;
}

export function DynamicServicesHubClient() {
  return <DynamicServicesHubLazy />;
}

export function SpecializedServicesGridClient() {
  return <SpecializedServicesGridLazy />;
}
