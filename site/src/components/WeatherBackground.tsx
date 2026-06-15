/**
 * Full-screen tiled background of thin-line weather and natural event symbols.
 * Positioned absolutely — place inside a position:relative container.
 */
export default function WeatherBackground({ xOffset = 0, yOffset = 0 }: { xOffset?: number; yOffset?: number }) {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="weather-pattern"
          x={xOffset}
          y={yOffset}
          width="670"
          height="670"
          patternUnits="userSpaceOnUse"
        >
          <g transform="scale(1.4)">
          {/* Cloud */}
          <path
            d="M30 100 Q30 76 52 76 Q56 58 76 62 Q90 44 112 54 Q132 44 138 64 Q162 64 162 88 Q162 108 138 108 L52 108 Q30 108 30 100Z"
            stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.5"
          />

          {/* Lightning bolt */}
          <path
            d="M358 18 L334 68 L352 68 L326 118 L370 58 L352 58 L376 18Z"
            stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinejoin="round" opacity="0.5"
          />

          {/* Snowflake */}
          <g stroke="#93c5fd" strokeWidth="1.5" opacity="0.5">
            <line x1="240" y1="200" x2="240" y2="272"/>
            <line x1="204" y1="236" x2="276" y2="236"/>
            <line x1="215" y1="211" x2="265" y2="261"/>
            <line x1="265" y1="211" x2="215" y2="261"/>
            <line x1="240" y1="200" x2="230" y2="210"/>
            <line x1="240" y1="200" x2="250" y2="210"/>
            <line x1="240" y1="272" x2="230" y2="262"/>
            <line x1="240" y1="272" x2="250" y2="262"/>
            <line x1="204" y1="236" x2="214" y2="226"/>
            <line x1="204" y1="236" x2="214" y2="246"/>
            <line x1="276" y1="236" x2="266" y2="226"/>
            <line x1="276" y1="236" x2="266" y2="246"/>
          </g>

          {/* Seismic/earthquake line */}
          <path
            d="M20 370 L70 370 L92 334 L116 406 L136 354 L156 390 L178 370 L228 370"
            stroke="#93c5fd" strokeWidth="1.5" fill="none"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.5"
          />

          {/* Rain drops */}
          <g stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.5">
            <path d="M80 288 Q80 268 94 284 Q108 268 108 288 Q108 306 94 310 Q80 306 80 288Z"/>
            <path d="M116 320 Q116 300 130 316 Q144 300 144 320 Q144 338 130 342 Q116 338 116 320Z"/>
            <path d="M44 326 Q44 306 58 322 Q72 306 72 326 Q72 344 58 348 Q44 344 44 326Z"/>
          </g>

          {/* Wind swirl */}
          <path
            d="M320 190 Q380 164 384 196 Q388 224 352 224 Q316 224 316 200 Q316 172 344 172 Q372 172 376 196"
            stroke="#93c5fd" strokeWidth="1.5" fill="none"
            strokeLinecap="round" opacity="0.5"
          />

          {/* Volcano */}
          <path
            d="M80 468 L120 390 L144 408 L168 380 L200 468Z"
            stroke="#93c5fd" strokeWidth="1.5" fill="none"
            strokeLinejoin="round" opacity="0.5"
          />

          {/* Sun */}
          <g stroke="#93c5fd" strokeWidth="1.5" opacity="0.5">
            <circle cx="410" cy="380" r="28" fill="none"/>
            <line x1="410" y1="340" x2="410" y2="328"/>
            <line x1="438" y1="352" x2="446" y2="344"/>
            <line x1="450" y1="380" x2="462" y2="380"/>
            <line x1="438" y1="408" x2="446" y2="416"/>
            <line x1="410" y1="420" x2="410" y2="432"/>
            <line x1="382" y1="408" x2="374" y2="416"/>
            <line x1="370" y1="380" x2="358" y2="380"/>
            <line x1="382" y1="352" x2="374" y2="344"/>
          </g>

          {/* Wave/tsunami */}
          <path
            d="M258 440 Q286 408 314 440 Q342 472 370 440 Q398 408 426 424"
            stroke="#93c5fd" strokeWidth="1.5" fill="none"
            strokeLinecap="round" opacity="0.5"
          />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#weather-pattern)"/>
    </svg>
  )
}
