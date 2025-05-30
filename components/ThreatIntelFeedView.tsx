

import React, { useEffect, useRef } from 'react';
import { ThreatIntelEvent, ThreatSeverity } from '../types';
import { Button } from './ui/Button'; // Assuming you might want a clear button later

interface ThreatIntelFeedViewProps {
  events: ThreatIntelEvent[];
  onClearEvents?: () => void; // Optional: if you want a clear log button
}

const getSeverityStyles = (severity: ThreatSeverity): { textColor: string; borderColor: string, icon: string } => {
  switch (severity) {
    case 'CRITICAL':
      return { textColor: 'text-red-400', borderColor: 'border-red-500', icon: '💀' }; // Skull for critical
    case 'HIGH':
      return { textColor: 'text-orange-400', borderColor: 'border-orange-500', icon: '🔥' }; // Fire for high
    case 'MEDIUM':
      return { textColor: 'text-yellow-400', borderColor: 'border-yellow-500', icon: '⚠️' }; // Warning for medium
    case 'LOW':
      return { textColor: 'text-sky-400', borderColor: 'border-sky-500', icon: '🛡️' }; // Shield for low
    case 'INFO':
    default:
      return { textColor: 'text-neonCyan-light', borderColor: 'border-neonCyan-DEFAULT', icon: 'ℹ️' }; // Info icon
  }
};

const ThreatIntelFeedView: React.FC<ThreatIntelFeedViewProps> = ({ events, onClearEvents }) => {
  const feedEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [events]);

  return (
    <div className="h-[calc(100vh-180px)] max-w-5xl mx-auto flex flex-col bg-neutral-darker shadow-2xl rounded-md border-2 border-neutral-dark overflow-hidden font-mono">
      <header className="p-3 sm:p-4 border-b-2 border-neutral-dark flex justify-between items-center bg-neutral-darkest">
        <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neonGreen-DEFAULT tracking-wider">
                <span className="typing-text animate-typing">THREAT INTEL FEED</span>
                <span className="typing-caret"></span>
            </h1>
            <p className="text-xs text-neonCyan-light">// REAL-TIME SYSTEM MONITORING (SIMULATED)</p>
        </div>
        {onClearEvents && (
          <Button onClick={onClearEvents} variant="danger" size="sm">
            PURGE LOGS
          </Button>
        )}
      </header>

      <div className="flex-grow p-3 sm:p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-medium scrollbar-track-neutral-dark bg-neutral-darkest/50">
        {events.length === 0 && (
          <p className="text-center text-neutral-medium py-10">Awaiting threat intelligence data stream... System nominal.</p>
        )}
        {events.map((event) => {
          const { textColor, borderColor, icon } = getSeverityStyles(event.severity);
          return (
            <div
              key={event.id}
              className={`p-2.5 border-l-4 ${borderColor} bg-neutral-dark shadow-md rounded-r-sm animate-fadeIn`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-semibold ${textColor}`}>
                  {icon} [{event.severity}] - {event.source}
                </span>
                <span className="text-xs text-neutral-light">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <p className={`text-sm ${textColor} leading-relaxed`}>{event.message}</p>
              {event.details && Object.keys(event.details).length > 0 && (
                <div className="mt-1 pt-1 border-t border-neutral-medium/30 text-xs">
                  {Object.entries(event.details).map(([key, value]) => (
                    <p key={key} className="text-neutral-light">
                      <span className="text-neonCyan-dark capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={feedEndRef} />
      </div>
      <footer className="p-2 text-center text-xs text-neutral-medium border-t-2 border-neutral-dark bg-neutral-darkest">
        Feed Active. {events.length} transmissions logged. All events are simulated.
      </footer>
    </div>
  );
};

export default ThreatIntelFeedView;
