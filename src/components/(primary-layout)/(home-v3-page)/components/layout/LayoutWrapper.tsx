'use client';

import ScrollProgress from '../common/ScrollProgress';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      {children}
    </>
  );
}
