

import React, { useState, useEffect } from 'react';
import { ActiveView, User } from '../types';
import { Button } from './ui/Button';

// --- Icons ---
const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h2.64m-13.5 0H2.36m13.5 0H9.75M12 12.75c0 .414-.168.75-.375.75S11.25 13.164 11.25 12.75s.168-.75.375-.75.375.336.375.75zM12 12.75V9M9.75 21v-7.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21m0 0h13.5M12 12.75c0 .414.168.75.375.75s.375-.336.375-.75q0-.092-.013-.181M12 3c-.815 0-1.603.06-2.368.173M12 3c.815 0 1.603.06 2.368.173m0 0A3.752 3.752 0 0118 5.25v9.75A3.75 3.75 0 0114.25 18.75h-4.5A3.75 3.75 0 016 15V5.25A3.752 3.752 0 019.632 3.173M12 3c-.398 0-.79.018-1.174.052M12 3c.398 0 .79.018 1.174.052" />
  </svg>
);

const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5M12 9.75V4.5m0 15V12m0 0a2.25 2.25 0 00-2.25-2.25M12 12a2.25 2.25 0 002.25-2.25M12 12a2.25 2.25 0 01-2.25 2.25M12 12a2.25 2.25 0 012.25 2.25m0 0h1.5a2.25 2.25 0 002.25-2.25M16.5 12a2.25 2.25 0 00-2.25 2.25m0 0V18m2.25-3.75a2.25 2.25 0 012.25-2.25M16.5 12a2.25 2.25 0 012.25-2.25m0 0H18m-2.25 3.75a2.25 2.25 0 00-2.25 2.25M7.5 12a2.25 2.25 0 002.25 2.25m0 0V18m-2.25-3.75a2.25 2.25 0 01-2.25-2.25M7.5 12a2.25 2.25 0 01-2.25-2.25m0 0H6M9.75 6a2.25 2.25 0 00-2.25-2.25M9.75 6a2.25 2.25 0 012.25-2.25m0 0V3m2.25 3a2.25 2.25 0 002.25-2.25M14.25 6a2.25 2.25 0 01-2.25-2.25m0 0V3" />
  </svg>
);

const BinocularsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
  </svg>
);

const ChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // For System Stats
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5M19.5 8.25h-1.5m-15 3.75h1.5m15 0h1.5m-18 3.75h1.5M19.5 15.75h-1.5M12 19.5V18m0-15V4.5M12.75 6v.008H12.75V6zm-.75 0H12v.008H12V6zm-.75 0H10.5v.008H10.5V6zm-1.5 .75H9v.008H9v-.008zm-.75 0H7.5V6.75H7.5v.008zm-.75 0H6V6.75H6v.008zm.75 1.5H7.5v.008H7.5V8.25zm.75 0H9V8.25H9v.008zm.75 0H10.5v.008H10.5V8.25zm.75 0H12v.008H12V8.25zm.75 0H13.5V8.25h-.008V8.25zm.75 0H15V8.25h-.008V8.25zm.75-1.5h.008v.008h-.008V6.75zm.75 0H16.5v.008H16.5V6.75zm.75 0H18v.008H18V6.75zm-1.5-.75h.008V6h-.008v.008zm-.75 0H15V6h-.008v.008zm-.75 0H13.5V6h-.008v.008zM9.75 15.75H12m3.75 0H12m-3.75 0H9.75m2.25 0V18m0-2.25v-1.5m-3.75 0H6m1.5 0H6m0 0v1.5m0-1.5v-1.5m1.5 1.5H6m3.75 3.75H12m3.75 0H12m-3.75 0H9.75m2.25 0V21m0-2.25v-1.5m-1.5 1.5h.008v.008h-.008V18zm0 0H9m3.75-3.75H12m3.75 0H12m3.75 0h.008v.008h-.008V18zm0 0H15m-3-3.75V12m0 2.25V12m0 0H9.75M12 12H14.25" />
  </svg>
);

const ListBulletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // For Mock Logs
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        <circle cx="4.5" cy="6.375" r="1.125" />
        <circle cx="4.5" cy="12.375" r="1.125" />
        <circle cx="4.5" cy="18.375" r="1.125" />
    </svg>
);


