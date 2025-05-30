
import { ThreatIntelEvent, ThreatSeverity } from '../types';

// This service is now illustrative of the *type* of events the backend might generate or log.
// For a production system, the frontend would fetch these events from a backend API endpoint,
// or receive them via a WebSocket/Server-Sent Events stream if real-time updates are desired.
// The direct generation of these events in the frontend is for simulation purposes only.

const MOCK_SOURCES = ['Backend:Firewall Zeta', 'Backend:AuthGuard Prime', 'Backend:AI Anomaly Detection', 'Backend:Network Intrusion Sensor', 'Backend:DarkNet Monitor', 'Backend:Endpoint Security Core'];
const MOCK_USERNAMES = ['OperatorX', 'ZeroCool', 'AcidBurn', 'PhantomPhreak', 'CypherGhost', 'RootAdminSim', 'SystemInternal'];
const MOCK_IPS = ['192.168.1.101', '10.0.5.23', '203.0.113.45', '172.16.33.99', '8.8.8.8', '1.1.1.1', '127.0.0.1'];
const MOCK_ACTIONS = ['blocked', 'flagged', 'quarantined', 'escalated', 'logged', 'mitigated'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateMockEvent = (): ThreatIntelEvent => {
  const id = `backend_event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = new Date();
  const severityLevels: ThreatSeverity[] = ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const severity = getRandomElement(severityLevels);
  const source = getRandomElement(MOCK_SOURCES);
  let message = '';
  const details: Record<string, any> = {};

  switch (severity) {
    case 'INFO':
      message = `System check nominal for ${source}. Operator ${getRandomElement(MOCK_USERNAMES)} activity normal.`;
      details.last_scan = new Date(Date.now() - Math.random() * 1000000).toISOString();
      details.component_health = "OK";
      break;
    case 'LOW':
      message = `Low-priority alert from ${source}: Unusual outbound traffic pattern to ${getRandomElement(MOCK_IPS)} detected and logged.`;
      details.target_ip = getRandomElement(MOCK_IPS);
      details.port = Math.floor(Math.random() * 1000) + 80;
      details.protocol = ['TCP', 'UDP'][Math.floor(Math.random()*2)];
      break;
    case 'MEDIUM':
      message = `Multiple failed API auth attempts for resource '/admin/config' from IP ${getRandomElement(MOCK_IPS)}. Action: ${getRandomElement(MOCK_ACTIONS)}.`;
      details.username_attempted = getRandomElement(MOCK_USERNAMES);
      details.source_ip = getRandomElement(MOCK_IPS);
      details.attempts = Math.floor(Math.random() * 5) + 3;
      details.resource_targeted = "/api/admin/config";
      break;
    case 'HIGH':
      message = `Potentially malicious API payload detected in request to '/api/orders' by user '${getRandomElement(MOCK_USERNAMES)}'. Request blocked by ${source}.`;
      details.payload_signature = `SQLI_PATTERN_${Math.random().toString(16).substring(2,10).toUpperCase()}`;
      details.user_id = `user_${Math.random().toString(36).substring(2, 9)}`;
      break;
    case 'CRITICAL':
      message = `CRITICAL ALERT: Unauthorized modification attempt on '/data/users.json' by unauthenticated IP ${getRandomElement(MOCK_IPS)}! ${source} has blocked the IP and escalated to admin.`;
      details.attacker_ip = getRandomElement(MOCK_IPS);
      details.accessed_resource = '/data/users.json';
      details.action_taken = "IP_BLOCKED_AND_ALERTED";
      break;
  }

  return { id, timestamp, severity, source, message, details };
};

let eventInterval: ReturnType<typeof setInterval> | null = null; // Use NodeJS.Timeout or number depending on environment

export const startThreatIntelFeed = (callback: (event: ThreatIntelEvent) => void, intervalMs: number = 7000) => {
  // This function is for frontend simulation. In production, frontend would connect to a backend feed.
  console.warn("startThreatIntelFeed is a frontend mock. Real threat intel should be streamed from backend.");
  if (eventInterval) {
    clearInterval(eventInterval);
  }
  // Emit one immediately for demo
  setTimeout(() => callback(generateMockEvent()), 500);
  
  eventInterval = setInterval(() => {
    callback(generateMockEvent());
  }, intervalMs + Math.random() * 3000 - 1500); // Add jitter
};

export const stopThreatIntelFeed = () => {
  if (eventInterval) {
    clearInterval(eventInterval);
    eventInterval = null;
  }
};

// For a production system, the frontend would either poll an API endpoint like GET /api/system-logs
// or establish a WebSocket/SSE connection to a backend feed for real-time updates.
