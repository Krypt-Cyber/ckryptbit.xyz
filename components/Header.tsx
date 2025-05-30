

import React, { useState } from 'react';
import { ActiveView, User } from '../types';
import { GlitchCoreMenu } from './GlitchCoreMenu'; 
import { Button } from './ui/Button';

const TerminalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const MenuTriggerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" {...props} className={`w-8 h-8 transition-all duration-300 ease-in-out group-hover:rotate-[720deg] group-hover:scale-110 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25zM3.75 12h16.5M3.75 17.25h16.5M3.75 6.75h16.5" />
  </svg>
);

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string; // Explicitly include title for component's props
}

const ShieldCheckIcon: React.FC<CustomIconProps> = ({ title, ...rest }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.8} 
    stroke="currentColor" 
    aria-labelledby={title ? "shield-icon-title" : undefined}
    {...rest} // Spread className and other SVGProps
  >
    {title && <title id="shield-icon-title">{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622A11.99 11.99 0 0020.402 6a11.959 11.959 0 01-3.402-1.286m-6.997 0V2.25L12 2.25m0 0l.283.015M12 2.25a2.25 2.25 0 00-2.25 2.25V9" />
  </svg>
);

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isAuthenticated: boolean;
  currentUser: User | null;
  onLogout: () => void;
  cartItemCount: number;
  isSecureRelayActive: boolean; // New prop
}

export const Header: React.FC<HeaderProps> = ({ 
  activeView, 
  setActiveView, 
  isAuthenticated, 
  currentUser, 
  onLogout, 
  cartItemCount,
  isSecureRelayActive // Destructure new prop
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogoClick = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    setActiveView('landing'); 
  }

  return (
    <>
      <header className="bg-neutral-darkest shadow-md sticky top-0 z-50 border-b-2 border-neutral-dark">
        <div className="container mx-auto px-2 sm:px-4 py-3">
          <div className="flex justify-between items-center">
            <div 
              className="flex items-center cursor-pointer group active:scale-95 transition-transform duration-100 ease-in-out" 
              onClick={handleLogoClick}
              aria-label="Navigate to Home"
            >
              <TerminalIcon className="w-8 h-8 mr-2 text-neonGreen-DEFAULT transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-neonGreen-DEFAULT tracking-wider transition-colors duration-300 group-hover:text-neonGreen-light">
                  <span className="typing-text animate-typing" style={{ animationDuration: '1.8s', animationTimingFunction: 'steps(20,end)'}}>AI CORE INTERFACE</span>
                  <span className="typing-caret"></span>
                </h1>
                <p className="text-center sm:text-left text-neonCyan-light text-xs sm:text-sm transition-colors duration-300 group-hover:text-neonCyan-DEFAULT">
                 <span className="typing-text animate-typingFast" style={{ animationDuration: '2.5s', animationTimingFunction: 'steps(35,end)', animationDelay: '0.3s'}}>Projekt Ckryptbit // GLITCHCORE_NAV_v3.1</span>
                 <span className="typing-caret" style={{animationDelay: '0.3s'}}></span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
                {isAuthenticated && isSecureRelayActive && (
                    <ShieldCheckIcon 
                        className="w-5 h-5 text-neonGreen-DEFAULT animate-pulse" 
                        title="Secure Relay Active (Simulated)"
                    />
                )}
                <Button
                    onClick={toggleMenu}
                    variant="stealth" 
                    className="p-1.5 border-2 border-transparent hover:border-neonGreen-DEFAULT focus:border-neonGreen-DEFAULT group"
                    aria-label="Toggle Navigation Menu"
                    aria-expanded={isMenuOpen}
                >
                    <MenuTriggerIcon className={`text-neonGreen-DEFAULT group-hover:text-neonGreen-light ${isMenuOpen ? 'rotate-90 text-neonMagenta-DEFAULT' : ''}`} />
                </Button>
            </div>
          </div>
        </div>
      </header>
      
      <GlitchCoreMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={onLogout}
        cartItemCount={cartItemCount}
        isSecureRelayActive={isSecureRelayActive} 
      />
    </>
  );
};
