import React from 'react'

type Props = {
  svg?: string
  ariaLabel?: string
}

// Use one of two approaches:
// 1) Pass raw SVG markup as string via the svg prop.
// 2) Import the .svg file as a ReactComponent (SVGR) and then use it directly.

export default function SvgInline({ svg, ariaLabel }: Props) {
  if (!svg) return null
  return (
    <span
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
