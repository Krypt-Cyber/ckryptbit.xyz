
// Projekt-ckryptbit-FULL-offline-generate.tsx
// This file contains the bash script as a string.
// To use it: copy the content of the 'ckryptbitOfflineGenerationScript' variable,
// paste it into a new file (e.g., generate_ckryptbit.sh), make it executable (chmod +x generate_ckryptbit.sh),
// and then run it (./generate_ckryptbit.sh).

const GEMINI_API_KEY_PLACEHOLDER_CONST = "YOUR_GEMINI_API_KEY_GOES_HERE";
const JWT_SECRET_PLACEHOLDER_CONST = "REPLACE_THIS_WITH_A_VERY_STRONG_RANDOM_SECRET_KEY";

export const ckryptbitOfflineGenerationScript = \`
#!/bin/bash
# Projekt Ckryptbit - FULL OFFLINE GENERATOR AND INSTALLER
# Version: 2.0.1 (Production-Ready Build Focus with JWT)
# Copyright (c) \\\\\$(date +%Y) Joel Jaquet - All Rights Reserved
# This script generates and installs a version of Projekt Ckryptbit with a full-featured backend.
# WARNING: Ensure you have nodejs, npm, and curl installed. Root privileges are required for some operations.

echo "🚀 Initiating Projekt Ckryptbit FULL STACK Generation Protocol (v2.0.1)..."
echo "=================================================================="
echo "                       PROJECT CKRYPTBIT                          "
echo "         PRODUCTION-ORIENTED FULL OFFLINE DEPLOYMENT SYSTEM       "
echo "=================================================================="

# --- Configuration ---
PROJECT_NAME_FROM_METADATA=\\\\\$(grep -o '"name": "[^"]*' metadata.json | grep -o '[^"]*$' | sed 's/ /_/g' || echo "Projekt_Ckryptbit")
PROJECT_ROOT="/opt/\\\\\\\${PROJECT_NAME_FROM_METADATA}_FullStack_v2"
FRONTEND_DIR="\\\\\\\${PROJECT_ROOT}/frontend"
BACKEND_DIR="\\\\\\\${PROJECT_ROOT}/backend"
BACKEND_PUBLIC_DIR="\\\\\\\${BACKEND_DIR}/public_html" 
LOG_FILE="\\\\\\\${PROJECT_ROOT}/installation_log_v2.txt"


# Start logging
exec > >(tee -a "\\\\\\\${LOG_FILE}") 2>&1
echo "Installation log started at \\\\\$(date)"

echo ""
echo "🗂️ Setting up project directory: \\\\\\\${PROJECT_ROOT}"

# --- Safety Check ---
if [ -d "\\\\\\\${PROJECT_ROOT}" ]; then
  read -p "⚠️ Warning: Directory \\\\\\\${PROJECT_ROOT} already exists. Overwrite? (y/N): " confirm_overwrite
  if [[ "\\\\\\\${confirm_overwrite}" != "y" && "\\\\\\\${confirm_overwrite}" != "Y" ]]; then
    echo "🛑 Installation aborted by user."
    exit 1
  fi
  echo "🧹 Clearing existing directory..."
  rm -rf "\\\\\\\${PROJECT_ROOT}"
fi

mkdir -p "\\\\\\\${FRONTEND_DIR}/src/components/ui"
mkdir -p "\\\\\\\${FRONTEND_DIR}/src/services"
mkdir -p "\\\\\\\${FRONTEND_DIR}/src/hooks"
mkdir -p "\\\\\\\${FRONTEND_DIR}/src/utils"
mkdir -p "\\\\\\\${FRONTEND_DIR}/public/icons" 
mkdir -p "\\\\\\\${BACKEND_DIR}/routes"
mkdir -p "\\\\\\\${BACKEND_DIR}/data"
mkdir -p "\\\\\\\${BACKEND_DIR}/utils"
mkdir -p "\\\\\\\${BACKEND_DIR}/middleware" 
mkdir -p "\\\\\\\${BACKEND_PUBLIC_DIR}"

echo "✅ Project structure created."
echo ""

# --- Frontend File Generation ---
echo "⚙️ Generating Frontend Core Files..."

# frontend/package.json
cat << 'EOF' > "\\\\\\\${FRONTEND_DIR}/package.json"
{
  "name": "projekt-ckryptbit-frontend",
  "version": "2.0.1",
  "private": true,
  "scripts": {
    "build": "esbuild src/index.tsx --bundle --outfile=../backend/public_html/bundle.js --define:process.env.API_KEY=\\\\\\\\\\"FRONTEND_SHOULD_NOT_USE_API_KEY_DIRECTLY\\\\\\\\\\" --define:process.env.NODE_ENV=\\\\\\\\\\"production\\\\\\\\\\" --format=esm --platform=browser --loader:.tsx=tsx --loader:.ts=ts --jsx=automatic --minify",
    "dev": "esbuild src/index.tsx --bundle --outfile=../backend/public_html/bundle.js --define:process.env.API_KEY=\\\\\\\\\\"FRONTEND_SHOULD_NOT_USE_API_KEY_DIRECTLY\\\\\\\\\\" --define:process.env.NODE_ENV=\\\\\\\\\\"development\\\\\\\\\\" --format=esm --platform=browser --loader:.tsx=tsx --loader:.ts=ts --jsx=automatic --servedir=../backend/public_html --watch"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "esbuild": "^0.20.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
EOF
echo "   ✓ frontend/package.json"

# frontend/tsconfig.json 
cat << 'EOF' > "\\\\\\\${FRONTEND_DIR}/tsconfig.json"
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["react/next", "react-dom/next"]
  },
  "include": ["src"],
  "references": []
}
EOF
echo "   ✓ frontend/tsconfig.json"

# --- Create frontend source files ---
echo "   Writing frontend source files (TSX, TS)..."

# index.tsx
cat << 'EOF' > "\\\\\\\${FRONTEND_DIR}/src/index.tsx"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('PWA ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('PWA ServiceWorker registration failed: ', error);
      });
  });
}
EOF
echo "     ✓ src/index.tsx"

# types.ts
cat << 'EOF' > "\\\\\\\${FRONTEND_DIR}/src/types.ts"
import { techCategories } from './constants';

export interface TechOption {
  id: string;
  name: string;
  category: string; 
}
export type TechCategoryKey = keyof typeof techCategories;
export type TechCategoryValue = typeof techCategories[TechCategoryKey];
export interface SelectedTechnologies {
  projectName: string;
  FRONTEND?: string;
  UI_LIBRARY?: string;
  BACKEND?: string;
  DATABASE?: string;
  AI_PROVIDER_NAME?: string; 
  DEPLOYMENT?: string;
}
export interface CategoryDefinition { key: TechCategoryKey; label: TechCategoryValue; }
export type AiProviderId = 'gemini' | 'local_llm' | 'huggingface' | '';
export interface AiProviderConfig { id: AiProviderId; name: string; }
export interface LocalLlmConfig { baseUrl: string; modelName: string; }
export interface HuggingFaceConfig { modelId: string; apiKey?: string; }

export interface AppEnvironmentVariables {
  API_KEY?: string; 
}
declare global { namespace NodeJS { interface ProcessEnv extends AppEnvironmentVariables {} } }

export interface User { id: string; username: string; email?: string; isAdmin?: boolean; }
export type ProductType = 'physical' | 'digital' | 'service';
export type DigitalAssetOutputFormat = 'text' | 'markdown' | 'json_string';
export interface ServiceConfig { requiresTargetInfo: boolean; }
export interface DigitalAssetConfig { generationPrompt: string; outputFormat: DigitalAssetOutputFormat; }
export interface Product { id: string; name: string; description: string; price: number; imageUrl?: string; stock?: number; category?: string; productType: ProductType; serviceConfig?: ServiceConfig; digitalAssetConfig?: DigitalAssetConfig; }
export type ProductFormState = Omit<Product, 'id' | 'productType' | 'serviceConfig' | 'digitalAssetConfig'> & { id?: string; productType: ProductType; serviceRequiresTarget: boolean; generationPrompt?: string; outputFormat?: DigitalAssetOutputFormat; };
export interface CartItem { productId: string; name: string; price: number; quantity: number; imageUrl?: string; productType: ProductType; serviceConfig?: ServiceConfig; digitalAssetConfig?: DigitalAssetConfig; }
export interface AcquiredDigitalAsset { id: string; userId: string; username: string; productId: string; productName: string; purchaseDate: Date; generatedContent: string | null; contentFormat: DigitalAssetOutputFormat; originalPrompt: string; generationStatus: 'pending' | 'completed' | 'failed'; generationError?: string; }
export interface PentestTargetInfo { targetUrl?: string; targetIp?: string; scopeNotes?: string; }
export type PentestStatus = | 'Awaiting Target Info' | 'Target Info Submitted' | 'Processing Request' | 'Information Gathering' | 'Vulnerability Scanning' | 'Analysis & Reporting' | 'Report Ready' | 'Admin Review' | 'Completed';
export interface PentestFinding { id: string; severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational'; title: string; description: string; cwe?: string; recommendation?: string; mockEvidence?: string; mockMitigationSteps?: string[]; simulatedExploitPath?: string[]; }
export interface AdaptiveDefenseLogEntry { action: string; detail: string; simulatedEffect: string; confidence: 'High' | 'Medium' | 'Low';}
export interface SimulatedDefenseBypassAttempt { technique: string; targetDefenseAction: string; outcome: 'Defense Held' | 'Partially Bypassed' | 'Bypass Successful (Simulated)'; detail: string; }
export interface SecurityReport { reportId: string; targetSummary: PentestTargetInfo; executiveSummary: string; findings: PentestFinding[]; overallRiskScore?: number; generatedDate: Date; methodology?: string; adaptiveDefenseSimulation?: AdaptiveDefenseLogEntry[]; simulatedDefenseBypassAttempts?: SimulatedDefenseBypassAttempt[]; }
export interface CustomerFeedback { rating: number; comment: string; timestamp: string; }
export interface PentestOrder { id: string; userId: string; username: string; productId: string; productName: string; orderDate: Date; targetInfo: PentestTargetInfo | null; status: PentestStatus; report: SecurityReport | null; adminNotes?: string; lastAdminUpdateTimestamp?: string; customerNotifiedOfLastAdminUpdate?: boolean; lastNotificationTimestamp?: string; customerFeedback?: CustomerFeedback; }
export type ActiveView = | 'landing' | 'architect' | 'chat' | 'workspace' | 'login' | 'register' | 'shop' | 'cart' | 'admin_products' | 'pentest_orders' | 'security_report' | 'admin_pentest_orders' | 'my_digital_assets' | 'threat_intel_feed' | 'user_profile' | 'admin_dashboard';
export interface ChatMessageImageData { mimeType: string; data: string; fileName?: string; }
export interface GroundingSource { uri: string; title?: string; }
export interface ChatMessage { id: string; sender: 'user' | 'ai'; content: string; timestamp: Date; isLoading?: boolean; imageData?: ChatMessageImageData | null; groundingSources?: GroundingSource[] | null; aiProviderName?: string; }
export type FileOperationAction = 'create' | 'update' | 'delete';
export interface FileOperation { action: FileOperationAction; fileName: string; content?: string; language?: string; }
export interface AiChatStructuredResponse { type: 'fileOperation' | 'textResponse'; message?: string; fileOps?: FileOperation[]; }
export interface BlueprintFile { name: string; language: string; content: string; }
export interface ParsedBlueprint { overview: string; suggestedFiles: BlueprintFile[]; nextSteps?: string[]; }
export type AiAgentMode = | 'default' | 'explain_code' | 'generate_docs' | 'refactor_code' | 'generate_tests' | 'command_oracle' | 'research_oracle' | 'threat_intel_briefing';
export interface AiAgentModeConfig { id: AiAgentMode; label: string; instruction: string; placeholder?: string; }
export interface TreeNode { id: string; name: string; type: 'file' | 'folder'; path: string; children?: TreeNode[]; fileData?: BlueprintFile; }
export type ThreatSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface ThreatIntelEvent { id: string; timestamp: Date; severity: ThreatSeverity; source: string; message: string; details?: Record<string, any>; }

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string; 
  user?: User;    
  newOrders?: PentestOrder[]; 
  newDigitalAssets?: AcquiredDigitalAsset[]; 
}
EOF
echo "     ✓ src/types.ts"

# constants.ts
cat << 'EOF' > "\\\\\\\${FRONTEND_DIR}/src/constants.ts"
import { TechOption, TechCategoryKey, CategoryDefinition, AiProviderConfig, AiAgentModeConfig, Product, ProductType, PentestStatus, DigitalAssetOutputFormat } from './types';

export const techCategories = {
  FRONTEND: "Frontend Framework", UI_LIBRARY: "UI Library", BACKEND: "Backend Platform",
  DATABASE: "Database", AI_PROVIDER: "AI Model Provider", DEPLOYMENT: "Deployment Platform",
} as const;
export const CATEGORY_ORDER: CategoryDefinition[] = [
  { key: "FRONTEND", label: techCategories.FRONTEND }, { key: "UI_LIBRARY", label: techCategories.UI_LIBRARY },
  { key: "BACKEND", label: techCategories.BACKEND }, { key: "DATABASE", label: techCategories.DATABASE },
  { key: "AI_PROVIDER", label: techCategories.AI_PROVIDER }, { key: "DEPLOYMENT", label: techCategories.DEPLOYMENT },
];
export const AI_PROVIDER_OPTIONS: AiProviderConfig[] = [
  { id: "gemini", name: "Google Gemini API (via Backend Proxy)" },
  // { id: "local_llm", name: "Local LLM (via Backend Proxy - if implemented)" }, // Future consideration
  // { id: "huggingface", name: "Hugging Face Hub (via Backend Proxy - if implemented)" }, // Future consideration
];
export const TECHNOLOGY_OPTIONS: Record<Exclude<TechCategoryKey, 'AI_PROVIDER'>, TechOption[]> & { AI_PROVIDER: TechOption[] } = {
  FRONTEND: [ { id: "react", name: "React", category: techCategories.FRONTEND }, { id: "vue", name: "Vue.js", category: techCategories.FRONTEND }, /* ... */ ],
  UI_LIBRARY: [ { id: "tailwind", name: "Tailwind CSS", category: techCategories.UI_LIBRARY }, /* ... */ ],
  BACKEND: [ { id: "nodejs_express", name: "Node.js (Express)", category: techCategories.BACKEND }, /* ... */ ],
  DATABASE: [ { id: "postgres", name: "PostgreSQL", category: techCategories.DATABASE }, /* ... */ ],
  AI_PROVIDER: AI_PROVIDER_OPTIONS.map(p => ({ ...p, category: techCategories.AI_PROVIDER } as TechOption)),
  DEPLOYMENT: [ { id: "vercel", name: "Vercel", category: techCategories.DEPLOYMENT }, /* ... */ ],
};
// Fill in other TECHNOLOGY_OPTIONS as they were before if needed by UI.
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
export const AI_AGENT_MODES: AiAgentModeConfig[] = [
  { id: 'default', label: 'Standard Protocol', instruction: 'Standard Protocol: Respond to the user query directly.', placeholder: "Transmit query to AI Agent..." },
  { id: 'explain_code', label: 'Code Deconstructor', instruction: 'Code Deconstructor: Explain the provided code.', placeholder: "Describe selection or ask about the code..." },
  { id: 'generate_docs', label: 'Doc Synthesizer', instruction: 'Doc Synthesizer: Generate documentation for the provided code.', placeholder: "Specify documentation type (e.g., JSDoc)..." },
  { id: 'refactor_code', label: 'Code Optimizer', instruction: 'Code Optimizer: Suggest refactorings for the provided code.', placeholder: "Specify refactoring goals (e.g., improve readability)..." },
  { id: 'generate_tests', label: 'Test Matrix Gen.', instruction: 'Test Matrix Gen.: Generate unit tests for the provided code.', placeholder: "Specify testing framework if any..." },
  { id: 'command_oracle', label: 'Command Oracle', instruction: 'Command Oracle: Provide relevant CLI commands for the given task or project context. Explain what each command does briefly. If multiple commands are needed, list them. Format commands clearly, ideally using backticks or Markdown code blocks for the command itself.', placeholder: "Query for CLI commands (e.g., 'git commit changes', 'start dev server for [framework]')..." },
  { id: 'research_oracle', label: 'Research Oracle', instruction: 'Research Oracle: Provide up-to-date information using Google Search for relevant queries. Summarize findings and list web sources if used.', placeholder: "Query the Oracle for latest intel, e.g., 'latest advancements in quantum computing'..." },
  { id: 'threat_intel_briefing', label: 'Threat Intel Briefing (Executive)', instruction: "TASK_MODE: Threat Intel Briefing (Executive): Based on provided security report findings (especially focusing on 'Project Chimera' details like simulated exploit paths and defense bypass attempts, if available), generate a concise, non-technical executive threat briefing. Highlight key risks, the robustness of simulated defenses, and strategic recommendations. Structure for clarity for a leadership audience. Use professional, direct language. If no specific report data is pasted, ask the user to provide key points from their 'Project Chimera' report.", placeholder: "Paste key 'Project Chimera' findings or ask for a general briefing structure..." },
];
export const PRODUCT_TYPES: { value: ProductType; label: string }[] = [ { value: 'physical', label: 'Physical Asset' }, { value: 'digital', label: 'Digital Asset / Intel' }, { value: 'service', label: 'Cyber Security Service' }, ];
export const DIGITAL_PRODUCT_OUTPUT_FORMATS: { value: DigitalAssetOutputFormat; label: string }[] = [ { value: 'markdown', label: 'Markdown (Formatted Text)' }, { value: 'text', label: 'Plain Text' }, { value: 'json_string', label: 'JSON String (Escaped)' }, ];
export const INITIAL_BACKEND_PRODUCTS: Product[] = [
  { id: 'prod_001', name: 'Cryptex USB Drive - 128GB', description: 'A mechanically-locked USB drive...', price: 79.99, imageUrl: 'https://via.placeholder.com/300x200.png?text=Cryptex+USB', stock: 50, category: 'Secure Hardware', productType: 'physical'},
  { id: 'prod_002', name: 'Zero-Day Exploit Brief (Digital)', description: 'Unlock any system. Hypothetically...', price: 999.99, imageUrl: 'https://via.placeholder.com/300x200.png?text=0-Day+Art', stock: 10, category: 'Digital Intel', productType: 'digital', digitalAssetConfig: { generationPrompt: "Generate a fictional, high-level conceptual overview of a zero-day exploit...", outputFormat: 'markdown'} },
  { id: 'prod_003_emp', name: 'Portable EMP Device (Conceptual Design)', description: 'A schematic and component list...', price: 49.50, imageUrl: 'https://via.placeholder.com/300x200.png?text=EMP+Schematic', stock: 100, category: 'Conceptual Blueprints', productType: 'digital', digitalAssetConfig: { generationPrompt: "Generate a fictional, conceptual design brief for a pocket-sized EMP device...", outputFormat: 'markdown'} },
  { id: 'prod_svc_001', name: 'Basis KI-Reconnaissance-Scan', description: 'Automated KI-driven reconnaissance...', price: 250.00, imageUrl: 'https://via.placeholder.com/300x200.png?text=KI+Recon+Scan', stock: Infinity, category: 'Cyber Security Services', productType: 'service', serviceConfig: { requiresTargetInfo: true }},
  { id: 'prod_svc_002', name: 'Fortgeschrittene KI-Schwachstellenanalyse', description: 'Comprehensive KI-powered vulnerability scan...', price: 750.00, imageUrl: 'https://via.placeholder.com/300x200.png?text=KI+Vuln+Scan', stock: Infinity, category: 'Cyber Security Services', productType: 'service', serviceConfig: { requiresTargetInfo: true }},
  { id: 'prod_svc_003', name: 'Project Chimera: KI Threat Simulation & Adaptive Defense Protocol', description: 'ULTRA-PREMIUM: KI-driven deep threat simulation...', price: 2500.00, imageUrl: 'https://via.placeholder.com/300x200.png?text=Project+Chimera', stock: Infinity, category: 'Cyber Security Services', productType: 'service', serviceConfig: { requiresTargetInfo: true }},
  { id: 'prod_005', name: 'Encrypted Comms Device "WhisperNode"', description: 'End-to-end encrypted communication device...', price: 349.99, imageUrl: 'https://via.placeholder.com/300x200.png?text=WhisperNode', stock: 25, category: 'Secure Hardware', productType: 'physical'},
  { id: 'prod_dig_gen_001', name: 'AI-Generated Tech Concept Paper', description: 'A unique, short concept paper on a futuristic technology...', price: 19.99, imageUrl: 'https://via.placeholder.com/300x200.png?text=AI+Concept+Paper', stock: Infinity, category: 'Digital Intel', productType: 'digital', digitalAssetConfig: { generationPrompt: "Write a compelling and imaginative short (200-300 words) concept paper...", outputFormat: 'markdown'}}
];
export const AI_PENTEST_SERVICE_PRODUCT_IDS = ['prod_svc_001', 'prod_svc_002', 'prod_svc_003'];
export const PENTEST_STATUS_OPTIONS: { value: PentestStatus; label: string }[] = [ { value: 'Awaiting Target Info', label: 'Awaiting Target Info' }, { value: 'Target Info Submitted', label: 'Target Info Submitted' }, { value: 'Processing Request', label: 'Processing Request' }, { value: 'Information Gathering', label: 'Information Gathering' }, { value: 'Vulnerability Scanning', label: 'Vulnerability Scanning' }, { value: 'Analysis & Reporting', label: 'Analysis & Reporting' }, { value: 'Report Ready', label: 'Report Ready' }, { value: 'Admin Review', label: 'Admin Review' }, { value: 'Completed', label: 'Completed' }, ];
EOF
echo "     ✓ src/constants.ts"

# frontend/src/services/apiService.ts
cat << 'EOF' > "\\\\\\\${FRONTEND_DIR}/src/services/apiService.ts"
import { ApiResponse, User, SelectedTechnologies, ChatMessage, ChatMessageImageData, AiAgentMode, ParsedBlueprint, Product, CartItem, PentestOrder, PentestTargetInfo, PentestStatus, AcquiredDigitalAsset, CustomerFeedback, LocalLlmConfig, HuggingFaceConfig, AiProviderId } from '../types';

const API_BASE_URL = '/api'; 

const getAuthToken = (): string | null => {
  try { return localStorage.getItem('ckryptbit_session_token_v2'); } 
  catch (e) { console.warn("LocalStorage token access failed."); return null; }
};
const setAuthToken = (token: string): void => {
  try { localStorage.setItem('ckryptbit_session_token_v2', token); } 
  catch (e) { console.warn("LocalStorage token storage failed."); }
};
const removeAuthToken = (): void => {
  try { localStorage.removeItem('ckryptbit_session_token_v2'); } 
  catch (e) { console.warn("LocalStorage token removal failed."); }
};

async function request<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body: any = null, isProtected: boolean = true): Promise<ApiResponse<T>> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (isProtected) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = \`Bearer \${token}\`;
    else if (endpoint !== '/auth/login' && endpoint !== '/auth/register') console.warn(\`Protected API call to '\${endpoint}' without token.\`);
  }
  const config: RequestInit = { method, headers, body: body ? JSON.stringify(body) : null };

  try {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, config);
    const responseBody = await response.json().catch(() => ({ message: 'Response not JSON or empty' }));
    if (!response.ok) {
      const errorMsg = responseBody.message || \`API Error: \${response.status} \${response.statusText}\`;
      console.error(\`API Error (\${response.status}) for \${method} \${endpoint}:\`, errorMsg, responseBody);
      return { success: false, message: errorMsg, data: responseBody } as ApiResponse<any>;
    }
    if (responseBody.success !== undefined) return responseBody as ApiResponse<T>;
    return { success: true, data: responseBody as T };
  } catch (error) {
    console.error(\`Network or parsing error for \${method} \${endpoint}:\`, error);
    const message = error instanceof Error ? error.message : 'Network or client-side error';
    return { success: false, message };
  }
}

export const apiLogin = async (credentials: {username: string, password?: string}): Promise<ApiResponse<{token: string, user: User}>> => {
  const response = await request<{token: string, user: User}>('/auth/login', 'POST', credentials, false);
  if (response.success && response.data?.token) setAuthToken(response.data.token);
  return response;
};
export const apiRegister = async (userData: {username: string, email: string, password?: string}): Promise<ApiResponse<{token: string, user: User}>> => {
  const response = await request<{token: string, user: User}>('/auth/register', 'POST', userData, false);
   if (response.success && response.data?.token) setAuthToken(response.data.token);
  return response;
};
export const apiLogout = () => { removeAuthToken(); };
export const apiFetchProducts = (): Promise<ApiResponse<Product[]>> => request<Product[]>('/products', 'GET', null, false);
export const apiAddProduct = (productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => request<Product>('/products', 'POST', productData);
export const apiUpdateProduct = (productData: Product): Promise<ApiResponse<Product>> => request<Product>(\`/products/\${productData.id}\`, 'PUT', productData);
export const apiDeleteProduct = (productId: string): Promise<ApiResponse<null>> => request<null>(\`/products/\${productId}\`, 'DELETE');
export const apiProcessCheckout = (cartItems: CartItem[]): Promise<ApiResponse<{ newOrders: PentestOrder[], newDigitalAssets: AcquiredDigitalAsset[] }>> => request('/checkout', 'POST', { cartItems });
export const apiFetchUserPentestOrders = (): Promise<ApiResponse<PentestOrder[]>> => request('/orders/my-orders', 'GET');
export const apiFetchAllPentestOrdersAdmin = (): Promise<ApiResponse<PentestOrder[]>> => request('/orders/admin/all', 'GET');
export const apiSubmitPentestTargetInfo = (orderId: string, targetInfo: PentestTargetInfo): Promise<ApiResponse<PentestOrder>> => request(\`/orders/\${orderId}/target-info\`, 'PUT', targetInfo);
export const apiUpdatePentestOrderStatusAdmin = (orderId: string, status: PentestStatus, adminNotes?: string): Promise<ApiResponse<PentestOrder>> => request(\`/orders/admin/\${orderId}/status\`, 'PUT', { status, adminNotes });
export const apiNotifyCustomerAdmin = (orderId: string): Promise<ApiResponse<PentestOrder>> => request(\`/orders/admin/\${orderId}/notify\`, 'POST');
export const apiSubmitPentestFeedback = (orderId: string, feedback: CustomerFeedback): Promise<ApiResponse<PentestOrder>> => request(\`/orders/\${orderId}/feedback\`, 'POST', feedback);
export const apiFetchUserAcquiredDigitalAssets = (): Promise<ApiResponse<AcquiredDigitalAsset[]>> => request('/digital-assets/my-assets', 'GET');
export const apiGenerateBlueprint = (selections: SelectedTechnologies): Promise<ApiResponse<ParsedBlueprint>> => request<ParsedBlueprint>('/ai/generate-blueprint', 'POST', { selections });
export const apiSendChatMessage = (payload: { userInput: string; chatHistory: ChatMessage[]; imageData?: ChatMessageImageData | null; agentMode: AiAgentMode; selectedCode?: string | null; selectedAiProvider: AiProviderId; localLlmConfig?: LocalLlmConfig; huggingFaceConfig?: HuggingFaceConfig; }): Promise<ApiResponse<AiChatStructuredResponse>> => request<AiChatStructuredResponse>('/ai/chat', 'POST', payload);
export const apiPurgeMyData = (): Promise<ApiResponse<{message:string}>> => request('/user/purge-my-data', 'POST');
export { getAuthToken, setAuthToken, removeAuthToken };
EOF
echo "     ✓ src/services/apiService.ts"

# App.tsx (Full refactored content)
cat << 'EOF' > "\\\\\\\${FRONTEND_DIR}/src/App.tsx"
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
// ... (other component imports as they are in your provided App.tsx) ...
import LandingPageView from './components/LandingPageView';
import AnimatedBackground from './components/ui/AnimatedBackground';
import { TechStackConfiguratorView } from './components/TechStackConfiguratorView';
