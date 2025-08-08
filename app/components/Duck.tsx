import { useId, useState, useEffect, useRef, type ButtonHTMLAttributes } from 'react';

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

  // --- Refs for direct control over SVG elements ---
  const svgRef = useRef<SVGSVGElement>(null);
  const motionAnimRef = useRef<SVGAnimateMotionElement>(null);
  const splashAnim1Ref = useRef<SVGAnimateElement>(null);
  const splashOpacityAnim1Ref = useRef<SVGAnimateElement>(null);
  const splashAnim2Ref = useRef<SVGAnimateElement>(null);
  const splashOpacityAnim2Ref = useRef<SVGAnimateElement>(null);

  // --- State and Refs for managing animation logic ---
  const [isHovered, setIsHovered] = useState(false);
  const stopRequested = useRef(false); // Flag to signal that the animation should stop at the end of the lap
  const hasStarted = useRef(false); // Tracks if the main animation has ever started

  // --- Duck Size Controls ---
  // Base size of the duck. Increase this to make the duck bigger overall.
  const DUCK_BASE_SCALE = 0.3;
  // How much the duck shrinks at the farthest point (e.g., 0.5 = 50% of original size).
  const DUCK_SHRINK_FACTOR = 0.7;

  // --- SVG Definitions ---
  const waterSurfaceY = 280;
  const pathEllipseRy = 30;
  // This value lifts the entire duck path. A more negative number moves it higher up.
  const duckVerticalOffset = -100;
  const pathBottomY = waterSurfaceY + pathEllipseRy + duckVerticalOffset; // Closest point - THIS IS THE START
  const pathDefinition = `M300,${pathBottomY} a100,${pathEllipseRy} 0 0,0 0,-${2 * pathEllipseRy} a100,${pathEllipseRy} 0 0,0 0,${2 * pathEllipseRy}`;
  const duckPathStartX = 300;
  const duckPathStartY = pathBottomY;

  // --- Animation Control Logic ---

  // On component mount, immediately pause the animations and set up the event listener.
  useEffect(() => {
    const svgEl = svgRef.current;
    const motionEl = motionAnimRef.current;
    if (!svgEl || !motionEl) return;

    // The handler for when the animation completes a lap.
    const handleLapEnd = () => {
      // If a stop has been requested (because the mouse is not hovering), pause the animation.
      if (stopRequested.current) {
        svgEl.pauseAnimations();
      }
    };

    // Pause the animation on the first frame.
    svgEl.pauseAnimations();
    // Listen for the 'repeatEvent', which fires when the animation loop completes.
    motionEl.addEventListener('repeatEvent', handleLapEnd);

    // Cleanup function to remove the listener when the component unmounts.
    return () => {
      motionEl.removeEventListener('repeatEvent', handleLapEnd);
    };
  }, []);

  // This effect handles the hover logic to play and request a stop.
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    if (isHovered) {
      // If hovering, cancel any pending stop request.
      stopRequested.current = false;
      // Unpause the animations to let the duck swim.
      svgEl.unpauseAnimations();

      // If this is the very first time hovering, trigger the splash effect.
      if (!hasStarted.current) {
        splashAnim1Ref.current?.beginElement();
        splashOpacityAnim1Ref.current?.beginElement();
        splashAnim2Ref.current?.beginElement();
        splashOpacityAnim2Ref.current?.beginElement();
        hasStarted.current = true;
      }
    } else {
      // When hover ends, signal that we want to stop at the end of the next lap.
      // The 'repeatEvent' listener will handle the actual pausing.
      stopRequested.current = true;
    }
  }, [isHovered]);


  return (
    <button
      {...buttonProps}
      className={`relative overflow-visible ${sizeClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Hall of Fame"
    >
      <svg
        ref={svgRef}
        viewBox="0 180 600 220" // Changed viewBox to reduce height
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
            <stop offset="0%" stopColor="#3B82F6" /> {/* blue-500 */}
            <stop offset="100%" stopColor="#1D4ED8" /> {/* blue-700 */}
          </linearGradient>
        </defs>

        {/* --- Continuous Kanagawa-style Waves --- */}
        <g>
          {/* Base water color */}
          <path
            d="M-20,400 L-20,260 C100,280 200,240 300,260 C400,280 500,240 620,260 L620,400 Z"
            fill={`url(#${waterGradientId})`}
          />
          {/* Layer 1: Main wave shape (filled, solid color) */}
          <path
            d="M-20,270 C150,310 50,210 250,260 S 550,240 620,290 L620,400 L-20,400 Z"
            className="fill-current text-blue-500"
          />
          {/* Layer 2: Lighter wave crests (filled, solid color) */}
          <path
            d="M-20,285 C50,275 180,335 300,285 S 450,275 620,285 L620,400 L-20,400 Z"
            className="fill-current text-blue-400"
          />
          {/* Layer 3: Foam detail (filled, solid color) */}
          <path
            d="M-20,295 C 80,290 120,310 200,300 C 280,290 350,315 450,300 C 550,285 620,305 620,305 L620,400 L-20,400 Z"
            className="fill-current text-blue-300"
          />
        </g>

        {/* Splash is now controlled by refs and will only fire once */}
        <g className="fill-current text-blue-400">
          <circle cx={duckPathStartX} cy={duckPathStartY} r="3" opacity="0">
            <animate ref={splashAnim1Ref} attributeName="r" from="3" to="20" dur="0.6s" fill="freeze" begin="indefinite"/>
            <animate ref={splashOpacityAnim1Ref} attributeName="opacity" from="0.8" to="0" dur="0.6s" fill="freeze" begin="indefinite"/>
          </circle>
          <circle cx={duckPathStartX} cy={duckPathStartY} r="2" opacity="0">
            <animate ref={splashAnim2Ref} attributeName="r" from="2" to="15" dur="0.5s" fill="freeze" begin="indefinite" />
            <animate ref={splashOpacityAnim2Ref} attributeName="opacity" from="0.6" to="0" dur="0.5s" fill="freeze" begin="indefinite" />
          </circle>
        </g>

        {/* The duck group's position is now entirely controlled by the animations below. */}
        <g>
          {/* This inner group is for drawing the duck at the correct scale */}
          <g transform={`scale(${DUCK_BASE_SCALE}) translate(-650 -650)`}>
            <path className="fill-current text-orange-400" d="M1118.3,372.3c-28.8-2.4-59.7,1.1-87.7-6.1c-12.1-3.1-23.8-9.9-35.4-16c1.6,45.1-8.9,88-28.9,126.2c49,6.2,113.4-13.2,113.4-13.2C1121.8,459.6,1191,378.1,1118.3,372.3z"/>
            <path className="fill-current text-yellow-400" d="M995.2,350.1c0-0.3,0-0.6,0-0.9C988.8,198.6,848.9,81.1,682.5,86.6C515.9,92.3,386,219,392.3,369.6c3,73.7,38,139.5,92.6,186.8c-123,217.9-418.7-6.6-418.7-6.6c-38.4,266.1-24.5,452.6,215.9,528.1c243.3,76.4,487.4,6.3,487.4,6.3c283.7-58.9,295.8-370.1,130.7-490c-8.4-6.1-16.3-11.9-23.8-17.6c38.2-26.4,69.1-60.7,89.8-100.2C986.3,438.2,996.8,395.2,995.2,350.1z M799.3,913.5c-23.9,33.5-64.3,54.9-104.7,69.2c-87.3,31.1-151.6,38-243.4,22.5c-219.8-37-218.9-254.4-211.3-280.1c70.7,37.8,134.5,26.6,209.8,8.2c64.8-15.7,109-67.1,173.3-82.5C768.6,615.7,892.2,783.9,799.3,913.5z M876,355c-20.8,0.8-38-13.9-38.9-32.5v0c-0.7-18.7,15.4-34.5,36.1-35.2c20.6-0.6,37.9,13.9,38.6,32.6C912.6,338.6,896.5,354.3,876,355z"/>
            <path className="fill-current text-yellow-500" d="M623.1,650.8c-64.3,15.5-108.6,66.8-173.3,82.5c-75.3,18.5-139.2,29.6-209.8-8.2c-7.6,25.6-8.5,243.1,211.3,280.1c91.9,15.5,156.2,8.7,243.4-22.5c40.4-14.3,80.8-35.7,104.7-69.2C892.2,783.9,768.6,615.7,623.1,650.8z"/>
            <path className="fill-current text-black" d="M873.1,287.3c-20.6,0.7-36.8,16.5-36.1,35.2v0c0.9,18.6,18.2,33.2,38.9,32.5c20.5-0.7,36.6-16.4,35.8-35.1C911.1,301.2,893.8,286.7,873.1,287.3z"/>
          </g>

          <animateMotion
            ref={motionAnimRef}
            dur="8s"
            repeatCount="indefinite"
            rotate="0"
            begin="0s" // Start immediately (but will be paused by useEffect)
          >
            <mpath href={`#${motionPathId}`} />
          </animateMotion>

          <animateTransform
            attributeName="transform"
            type="scale"
            values={`1;${DUCK_SHRINK_FACTOR};1`}
            keyTimes="0;0.5;1"
            dur="8s"
            repeatCount="indefinite"
            additive="sum"
            begin="0s" // Start immediately (but will be paused by useEffect)
          />

          {/* Bobbing animation is always active */}
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 2; 0 0"
            keyTimes="0;0.5;1"
            dur="1.5s"
            repeatCount="indefinite"
            additive="sum"
            begin="0s"
          />
        </g>
      </svg>
    </button>
  );
}
