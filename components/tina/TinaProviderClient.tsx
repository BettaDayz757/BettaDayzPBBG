'use client'

import React from 'react'
import { TinaProvider, TinaCMS } from 'tinacms'

// Minimal Tina provider wrapper for Next.js App Router.
// Import and wrap pages/layout where you want Tina edit UI to appear.

export default function TinaProviderClient({ children }: { children: React.ReactNode }) {
  const cms = React.useMemo(() => {
    return new TinaCMS({
      enabled: true,
    })
  }, [])

  return <TinaProvider cms={cms}>{children}</TinaProvider>
}
