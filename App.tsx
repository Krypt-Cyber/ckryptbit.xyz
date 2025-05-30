

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import LandingPageView from './components/LandingPageView';
import { TechStackConfiguratorView } from './components/TechStackConfiguratorView';
import { ChatView } from './components/ChatView';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { ShopView } from './components/ShopView';
import { CartView } from './components/CartView';
import { AdminProductManagementView } from './components/AdminProductManagementView';
import { TargetInfoModal } from './components/TargetInfoModal';
import { PentestOrdersView } from './components/PentestOrdersView';
import { SecurityReportView } from './components/SecurityReportView';
import { AdminPentestOrdersView } from './components/AdminPentestOrdersView';
import { MyDigitalAssetsView } from './components/MyDigitalAssetsView'; 
import ThreatIntelFeedView from './components/ThreatIntelFeedView';
import { UserProfileView } from './components/UserProfileView';
import AdminDashboardView from './components/AdminDashboardView';
import AnimatedBackground from './components/ui/AnimatedBackground'; 
import { Button } from './components/ui/Button';

import { 
  User, AiProviderId, LocalLlmConfig, HuggingFaceConfig, ActiveView, 
  ChatMessage, AiChatStructuredResponse, FileOperation, ParsedBlueprint, 
  ChatMessageImageData, AiAgentMode, GroundingSource, Product, CartItem, 
  PentestOrder, PentestStatus, PentestTargetInfo, SecurityReport, AcquiredDigitalAsset,
  ThreatIntelEvent
} from './types';
import { 
  AI_PROVIDER_OPTIONS, AI_AGENT_MODES
} from './constants';

import * as api from './services/apiService'; 

