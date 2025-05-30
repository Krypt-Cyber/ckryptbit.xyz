

import React from 'react';
import { User, ActiveView } from '../types';
import { Button } from './ui/Button';
import { TextInput } from './ui/TextInput'; // For mock preferences if needed

// --- Icons ---
const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Tor/Secure Relay Icon
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622A11.99 11.99 0 0020.402 6a11.959 11.959 0 01-3.402-1.286m-6.997 0V2.25L12 2.25m0 0l.283.015M12 2.25a2.25 2.25 0 00-2.25 2.25V9" />
  </svg>
);

const AdminShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // For Admin Zone
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622A11.99 11.99 0 0020.402 6a11.959 11.959 0 01-3.402-1.286m-6.997-1.286V2.25L12 2.25m0 0l.283.015M12 2.25A2.25 2.25 0 009.75 4.5v1.598M12 9.75A2.25 2.25 0 0114.25 12v0a2.25 2.25 0 01-2.25 2.25H9.75A2.25 2.25 0 017.5 12v0A2.25 2.25 0 019.75 9.75h4.5M12 12.75a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V12a.75.75 0 00.75.75h3z" />
  </svg>
);

interface UserProfileViewProps {
  currentUser: User;
  onPurgeLocalData: () => void;
  setActiveView: (view: ActiveView) => void;
  isSecureRelayActive: boolean;
  setIsSecureRelayActive: (isActive: boolean) => void;
  secureRelayAddress: string | null;
  setSecureRelayAddress: (address: string | null) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  onPurgeLocalData,
  setActiveView,
  isSecureRelayActive,
  setIsSecureRelayActive,
  secureRelayAddress,
  setSecureRelayAddress,
}) => {

  const generateMockOnionAddress = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz234567';
    let result = '';
    for (let i = 0; i < 56; i++) { // v3 onion addresses are 56 chars
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${result}.onion`;
  };

  const handleToggleSecureRelay = () => {
    if (isSecureRelayActive) {
      setIsSecureRelayActive(false);
      setSecureRelayAddress(null);
      alert("Secure Relay Deactivated. Standard routing restored.");
    } else {
      const newAddress = generateMockOnionAddress();
      setSecureRelayAddress(newAddress);
      setIsSecureRelayActive(true);
      alert(`Secure Relay Activated (Simulated). Your temporary secure endpoint: ${newAddress}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-neutral-darker shadow-2xl rounded-md border-2 border-neutral-dark font-mono">
      <header className="mb-6 pb-3 border-b-2 border-neutral-dark text-center">
        <UserCircleIcon className="w-16 h-16 mx-auto text-neonGreen-DEFAULT mb-2" />
        <h1 className="text-2xl sm:text-3xl font-bold text-neonGreen-DEFAULT">
          Operator Profile: <span className="text-neonCyan-light">{currentUser.username}</span>
        </h1>
        <p className="text-xs text-neutral-light">Operator ID: {currentUser.id}</p>
        {currentUser.isAdmin && (
          <p className="text-sm font-semibold text-neonMagenta-DEFAULT mt-1 animate-pulse">ADMIN CLEARANCE LEVEL ACTIVE</p>
        )}
      </header>

      {/* Secure Relay Configuration Section */}
      <section className="mb-6 p-3 bg-neutral-dark rounded-sm border border-neutral-medium shadow-inner relative scanline-container overflow-hidden">
        <div className="scanline-overlay opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-neonCyan-DEFAULT mb-2 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2" /> Secure Relay Configuration (Simulated)
          </h2>
          <p className="text-xs text-neutral-light mb-1">
            Status: <span className={isSecureRelayActive ? "text-neonGreen-DEFAULT font-bold" : "text-neonMagenta-DEFAULT font-bold"}>
              {isSecureRelayActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </p>
          {isSecureRelayActive && secureRelayAddress && (
            <p className="text-xs text-neutral-light mb-2">
              Current Endpoint: <code className="text-neonGreen-light bg-neutral-darkest px-1 rounded-sm break-all">{secureRelayAddress}</code>
            </p>
          )}
          <Button onClick={handleToggleSecureRelay} variant={isSecureRelayActive ? "danger" : "primary"} size="sm">
            {isSecureRelayActive ? "Deactivate Secure Relay" : "Activate Secure Relay"}
          </Button>
           <p className="text-[0.7rem] text-neutral-medium mt-2 italic">
            Note: This is a client-side simulation of a secure Tor-like relay for thematic purposes. No actual network changes occur.
          </p>
        </div>
      </section>

      {/* Admin Zone - Conditional */}
      {currentUser.isAdmin && isSecureRelayActive && (
        <section className="mb-6 p-4 bg-neutral-dark rounded-sm border-2 border-neonMagenta-dark shadow-xl relative scanline-container overflow-hidden">
           <div className="scanline-overlay opacity-20" style={{'--scanline-color': 'rgba(255,0,255,0.1)'} as React.CSSProperties}></div>
           <div className="relative z-10">
            <h2 className="text-xl font-bold text-neonMagenta-DEFAULT mb-2 flex items-center">
                <AdminShieldIcon className="w-6 h-6 mr-2"/> ADMIN ZONE ACCESSIBLE
            </h2>
            <p className="text-sm text-neonMagenta-light mb-1">
                Secure Relay Endpoint: <code className="text-white bg-black/50 px-1.5 py-0.5 rounded-sm break-all">{secureRelayAddress}</code>
            </p>
            <p className="text-xs text-neutral-light mb-3">Relay Integrity: <span className="text-neonGreen-DEFAULT font-semibold">STRONG (SIMULATED)</span></p>
            <div className="space-y-2">
                <Button onClick={() => setActiveView('admin_dashboard')} variant="primary" className="w-full bg-neonMagenta-DEFAULT hover:bg-neonMagenta-light text-black shadow-neon-magenta-glow">
                Access Admin Control Matrix
                </Button>
                 <div className="flex space-x-2 mt-2">
                    <Button onClick={() => setActiveView('admin_products')} variant="outline" size="sm" className="flex-1 border-neonMagenta-DEFAULT text-neonMagenta-light hover:bg-neonMagenta-DEFAULT/20 hover:text-neonMagenta-DEFAULT">
                        Direct: Asset Console
                    </Button>
                    <Button onClick={() => setActiveView('admin_pentest_orders')} variant="outline" size="sm" className="flex-1 border-neonMagenta-DEFAULT text-neonMagenta-light hover:bg-neonMagenta-DEFAULT/20 hover:text-neonMagenta-DEFAULT">
                        Direct: Ops Command
                    </Button>
                </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Mock System Preferences */}
      <section className="mb-6 p-3 bg-neutral-dark rounded-sm border border-neutral-medium">
        <h2 className="text-lg font-semibold text-neonCyan-DEFAULT mb-2">System Preferences (Mock)</h2>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <label htmlFor="tacticalOverlay" className="text-neutral-light">Enable Tactical Overlay:</label>
            <input type="checkbox" id="tacticalOverlay" className="form-checkbox h-4 w-4 text-neonGreen-DEFAULT bg-neutral-darkest border-neutral-medium focus:ring-neonGreen-DEFAULT rounded-sm cursor-not-allowed" disabled />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="aiUplinkStability" className="text-neutral-light">Preferred AI Uplink Stability:</label>
            <select id="aiUplinkStability" className="bg-neutral-darkest border border-neutral-medium text-neonGreen-light text-xs p-1 rounded-sm focus:ring-neonGreen-DEFAULT focus:border-neonGreen-DEFAULT cursor-not-allowed" disabled>
              <option>Max Performance</option>
              <option>Balanced</option>
              <option selected>Max Stability</option>
            </select>
          </div>
        </div>
      </section>

      <section className="p-3 bg-neutral-dark rounded-sm border border-neutral-medium">
        <h2 className="text-lg font-semibold text-neonCyan-DEFAULT mb-2">Data Management</h2>
        <Button
          onClick={onPurgeLocalData}
          variant="danger"
          size="md"
          className="w-full"
        >
          {isSecureRelayActive ? "Purge All Local Data & Relay Config" : "Purge Local Datatracks"}
        </Button>
        <p className="text-xs text-neutral-medium mt-2">
          This will clear your cart, order history, acquired digital assets from this device, and deactivate the secure relay if active. Your login session will remain active.
        </p>
      </section>
    </div>
  );
};
