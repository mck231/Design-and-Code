import { useId, useState, type ButtonHTMLAttributes } from 'react'; // Added useState

interface DuckNavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  sizeClass?: string;
}

export default function DuckNavButton({
  sizeClass = 'w-32 h-32', // Button size
  className = '',
  ...buttonProps
}: DuckNavButtonProps) {
  const id = useId();
  const motionPathId = `duckMotionPath-${id}`;
  const waterGradientId = `waterGradient-${id}`;
  const waterEdgeFadeMaskId = `waterEdgeFadeMask-${id}`;
  const leftFadeGradientId = `leftFadeGradient-${id}`;
  const rightFadeGradientId = `rightFadeGradient-${id}`;

  const [isHovered, setIsHovered] = useState(false); // State to track hover

  const waterSurfaceY = 280; // General Y-level for the water surface
  const pathEllipseRy = 30; // Vertical radius of the elliptical path

  const pathTopY = waterSurfaceY - pathEllipseRy; 
  const pathBottomY = waterSurfaceY + pathEllipseRy;

  const pathDefinition = `M300,${pathTopY} a100,${pathEllipseRy} 0 0,0 0,${2 * pathEllipseRy} a100,${pathEllipseRy} 0 0,0 0,-${2 * pathEllipseRy}`;

  const duckPathStartX = 300; 
  const duckPathStartY = pathTopY; 

  const duckBaseScale = 12; // Overall scale for the duck animation group

  const newDuckPathData = "M105.572,101.811c9.889-6.368,27.417-16.464,28.106-42.166c0.536-20.278-9.971-49.506-49.155-50.878 C53.041,7.659,39.9,28.251,36.071,46.739l-0.928-0.126c-1.932,0-3.438,1.28-5.34,2.889c-2.084,1.784-4.683,3.979-7.792,4.308 c-3.573,0.361-8.111-1.206-11.698-2.449c-4.193-1.431-6.624-2.047-8.265-0.759c-1.503,1.163-2.178,3.262-2.028,6.226 c0.331,6.326,4.971,18.917,16.016,25.778c7.67,4.765,16.248,5.482,20.681,5.482c0.006,0,0.006,0,0.006,0 c2.37,0,4.945-0.239,7.388-0.726c2.741,4.218,5.228,7.476,6.037,9.752c2.054,5.851-27.848,25.087-27.848,55.01 c0,29.916,22.013,48.475,56.727,48.475h55.004c30.593,0,70.814-29.908,75.291-92.48C180.781,132.191,167.028,98.15,105.572,101.811 z M18.941,77.945C8.775,71.617,4.992,58.922,5.294,55.525c0.897,0.24,2.194,0.689,3.228,1.042 c4.105,1.415,9.416,3.228,14.068,2.707c4.799-0.499,8.253-3.437,10.778-5.574c0.607-0.509,1.393-1.176,1.872-1.491 c0.87,0.315,0.962,0.693,1.176,3.14c0.196,2.26,0.473,5.37,2.362,9.006c1.437,2.761,3.581,5.705,5.646,8.542 c1.701,2.336,4.278,5.871,4.535,6.404c-0.445,1.184-4.907,3.282-12.229,3.282C30.177,82.591,23.69,80.904,18.941,77.945z M56.86,49.368c0-4.938,4.001-8.943,8.931-8.943c4.941,0,8.942,4.005,8.942,8.943c0,4.931-4.001,8.942-8.942,8.942 C60.854,58.311,56.86,54.299,56.86,49.368z M149.159,155.398l-20.63,11.169l13.408,9.293c0,0-49.854,15.813-72.198-6.885 c-11.006-11.16-13.06-28.533,4.124-38.84c17.184-10.312,84.609,3.943,84.609,3.943L134.295,147.8L149.159,155.398z";
  
  const duckPathInternalScale = 0.1777;
  const duckPathTranslateX = -90; 
  const duckPathTranslateY = -193; 

  const fadeWidth = 150;

  return (
    <button
      {...buttonProps}
      className={`relative overflow-visible ${sizeClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)} // Set hover state true
      onMouseLeave={() => setIsHovered(false)} // Set hover state false
    >
      <svg
        viewBox="0 0 600 400"
        className="w-full h-full"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id={motionPathId}
            d={pathDefinition}
            fill="none"
          />
          <linearGradient id={waterGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" /> 
            <stop offset="100%" stopColor="#2563EB" /> 
          </linearGradient>

          <linearGradient id={leftFadeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="black" /> 
            <stop offset="100%" stopColor="white" /> 
          </linearGradient>
          <linearGradient id={rightFadeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" /> 
            <stop offset="100%" stopColor="black" /> 
          </linearGradient>
          <mask id={waterEdgeFadeMaskId}>
            <rect x="0" y="0" width="600" height="400" fill="white" />
            <rect x="0" y="0" width={fadeWidth} height="400" fill={`url(#${leftFadeGradientId})`} />
            <rect x={600 - fadeWidth} y="0" width={fadeWidth} height="400" fill={`url(#${rightFadeGradientId})`} />
          </mask>
        </defs>

        <g mask={`url(#${waterEdgeFadeMaskId})`}>
          <path
            d={`M0,${waterSurfaceY} Q150,${waterSurfaceY-10} 300,${waterSurfaceY} T600,${waterSurfaceY} L600,400 L0,400 Z`}
            fill={`url(#${waterGradientId})`}
            stroke="none"
          />
          <path
            d={`M0,${waterSurfaceY} Q150,${waterSurfaceY-10} 300,${waterSurfaceY} T600,${waterSurfaceY}`}
            className="stroke-current text-blue-300 opacity-75"
            strokeWidth="6"
            fill="none"
          />
        </g>

        {/* Splash at start - controlled by hover */}
        <g className="fill-current text-blue-400">
          <circle cx={duckPathStartX} cy={duckPathStartY} r="3" opacity="0">
            <animate 
              attributeName="r"    
              from="3" to="20" 
              dur="0.6s" 
              fill="freeze" 
              begin={isHovered ? '0s' : 'indefinite'} // Control animation start
            />
            <animate 
              attributeName="opacity" 
              from="0.8" to="0" 
              dur="0.6s" 
              fill="freeze" 
              begin={isHovered ? '0s' : 'indefinite'} // Control animation start
            />
          </circle>
          <circle cx={duckPathStartX} cy={duckPathStartY} r="2" opacity="0">
            <animate 
              attributeName="r"    
              from="2" to="15"  
              begin={isHovered ? '0.15s' : 'indefinite'} // Control animation start (with original delay if hovered)
              dur="0.5s" 
              fill="freeze" 
            />
            <animate 
              attributeName="opacity" 
              from="0.6" to="0"  
              begin={isHovered ? '0.15s' : 'indefinite'} // Control animation start (with original delay if hovered)
              dur="0.5s" 
              fill="freeze" 
            />
          </circle>
        </g>

        {/* Duck Animation Group */}
        <g className="fill-current text-yellow-400" transform={`scale(${duckBaseScale})`}>
          <g transform={`scale(${duckPathInternalScale}) translate(${duckPathTranslateX}, ${duckPathTranslateY})`}>
            <path 
              d={newDuckPathData} 
              className="stroke-current text-yellow-600" 
              strokeWidth="5" 
            />
            <circle cx="65.7" cy="49.4" r="4.5" className="fill-current text-black" stroke="none" />
            <polygon points="20,80 35,75 35,85" className="fill-current text-orange-600" stroke="none" />
          </g>

          <animateMotion
            dur="8s" 
            repeatCount="indefinite" // Will loop as long as it's "begun"
            rotate="0" 
            calcMode="spline"
            keyTimes="0;0.5;1" 
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" 
            begin={isHovered ? '0s' : 'indefinite'} // Control animation start
          >
            <mpath href={`#${motionPathId}`} />
          </animateMotion>

          <animateTransform
            attributeName="transform"
            type="scale"
            values="0.5;1;0.5" 
            keyTimes="0;0.5;1" 
            dur="8s"
            repeatCount="indefinite" // Will loop
            additive="sum" 
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            begin={isHovered ? '0s' : 'indefinite'} // Control animation start
          />

          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 1; 0 0" 
            keyTimes="0;0.5;1"
            dur="1s" 
            repeatCount="indefinite" // Will loop
            additive="sum"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            begin={isHovered ? '0s' : 'indefinite'} // Control animation start
          />
        </g>
      </svg>
    </button>
  );
}