const VIEW_TRANSITION_DURATION = 250;
const MAX_THREAT_INTEL_EVENTS = 50;

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [isTransitioningView, setIsTransitioningView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [appError, setAppError] = useState<string | null>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); 
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // AI Config State
  const [selectedAiProvider, setSelectedAiProvider] = useState<AiProviderId>('gemini'); 
  const [localLlmConfig, setLocalLlmConfig] = useState<LocalLlmConfig>({ baseUrl: '', modelName: '' }); 
  const [huggingFaceConfig, setHuggingFaceConfig] = useState<HuggingFaceConfig>({ modelId: '', apiKey: '' }); 

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [pentestOrders, setPentestOrders] = useState<PentestOrder[]>([]);
  const [acquiredDigitalAssets, setAcquiredDigitalAssets] = useState<AcquiredDigitalAsset[]>([]);
  const [threatIntelEvents, setThreatIntelEvents] = useState<ThreatIntelEvent[]>([]);

  // UI/Interaction State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [currentBlueprint, setCurrentBlueprint] = useState<ParsedBlueprint | null>(null);
  const [activePentestOrder, setActivePentestOrder] = useState<PentestOrder | null>(null);
  const [isTargetInfoModalOpen, setIsTargetInfoModalOpen] = useState(false);
  
  const [isSecureRelayActive, setIsSecureRelayActive] = useState<boolean>(() => {
      try { return localStorage.getItem('PROJEKT_CKRYPTBIT_SECURE_RELAY_STATUS_V1') === 'true'; }
      catch(e) { return false; }
  });
  const [secureRelayAddress, setSecureRelayAddress] = useState<string | null>(null);

  // --- Data Fetching and Management ---
  const fetchDataForUser = useCallback(async () => {
    if (!isAuthenticated || !currentUser) return; 
    setIsLoading(true); 
    
    let errorsOccurred = "";
    try {
      // Products are already fetched publicly, only fetch user-specific data here
      const [ordersRes, digitalAssetsRes] = await Promise.all([
        api.apiFetchUserPentestOrders(),
        api.apiFetchUserAcquiredDigitalAssets()
      ]);

      if (ordersRes.success && ordersRes.data) {
        setPentestOrders(ordersRes.data.map(o => ({...o, orderDate: new Date(o.orderDate), report: o.report ? {...o.report, generatedDate: new Date(o.report.generatedDate)} : null })));
      } else {
        errorsOccurred += `Failed to fetch service orders: ${ordersRes.message || 'Unknown error'}\n`;
      }

      if (digitalAssetsRes.success && digitalAssetsRes.data) {
        setAcquiredDigitalAssets(digitalAssetsRes.data.map(a => ({...a, purchaseDate: new Date(a.purchaseDate)})));
      } else {
        errorsOccurred += `Failed to fetch acquired intel: ${digitalAssetsRes.message || 'Unknown error'}\n`;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching user application data.";
      errorsOccurred += errorMessage;
    } finally {
      if (errorsOccurred) setAppError(errorsOccurred);
      setIsLoading(false); // User-specific data loading finished
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      setAppError(null);
      let initialError = "";
      try {
        // Fetch public products first
        const productsRes = await api.apiFetchProducts();
        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data);
        } else {
          initialError += `Failed to load product manifest: ${productsRes.message || 'Unknown error'}\n`;
        }

        const token = api.getAuthToken();
        if (token) {
          // If you had a /me endpoint to fetch user details:
          // const profileRes = await api.fetchUserProfile(); // Assuming such a function exists
          // if (profileRes.success && profileRes.data) {
          //   setCurrentUser(profileRes.data);
          //   setIsAuthenticated(true);
          // } else {
          //   api.removeAuthToken(); // Invalid token
          //   setIsAuthenticated(false);
          //   setCurrentUser(null);
          // }
          // For now, if token exists, we mark as authenticated and expect login to set currentUser
          // This part needs a robust /me or similar endpoint for production.
          // Temporarily, if token exists, assume valid for now and try to fetch user data if currentUser is already set (from previous login)
          // This logic is a bit simplified for now; a proper "check token validity" API call is better.
           const userFromStorageStr = localStorage.getItem('ckryptbit_current_user_v2');
           if (userFromStorageStr) {
               try {
                   const userFromStorage = JSON.parse(userFromStorageStr);
                   setCurrentUser(userFromStorage);
                   setIsAuthenticated(true); // Trust token & stored user for this session
               } catch (e) {
                   console.warn("Failed to parse stored user, clearing token.", e);
                   api.removeAuthToken();
                   localStorage.removeItem('ckryptbit_current_user_v2');
                   setIsAuthenticated(false);
                   setCurrentUser(null);
               }
           } else {
               // Token exists but no user in LS, could mean an old session or incomplete logout.
               // A /me call would be best here. For now, treat as not fully authenticated.
               setIsAuthenticated(false); 
               setCurrentUser(null);
           }

        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        const initErrorMessage = error instanceof Error ? error.message : "An unknown error occurred during app initialization.";
        initialError += initErrorMessage;
      } finally {
        if(initialError) setAppError(initialError);
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []); 

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchDataForUser();
    }
  }, [isAuthenticated, currentUser, fetchDataForUser]);


  useEffect(() => { 
    try { localStorage.setItem('PROJEKT_CKRYPTBIT_SECURE_RELAY_STATUS_V1', isSecureRelayActive.toString()); }
    catch(e) { console.warn("LS Error (Secure Relay):", e)}
    if(!isSecureRelayActive) setSecureRelayAddress(null);
  }, [isSecureRelayActive]);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isAuthenticated) {
      const generateMockEvent = (): ThreatIntelEvent => ({
        id: `event_${Date.now()}_${Math.random().toString(16).slice(2,8)}`, timestamp: new Date(),
        severity: ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random()*5)] as ThreatIntelEvent['severity'],
        source: ['FW_ZETA', 'AUTH_SYS', 'AI_CORE_PROXY', 'NET_SENTINEL_BACKEND'][Math.floor(Math.random()*4)],
        message: `Backend Event Log (Simulated): ${Math.random().toString(36).substring(2, 15)}`
      });
      intervalId = setInterval(() => {
        setThreatIntelEvents(prev => [generateMockEvent(), ...prev.slice(0, MAX_THREAT_INTEL_EVENTS - 1)]);
      }, 6000 + Math.random() * 4000);
      setThreatIntelEvents([generateMockEvent()]);
    } else {
      setThreatIntelEvents([]);
    }
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);
  const handleClearThreatIntelEvents = () => setThreatIntelEvents([]);

  const handleNavigate = useCallback((newView: ActiveView) => {
    if (activeView === newView && !isTransitioningView) return;
    if (newView === 'admin_dashboard' && currentUser?.isAdmin && !isSecureRelayActive) {
      alert("Secure Relay NOT ACTIVE. Admin Dashboard access requires an active Secure Relay connection. Please activate it in your Operator Profile.");
      setIsTransitioningView(true);
      setTimeout(() => { setActiveView('user_profile'); setIsTransitioningView(false); }, VIEW_TRANSITION_DURATION);
      return;
    }
    setIsTransitioningView(true);
    setTimeout(() => { setActiveView(newView); setIsTransitioningView(false); }, VIEW_TRANSITION_DURATION);
  }, [activeView, isTransitioningView, currentUser, isSecureRelayActive]);

  const handleLogin = async (username: string, password?: string): Promise<string | null> => {
    setIsLoading(true);
    setAppError(null); 
    const response = await api.apiLogin({ username, password: password || '' });
    setIsLoading(false);
    if (response.success && response.data?.user && response.data?.token) {
      localStorage.setItem('ckryptbit_current_user_v2', JSON.stringify(response.data.user)); // Store user
      setCurrentUser(response.data.user); 
      setIsAuthenticated(true); 
      alert(`Authentication Protocol Engaged. Welcome Operator ${response.data.user.username}. ${response.data.user.isAdmin ? 'ADMIN CLEARANCE GRANTED. Secure Relay protocol recommended for restricted matrix access.' : 'Standard access to Projekt Ckryptbit systems granted.'}`);
      handleNavigate(response.data.user.isAdmin ? 'admin_dashboard' : 'shop');
      return null;
    }
    return response.message || "Login sequence failed. Check uplink and credentials.";
  };

  const handleRegister = async (username: string, email: string, password?: string): Promise<string | null> => {
    setIsLoading(true);
    setAppError(null);
    const response = await api.apiRegister({ username, email, password: password || '' });
    setIsLoading(false);
    if (response.success && response.data?.user && response.data?.token) {
      localStorage.setItem('ckryptbit_current_user_v2', JSON.stringify(response.data.user)); // Store user
      setCurrentUser(response.data.user); 
      setIsAuthenticated(true); 
      alert(`Operator ID Registered & Uplink Established. Welcome, ${response.data.user.username}. ${response.data.user.isAdmin ? 'ADMIN CLEARANCE GRANTED.' : 'Standard access protocols active.'}`);
      handleNavigate(response.data.user.isAdmin ? 'admin_dashboard' : 'shop');
      return null;
    }
    return response.message || "Operator ID registration failed. System conflict or invalid parameters.";
  };

  const handleLogout = () => {
    api.apiLogout(); 
    localStorage.removeItem('ckryptbit_current_user_v2'); // Clear stored user
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCart([]); 
    setPentestOrders([]); 
    setAcquiredDigitalAssets([]); 
    setIsSecureRelayActive(false); 
    setSecureRelayAddress(null);
    setAppError(null); // Clear app-wide errors on logout
    alert("Logout Sequence Complete. Secure Relay Deactivated. Session data purged from local terminal.");
    handleNavigate('landing');
  };
  
  const handlePurgeLocalUserData = async () => {
    if (window.confirm("CONFIRMATION PROTOCOL: Purge ALL operator-specific data from backend systems and this terminal (carrier, service orders, acquired intel)? This action is permanent and logged centrally.")) {
      setIsLoading(true);
      const response = await api.apiPurgeMyData(); 
      setIsLoading(false);
      if (response.success) {
        setCart([]); setPentestOrders([]); setAcquiredDigitalAssets([]);
        setIsSecureRelayActive(false); setSecureRelayAddress(null);
        alert(response.message || "Operator data successfully purged from backend systems. Local cache cleared.");
        // Re-fetch public data like products
        api.apiFetchProducts().then(productsRes => {
            if (productsRes.success && productsRes.data) setProducts(productsRes.data);
        });
      } else {
        alert(`Data purge failed: ${response.message || 'Unknown backend error.'}`);
      }
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    const response = await api.apiAddProduct(productData);
    if (response.success && response.data) {
      setProducts(prev => [response.data!, ...prev].sort((a,b) => a.name.localeCompare(b.name)));
      alert("New asset registered to global manifest.");
    } else { alert(`Asset registration failed: ${response.message}`); }
  };
  const handleUpdateProduct = async (updatedProduct: Product) => {
    const response = await api.apiUpdateProduct(updatedProduct);
    if (response.success && response.data) {
      setProducts(prev => prev.map(p => p.id === response.data!.id ? response.data! : p).sort((a,b) => a.name.localeCompare(b.name)));
      alert("Asset metadata matrix successfully updated.");
    } else { alert(`Asset update failed: ${response.message}`); }
  };
  const handleDeleteProduct = async (productId: string) => {
    const response = await api.apiDeleteProduct(productId);
    if (response.success) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert("Asset record purged from global manifest.");
    } else { alert(`Asset purge failed: ${response.message}`); }
  };

  const addToCart = (product: Product, quantity = 1) => { 
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.productId === product.id);
        if (existingItem) {
            return prevCart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        }
        return [...prevCart, { ...product, productId: product.id, quantity }];
    });
   };
  const removeFromCart = (productId: string) => { 
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
   };
  const updateCartQuantity = (productId: string, newQuantity: number) => { 
    setCart(prevCart =>
        prevCart.map(item =>
            item.productId === productId
                ? { ...item, quantity: Math.max(0, newQuantity) } 
                : item
        ).filter(item => item.quantity > 0) 
    );
  };
  const getCartItemCount = () => cart.reduce((t, i) => t + i.quantity, 0);
  const getCartTotal = () => cart.reduce((t, i) => t + (i.price * i.quantity), 0);

  const handleConfirmAcquisition = async () => {
    if (!currentUser) { alert("Authentication Anomaly Detected. Re-authenticate."); handleNavigate('login'); return; }
    if (cart.length === 0) { alert("Secure Carrier is empty. No assets for acquisition."); return; }
    
    setIsLoading(true);
    const response = await api.apiProcessCheckout(cart); 
    setIsLoading(false);

    if (response.success && response.data) {
      alert(`Acquisition protocol successful. ${response.data.newOrders?.length || 0} new service dockets. ${response.data.newDigitalAssets?.length || 0} new intel packets acquired. Your IP has been logged for security audit.`);
      setCart([]); 
      
      if (response.data.newOrders && response.data.newOrders.length > 0) {
        setPentestOrders(prev => [...prev, ...response.data!.newOrders.map(o=>({...o, orderDate: new Date(o.orderDate)}))].sort((a,b)=> new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
      }
      if (response.data.newDigitalAssets && response.data.newDigitalAssets.length > 0) {
        setAcquiredDigitalAssets(prev => [...prev, ...response.data!.newDigitalAssets.map(a=>({...a, purchaseDate: new Date(a.purchaseDate)}))].sort((a,b)=>new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()));
      }
      
      const firstServiceRequiringInfo = response.data.newOrders?.find(o => o.status === 'Awaiting Target Info');
      if (firstServiceRequiringInfo) {
        promptForTargetInfo(firstServiceRequiringInfo);
      } else if (response.data.newOrders && response.data.newOrders.length > 0) {
        handleNavigate('pentest_orders');
      } else if (response.data.newDigitalAssets && response.data.newDigitalAssets.length > 0) {
        handleNavigate('my_digital_assets');
      } else {
        handleNavigate('shop');
      }
    } else {
      const acquisitionErrorMessage = response.message || 'Unknown backend error.';
      alert(`Acquisition protocol failed: ${acquisitionErrorMessage}`);
      setAppError(prev => (prev ? prev + "\n" : "") + `Acquisition Error: ${acquisitionErrorMessage}`);
    }
  };

  const promptForTargetInfo = (order: PentestOrder) => { setActivePentestOrder(order); setIsTargetInfoModalOpen(true); };
  
  const startPentestProcessing = async (orderId: string, targetInfo: PentestTargetInfo) => {
    setIsLoading(true);
    const response = await api.apiSubmitPentestTargetInfo(orderId, targetInfo);
    setIsLoading(false);
    setIsTargetInfoModalOpen(false);
    setActivePentestOrder(null);
    if (response.success && response.data) {
      setPentestOrders(prev => prev.map(o => o.id === orderId ? {...response.data!, orderDate: new Date(response.data!.orderDate), report: response.data!.report ? {...response.data!.report, generatedDate: new Date(response.data!.report.generatedDate)} : null} : o));
      alert("Target information submitted. Backend AI core is initiating reconnaissance and analysis protocols.");
    } else {
      const submitTargetErrorMessage = response.message || "Unknown error";
      alert(`Failed to submit target parameters: ${submitTargetErrorMessage}`);
      setAppError(prev => (prev ? prev + "\n" : "") + `Target Info Submission Error: ${submitTargetErrorMessage}`);
    }
  };
  const viewSecurityReport = (order: PentestOrder) => { setActivePentestOrder(order); handleNavigate('security_report'); };
  
  const handleUpdatePentestOrderStatusByAdmin = async (orderId: string, newStatus: PentestStatus, adminNotes?: string) => {
    const response = await api.apiUpdatePentestOrderStatusAdmin(orderId, newStatus, adminNotes);
    if (response.success && response.data) {
      setPentestOrders(prev => prev.map(o => o.id === orderId ? {...response.data!, orderDate: new Date(response.data!.orderDate), report: response.data!.report ? {...response.data!.report, generatedDate: new Date(response.data!.report.generatedDate)} : null} : o));
    } else { alert(`Failed to update order status: ${response.message}`); }
  };
  const handleAdminNotifyCustomer = async (orderId: string) => {
    const response = await api.apiNotifyCustomerAdmin(orderId);
    if (response.success && response.data) {
       setPentestOrders(prev => prev.map(o => o.id === orderId ? {...response.data!, orderDate: new Date(response.data!.orderDate), report: response.data!.report ? {...response.data!.report, generatedDate: new Date(response.data!.report.generatedDate)} : null} : o));
       alert("Operator notification protocol engaged (simulated dispatch).");
    } else { alert(`Failed to dispatch notification: ${response.message}`); }
  };
  const handleAcknowledgeAdminUpdate = (orderId: string) => { 
    setPentestOrders(prevOrders => prevOrders.map(o => (o.id === orderId && o.lastAdminUpdateTimestamp) ? {...o, customerNotifiedOfLastAdminUpdate:true, lastNotificationTimestamp: o.lastAdminUpdateTimestamp} : o));
  };
  const handlePentestReportFeedback = async (orderId: string, rating: number, comment: string) => {
    const response = await api.apiSubmitPentestFeedback(orderId, { rating, comment, timestamp: new Date().toISOString() });
    if (response.success && response.data) {
       setPentestOrders(prev => prev.map(o => o.id === orderId ? {...response.data!, orderDate: new Date(response.data!.orderDate), report: response.data!.report ? {...response.data!.report, generatedDate: new Date(response.data!.report.generatedDate)} : null} : o));
       alert("Feedback logged into system archives.");
    } else { alert(`Failed to submit feedback: ${response.message}`); }
  };

  const getSelectedAiProviderName = () => AI_PROVIDER_OPTIONS.find(p => p.id === selectedAiProvider)?.name || "AI Matrix";
  const getChatWelcomeMessage = useCallback((provName:string, view:ActiveView):ChatMessage => ({id:`sys-intro-${Date.now()}`, sender:'ai', content:`Uplink established with: ${provName} (via Backend Proxy). System Online. Awaiting directives...`, timestamp:new Date(), aiProviderName:provName||"AI Proxy"}),[]);
  const handleClearChatHistory = useCallback(() => { const name=getSelectedAiProviderName(); setChatMessages([getChatWelcomeMessage(name,activeView)]); setChatError(null); setIsChatLoading(false); },[activeView,getSelectedAiProviderName,getChatWelcomeMessage]);
  
  useEffect(()=>{ 
    if(activeView!=='chat'&&activeView!=='architect'&&activeView!=='workspace') return; 
    const name=getSelectedAiProviderName(); 
    setChatMessages(prev=>{
        const welcome=getChatWelcomeMessage(name,activeView); 
        if(prev.length===0 || !prev[prev.length-1].id.startsWith('sys-intro-')) return [welcome];
        if (prev[prev.length-1].content !== welcome.content) return [...prev.slice(0, -1), welcome];
        return prev;
    });
  },[activeView,selectedAiProvider,getSelectedAiProviderName,getChatWelcomeMessage]);

  const handleApplyFileOpsToBlueprint = (fileOps: FileOperation[]) => {
    if(!currentBlueprint) { console.warn("File operations received but no active blueprint."); return; }
    setCurrentBlueprint(prevBP => {
      if(!prevBP) return null; let newFiles=[...prevBP.suggestedFiles];
      fileOps.forEach(op=>{ const idx=newFiles.findIndex(f=>f.name===op.fileName);
        if(op.action==='create'){ if(idx===-1) newFiles.push({name:op.fileName,language:op.language||'plaintext',content:op.content||''}); else newFiles[idx]={...newFiles[idx], content:op.content||newFiles[idx].content, language:op.language||newFiles[idx].language};}
        else if(op.action==='update'){ if(idx!==-1) newFiles[idx]={...newFiles[idx],content:op.content!==undefined?op.content:newFiles[idx].content}; else newFiles.push({name:op.fileName,language:op.language||'plaintext',content:op.content||''});}
        else if(op.action==='delete' && idx!==-1) newFiles.splice(idx,1);
      }); return {...prevBP, suggestedFiles:newFiles};
    });
    alert("Blueprint file structure updated by AI directive.");
  };
  
  const handleSendChatMessage = async (userInput: string, imageData?: ChatMessageImageData | null, agentMode: AiAgentMode = 'default', selectedCode?: string | null) => {
    if (!userInput.trim() && !imageData) return;
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', content: userInput, imageData: imageData || null, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg, { id: `ai-load-${Date.now()}`, sender: 'ai', content: 'Engaging Backend AI Matrix...', timestamp: new Date(), isLoading: true, aiProviderName: getSelectedAiProviderName() }]);
    setIsChatLoading(true); setChatError(null);

    const payload = { userInput, chatHistory: chatMessages.filter(m => !m.isLoading && m.sender === 'user'), imageData, agentMode, selectedCode, selectedAiProvider, localLlmConfig, huggingFaceConfig }; 
    const response = await api.apiSendChatMessage(payload);
    
    if (response.success && response.data) {
      const aiResp = response.data;
      const displayContent = aiResp.message || (aiResp.type === 'fileOperation' ? "File system operation directive received and processed by blueprint." : "No explicit textual response from AI matrix.");
      const aiRespMsg: ChatMessage = { id: `ai-resp-${Date.now()}`, sender: 'ai', content: displayContent, timestamp: new Date(), groundingSources: (aiResp as any).groundingSources || null, aiProviderName: getSelectedAiProviderName() };
      setChatMessages(prev => prev.map(m => m.isLoading ? aiRespMsg : m));
      if (aiResp.type === 'fileOperation' && aiResp.fileOps && currentBlueprint) {
        handleApplyFileOpsToBlueprint(aiResp.fileOps);
      }
    } else {
      const errorMsg = response.message || "Unknown AI Proxy error. Uplink potentially compromised.";
      setChatError(errorMsg);
      const aiErrMsg: ChatMessage = { id: `ai-err-${Date.now()}`, sender: 'ai', content: `BACKEND AI PROXY SYSTEM ALERT: ${errorMsg}`, timestamp: new Date(), aiProviderName: getSelectedAiProviderName() };
      setChatMessages(prev => prev.map(m => m.isLoading ? aiErrMsg : m));
    }
    setIsChatLoading(false);
  };

  useEffect(()=>{ 
    const unauthViews:ActiveView[]=['landing','login','register']; 
    const semiAuthViews:ActiveView[] = ['architect', 'chat'];

    if(!isAuthenticated && !unauthViews.includes(activeView) && !semiAuthViews.includes(activeView)) {
      handleNavigate('landing');
    }
    if(isAuthenticated && (activeView === 'login' || activeView === 'register')) {
        handleNavigate(currentUser?.isAdmin?'admin_dashboard':'shop');
    }
    if(isAuthenticated && activeView === 'landing' && currentUser && !isTransitioningView) {
        handleNavigate(currentUser.isAdmin?'admin_dashboard':'shop');
    }
  },[isAuthenticated, activeView, currentUser, handleNavigate, isTransitioningView]);

  if (isLoading && activeView === 'landing' && !appError) { 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-darkest text-neonGreen-DEFAULT">
        <AnimatedBackground />
        <p>INITIATING CKRYPTBIT CORE SYSTEMS...</p>
      </div>
    );
  }
  
  if (appError) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-darkest text-neonMagenta-DEFAULT p-4">
        <AnimatedBackground />
        <h1 className="text-2xl mb-2 font-bold tracking-wider">// SYSTEM CORE FAULT //</h1>
        <pre className="whitespace-pre-wrap bg-neutral-dark p-3 rounded-md text-sm max-w-xl border border-neonMagenta-dark">{appError}</pre>
        <Button onClick={() => { setAppError(null); handleLogout(); }} variant="danger" className="mt-4">Emergency Session Purge & Logout</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-neutral-light font-mono">
      <AnimatedBackground isTransitioningView={isTransitioningView} />
      <Header activeView={activeView} setActiveView={handleNavigate} isAuthenticated={isAuthenticated} currentUser={currentUser} onLogout={handleLogout} cartItemCount={getCartItemCount()} isSecureRelayActive={isSecureRelayActive}/>
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-6 sm:py-8 w-full">
        {activeView === 'landing' && <LandingPageView setActiveView={handleNavigate} isAuthenticated={isAuthenticated} currentUser={currentUser}/>}
        {activeView === 'architect' && 
          <TechStackConfiguratorView
            selectedAiProvider={selectedAiProvider} 
            setSelectedAiProvider={setSelectedAiProvider}
            localLlmConfig={localLlmConfig} 
            setLocalLlmConfig={setLocalLlmConfig}
            huggingFaceConfig={huggingFaceConfig}
            setHuggingFaceConfig={setHuggingFaceConfig}
            chatMessages={chatMessages} 
            onSendChatMessage={handleSendChatMessage} 
            isChatLoading={isChatLoading}
            chatError={chatError}
            currentChatProviderName={getSelectedAiProviderName()}
            currentBlueprint={currentBlueprint}
            setCurrentBlueprint={setCurrentBlueprint}
            onApplyFileOpsToBlueprint={handleApplyFileOpsToBlueprint}
            onClearChatHistory={handleClearChatHistory}
            onGenerateBlueprint={async (selections) => { 
                setIsChatLoading(true); 
                const response = await api.apiGenerateBlueprint(selections);
                setIsChatLoading(false);
                if (response.success && response.data) {
                    setCurrentBlueprint(response.data);
                } else {
                    const blueprintErrorMessage = response.message || 'Unknown backend AI error.';
                    setChatError(`Blueprint generation failed: ${blueprintErrorMessage}`);
                    alert(`Blueprint generation failed: ${blueprintErrorMessage}`);
                }
            }}
          />
        }
        {activeView === 'chat' && <ChatView messages={chatMessages} onSendMessage={handleSendChatMessage} isLoading={isChatLoading} error={chatError} currentProviderName={getSelectedAiProviderName()} selectedAiProvider={selectedAiProvider} setSelectedAiProvider={setSelectedAiProvider} localLlmConfig={localLlmConfig} setLocalLlmConfig={setLocalLlmConfig} huggingFaceConfig={huggingFaceConfig} setHuggingFaceConfig={setHuggingFaceConfig} onClearChatHistory={handleClearChatHistory}/>}
        {activeView === 'login' && !isAuthenticated && <LoginView onLogin={handleLogin} setActiveView={handleNavigate} />}
        {activeView === 'register' && !isAuthenticated && <RegisterView onRegister={handleRegister} setActiveView={handleNavigate} />}
        
        {isAuthenticated && (
          <>
            {activeView === 'shop' && <ShopView products={products} onAddToCart={addToCart} />}
            {activeView === 'cart' && <CartView cartItems={cart} onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} cartTotal={getCartTotal()} setActiveView={handleNavigate} onConfirmAcquisition={handleConfirmAcquisition}/>}
            
            {currentUser?.isAdmin && isSecureRelayActive && activeView === 'admin_products' && <AdminProductManagementView products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct}/>}
            {currentUser?.isAdmin && isSecureRelayActive && activeView === 'admin_pentest_orders' && <AdminPentestOrdersView orders={pentestOrders} onUpdateStatus={handleUpdatePentestOrderStatusByAdmin} onViewReport={viewSecurityReport} onNotifyCustomer={handleAdminNotifyCustomer}/>}
            {currentUser?.isAdmin && isSecureRelayActive && activeView === 'admin_dashboard' && <AdminDashboardView currentUser={currentUser} secureRelayAddress={secureRelayAddress} setActiveView={handleNavigate}/>}
            
            {currentUser?.isAdmin && !isSecureRelayActive && (activeView === 'admin_products' || activeView === 'admin_pentest_orders' || activeView === 'admin_dashboard') && (
                 <div className="text-center p-10"><h1 className="text-2xl font-bold text-neonMagenta-DEFAULT mb-4">ADMIN MATRIX OFFLINE</h1><p className="text-neutral-light mb-6">Secure Relay Uplink Required for Administrative Console Access. Activate in Operator Profile.</p><Button onClick={()=>handleNavigate('user_profile')} variant="secondary" size="lg" className="shadow-neon-cyan-glow">Access Operator Profile</Button></div>
            )}

            {activeView === 'pentest_orders' && <PentestOrdersView orders={pentestOrders} onViewReport={viewSecurityReport} onProvideTargetInfo={promptForTargetInfo} onAcknowledgeAdminUpdate={handleAcknowledgeAdminUpdate}/>}
            {activeView === 'security_report' && activePentestOrder && <SecurityReportView report={activePentestOrder.report} order={activePentestOrder} onClose={()=>{setActivePentestOrder(null);handleNavigate(currentUser?.isAdmin?'admin_pentest_orders':'pentest_orders');}} onFeedbackSubmit={currentUser?.id===activePentestOrder.userId?handlePentestReportFeedback:undefined}/>}
            {activeView === 'my_digital_assets' && currentUser && <MyDigitalAssetsView acquiredAssets={acquiredDigitalAssets} currentUsername={currentUser.username}/>}
            {activeView === 'threat_intel_feed' && <ThreatIntelFeedView events={threatIntelEvents} onClearEvents={handleClearThreatIntelEvents}/>}
            {activeView === 'user_profile' && currentUser && <UserProfileView currentUser={currentUser} onPurgeLocalData={handlePurgeLocalUserData} setActiveView={handleNavigate} isSecureRelayActive={isSecureRelayActive} setIsSecureRelayActive={setIsSecureRelayActive} secureRelayAddress={secureRelayAddress} setSecureRelayAddress={setSecureRelayAddress}/>}
          </>
        )}
      </main>
      <Footer />
      {isTargetInfoModalOpen && activePentestOrder && <TargetInfoModal isOpen={isTargetInfoModalOpen} onClose={()=>{setIsTargetInfoModalOpen(false);setActivePentestOrder(null);}} onSubmit={(info)=>startPentestProcessing(activePentestOrder.id,info)} productName={activePentestOrder.productName}/>}
    </div>
  );
};
export default App;
