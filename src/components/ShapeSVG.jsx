// =============================================================================
// ShapeSVG Component - Render various shapes for color fill game
// =============================================================================

import React from 'react';

/**
 * Render an SVG shape
 * @param {Object} props
 * @param {string} props.name - Shape name (circle, star, heart, sun, diamond, balloon, house, flower, leaf, fish)
 * @param {string} props.fill - Fill color
 * @param {number} props.size - Size in pixels
 */
export function ShapeSVG({ name, fill = 'white', size = 140 }) {
  const S = '#333';
  const W = 5;

  // Sun rays
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
    const r = a * Math.PI / 180;
    return [
      75 + 48 * Math.sin(r),
      75 - 48 * Math.cos(r),
      75 + 63 * Math.sin(r),
      75 - 63 * Math.cos(r)
    ];
  });

  // Flower petals
  const petals = [0, 60, 120, 180, 240, 300].map(a => {
    const r = a * Math.PI / 180;
    return {
      cx: 75 + 38 * Math.sin(r),
      cy: 75 - 38 * Math.cos(r),
      a
    };
  });

  const shapes = {
    circle: (
      <circle cx="75" cy="75" r="60" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round" />
    ),
    star: (
      <polygon
        points="75,12 91,52 134,52 100,78 113,120 75,94 37,120 50,78 16,52 59,52"
        fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"
      />
    ),
    heart: (
      <path
        d="M75,115C35,85 18,50 18,38C18,18 37,8 52,14C63,18 75,34 75,34C75,34 87,18 98,14C113,8 132,18 132,38C132,50 115,85 75,115Z"
        fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"
      />
    ),
    sun: (
      <g>
        {rays.map((ray, i) => (
          <line
            key={i}
            x1={ray[0]} y1={ray[1]} x2={ray[2]} y2={ray[3]}
            stroke={S} strokeWidth={W} strokeLinecap="round"
          />
        ))}
        <circle cx="75" cy="75" r="36" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round" />
      </g>
    ),
    diamond: (
      <polygon
        points="75,10 132,75 75,140 18,75"
        fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"
      />
    ),
    balloon: (
      <g>
        <ellipse cx="75" cy="65" rx="42" ry="52" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round" />
        <path
          d="M75,117Q70,132 65,140M65,140Q75,134 85,140"
          stroke={S} strokeWidth={W} fill="none" strokeLinecap="round"
        />
      </g>
    ),
    house: (
      <g>
        <rect x="22" y="72" width="106" height="68" rx="3" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round" />
        <polygon points="75,18 132,72 18,72" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round" />
        <rect x="55" y="102" width="40" height="38" rx="2" fill={fill} stroke={S} strokeWidth={W} />
      </g>
    ),
    flower: (
      <g>
        {petals.map(pt => (
          <ellipse
            key={pt.a}
            cx={pt.cx} cy={pt.cy} rx="16" ry="24"
            transform={`rotate(${pt.a},${pt.cx},${pt.cy})`}
            fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"
          />
        ))}
        <circle cx="75" cy="75" r="22" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round" />
      </g>
    ),
    leaf: (
      <path
        d="M75,20C115,18 130,58 105,98C95,115 85,126 75,132C65,126 55,115 45,98C20,58 35,18 75,20Z"
        fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"
      />
    ),
    fish: (
      <g>
        <ellipse cx="65" cy="75" rx="48" ry="32" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round" />
        <polygon points="113,75 142,46 142,104" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round" />
        <circle cx="42" cy="65" r="7" fill={S} />
      </g>
    )
  };

  return (
    <svg width={size} height={size} viewBox="0 0 150 150" style={{ display: 'block' }}>
      {shapes[name] || shapes.circle}
    </svg>
  );
}
