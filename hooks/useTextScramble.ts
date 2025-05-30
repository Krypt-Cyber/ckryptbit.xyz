
import { useState, useEffect, useRef, useCallback } from 'react';

// Characters to use during the scramble animation
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#_";

interface UseTextScrambleOptions {
  play: boolean; // True to start the animation
  speed?: number; // Interval speed for updating characters (ms)
  scrambleDuration?: number; // Total time for the pure scramble effect (ms)
  revealDelay?: number; // Delay before the animation starts for this specific text (ms)
  onAnimationComplete?: () => void; // Callback when animation finishes
}

export const useTextScramble = (
  originalText: string | undefined, // Allow originalText to be undefined
  options: UseTextScrambleOptions
) => {
  const {
    play,
    speed = 50,
    scrambleDuration = 200,
    revealDelay = 0,
    onAnimationComplete,
  } = options;

  // Use a guarded version of originalText internally
  const textToUse = originalText || '';

  // State for the currently displayed text, initialized with the guarded text
  const [displayedText, setDisplayedText] = useState(textToUse);

  // Refs to manage animation frames and timing
  const frameRequestRef = useRef<number>();
  const lastUpdateTimeRef = useRef(0); 
  const scrambleEndTimeRef = useRef<number>(0); // When pure scrambling should end
  const actualRevealStartTimeRef = useRef<number>(0); // When this item's animation actually starts after delay

  // Ref to track if the animation is considered complete
  const completeRef = useRef(!play); // If not playing initially, it's complete

  // Effect to re-initialize or reset when textToUse or play status changes
  useEffect(() => {
    if (!play) {
      setDisplayedText(textToUse); // Reset to current textToUse
      completeRef.current = true;
    } else {
      // When play becomes true for a new text or to replay
      const textForAnimation = textToUse; // Use the guarded text
      const initialPlaceholderToShow = ' '.repeat(textForAnimation.length);
      setDisplayedText(initialPlaceholderToShow); 
      completeRef.current = false;
      lastUpdateTimeRef.current = 0; // Reset time tracking
      
      // Set timeout for revealDelay
      const delayTimer = setTimeout(() => {
        actualRevealStartTimeRef.current = performance.now();
        scrambleEndTimeRef.current = actualRevealStartTimeRef.current + scrambleDuration;
        
        const animate = (currentTime: number) => {
          if (!lastUpdateTimeRef.current) {
            lastUpdateTimeRef.current = currentTime;
          }
          const deltaTime = currentTime - lastUpdateTimeRef.current;

          if (deltaTime >= speed) {
            lastUpdateTimeRef.current = currentTime;
            
            setDisplayedText(prev => {
              if (completeRef.current) return prev;

              let nextText = '';
              let allCharsRevealed = true;

              for (let i = 0; i < textForAnimation.length; i++) {
                // Determine if this character should be revealed
                const charRevealTime = actualRevealStartTimeRef.current + 
                                     ((scrambleDuration + (textForAnimation.length * speed)) / textForAnimation.length) * i;
                                     // Spreads reveal over scramble + "typing" time

                if (currentTime >= charRevealTime) {
                  nextText += textForAnimation[i];
                } else if (currentTime < scrambleEndTimeRef.current && currentTime >= actualRevealStartTimeRef.current) {
                  // Pure scramble phase for characters not yet "timed" for reveal
                  nextText += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                  allCharsRevealed = false;
                } else {
                  // Before scramble ends, or if char is not yet revealed, keep it placeholder or scrambled
                  nextText += prev[i] === textForAnimation[i] ? textForAnimation[i] : (prev[i] || ' ');
                  if (prev[i] !== textForAnimation[i]) allCharsRevealed = false;
                }
              }
              
              if (allCharsRevealed) {
                completeRef.current = true;
                if (onAnimationComplete) {
                  onAnimationComplete();
                }
                return textForAnimation; // Ensure final text is correct
              }
              return nextText;
            });
          }

          if (!completeRef.current) {
            frameRequestRef.current = requestAnimationFrame(animate);
          }
        };
        frameRequestRef.current = requestAnimationFrame(animate); 

      }, revealDelay);

      // Cleanup function for useEffect
      return () => {
        clearTimeout(delayTimer);
        const frameId = frameRequestRef.current;
        if (typeof frameId === "number") { // More explicit check
          cancelAnimationFrame(frameId);
        }
      };
    }
  // Use textToUse in dependency array as it's the derived stable value from originalText.
  // onAnimationComplete should be stable or memoized by the parent.
  }, [play, textToUse, speed, scrambleDuration, revealDelay, onAnimationComplete]); 

  return displayedText;
};