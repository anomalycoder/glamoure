import React from 'react';

interface RenderFlourishOptions {
  text: string;
  sansFont: string;
  flourishFont: string;
  flourishScale?: number;
  flourishOffsetY?: number;
  flourishColor?: string;
  isUppercase?: boolean;
}

export function renderFlourishText({
  text,
  sansFont,
  flourishFont,
  flourishScale = 1.35,
  flourishOffsetY = 0,
  flourishColor,
  isUppercase = false,
}: RenderFlourishOptions): React.ReactNode {
  if (!text) return null;

  // Split string by {Letter} or {word}
  const parts = text.split(/(\{[^}]+\})/g);

  return parts.map((part, idx) => {
    if (part.startsWith('{') && part.endsWith('}')) {
      const char = part.slice(1, -1);
      return (
        <span
          key={idx}
          className="inline-block relative select-none"
          style={{
            fontFamily: flourishFont,
            fontSize: `${flourishScale * 100}%`,
            fontWeight: 400,
            textTransform: 'none', // Preserves exact script glyph casing
            fontStyle: 'normal',
            lineHeight: 0.85,
            verticalAlign: 'baseline',
            marginRight: '-0.03em',
            marginLeft: '-0.02em',
            transform: `translateY(${flourishOffsetY}px)`,
            color: flourishColor || 'inherit',
          }}
        >
          {char}
        </span>
      );
    }

    return (
      <span
        key={idx}
        style={{
          fontFamily: sansFont,
          textTransform: isUppercase ? 'uppercase' : undefined,
        }}
      >
        {part}
      </span>
    );
  });
}