interface AdminDashboardViewProps {
  currentUser: User;
  secureRelayAddress: string | null;
  setActiveView: (view: ActiveView) => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ currentUser, secureRelayAddress, setActiveView }) => {
  const [stats, setStats] = useState({
    activeUplinks: Math.floor(Math.random() * 50) + 10,
    secureTransactions: Math.floor(Math.random() * 1000) + 500,
    systemIntegrity: Math.floor(Math.random() * 31) + 70, // 70-100%
    aiCoreLoad: Math.floor(Math.random() * 61) + 20, // 20-80%
  });

  const [mockLogs, setMockLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        activeUplinks: Math.floor(Math.random() * 50) + 10,
        secureTransactions: stats.secureTransactions + Math.floor(Math.random() * 10) + 1,
        systemIntegrity: Math.floor(Math.random() * 31) + 70,
        aiCoreLoad: Math.floor(Math.random() * 61) + 20,
      });

      const newLogEntry = `[${new Date().toLocaleTimeString()}] SYS_INFO: Routine check nominal. Module ${['Auth', 'DB', 'Net', 'AI'][Math.floor(Math.random()*4)]} status GREEN.`;
      setMockLogs(prevLogs => [newLogEntry, ...prevLogs.slice(0,4)]);

    }, 5000);
    return () => clearInterval(interval);
  }, [stats.secureTransactions]);

  const getIntegrityColor = (integrity: number) => {
    if (integrity >= 90) return 'text-neonGreen-DEFAULT';
    if (integrity >= 75) return 'text-yellow-400';
    return 'text-red-500';
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ReactNode; unit?: string, colorClass?: string }> = ({ title, value, icon, unit, colorClass = "text-neonGreen-light" }) => (
    <div className="bg-neutral-dark p-3 rounded-md shadow-md border border-neutral-medium flex items-center space-x-3 hover:border-neonCyan-DEFAULT transition-colors duration-200">
      {icon && React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {className: `w-6 h-6 ${colorClass}`})}
      <div>
        <p className="text-xs text-neonCyan-light uppercase tracking-wider">{title}</p>
        <p className={`text-xl font-bold ${colorClass}`}>{value}{unit}</p>
      </div>
    </div>
  );

  const NavCard: React.FC<{ title: string; targetView: ActiveView; icon: React.ReactNode, colorClass?: string }> = ({ title, targetView, icon, colorClass="neonMagenta" }) => (
    <Button
        onClick={() => setActiveView(targetView)}
        variant="outline"
        className={`w-full h-full p-4 flex flex-col items-center justify-center text-center border-2 border-${colorClass}-dark hover:border-${colorClass}-DEFAULT bg-neutral-dark hover:bg-neutral-darkest/70 hover:shadow-${colorClass}-glow transition-all duration-200 group`}
    >
        {React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {className: `w-10 h-10 mb-2 text-${colorClass}-DEFAULT group-hover:text-${colorClass}-light transition-colors duration-200`})}
        <span className={`text-sm font-semibold text-${colorClass}-light group-hover:text-white transition-colors duration-200`}>{title}</span>
    </Button>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 font-mono">
      <header className="mb-6 pb-4 border-b-2 border-neutral-dark text-center relative scanline-container overflow-hidden">
        <div className="scanline-overlay opacity-25"></div>
        <DashboardIcon className="w-12 h-12 mx-auto text-neonGreen-DEFAULT mb-2" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neonGreen-DEFAULT tracking-wider">
          ADMINISTRATION CONTROL MATRIX
        </h1>
        <p className="text-sm text-neonCyan-light mt-1">
          Operator: <span className="font-semibold text-white">{currentUser.username}</span> | Secure Relay: <code className="text-neonGreen-light bg-neutral-darkest px-1 rounded-sm">{secureRelayAddress || "N/A"}</code>
        </p>
      </header>

      {/* System Statistics */}
      <section className="mb-8 p-4 bg-neutral-darker rounded-md border border-neutral-dark shadow-xl">
        <h2 className="text-xl font-semibold text-neonCyan-DEFAULT mb-3 flex items-center">
          <ChipIcon className="w-6 h-6 mr-2" /> Real-Time System Vitals (Simulated)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Uplinks" value={stats.activeUplinks} colorClass={getIntegrityColor(100)}/>
          <StatCard title="Secure Transactions" value={stats.secureTransactions.toLocaleString()} colorClass={getIntegrityColor(100)}/>
          <StatCard title="System Integrity" value={stats.systemIntegrity} unit="%" colorClass={getIntegrityColor(stats.systemIntegrity)}/>
          <div className="bg-neutral-dark p-3 rounded-md shadow-md border border-neutral-medium">
            <p className="text-xs text-neonCyan-light uppercase tracking-wider">AI Core Load</p>
            <div className="w-full bg-neutral-medium h-4 rounded-sm mt-1 overflow-hidden border border-neutral-dark">
              <div 
                className="bg-neonGreen-DEFAULT h-full transition-all duration-500 ease-out" 
                style={{ width: `${stats.aiCoreLoad}%` }}
                title={`${stats.aiCoreLoad}%`}
              ></div>
            </div>
            <p className="text-xl font-bold text-neonGreen-light mt-0.5">{stats.aiCoreLoad}%</p>
          </div>
        </div>
      </section>

      {/* Navigation Grid */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-neonCyan-DEFAULT mb-4">Operational Consoles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <NavCard title="Manage Asset Inventory" targetView="admin_products" icon={<StoreIcon />} colorClass="neonGreen"/>
          <NavCard title="Oversee Cyber Operations" targetView="admin_pentest_orders" icon={<CogIcon />} colorClass="neonCyan"/>
          <NavCard title="Global Threat Intel Feed" targetView="threat_intel_feed" icon={<BinocularsIcon />} colorClass="neonMagenta"/>
        </div>
      </section>
      
      {/* Mock System Diagnostics / Logs */}
      <section className="p-4 bg-neutral-darker rounded-md border border-neutral-dark shadow-xl">
        <h2 className="text-lg font-semibold text-neonCyan-DEFAULT mb-2 flex items-center">
          <ListBulletIcon className="w-5 h-5 mr-2" /> System Diagnostics Log (Live Mock)
        </h2>
        <div className="h-32 bg-neutral-darkest p-2 rounded-sm border border-neutral-medium overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-medium scrollbar-track-neutral-dark text-xs">
          {mockLogs.map((log, index) => (
            <p key={index} className={`whitespace-pre-wrap ${index === 0 ? 'text-neonGreen-light animate-fadeIn' : 'text-neutral-light'}`}>
              {log}
            </p>
          ))}
          {mockLogs.length === 0 && <p className="text-neutral-medium">Initializing log stream...</p>}
        </div>
      </section>

    </div>
  );
};

export default AdminDashboardView;
