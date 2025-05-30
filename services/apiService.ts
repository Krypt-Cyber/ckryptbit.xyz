
import { ApiResponse, User, SelectedTechnologies, ChatMessage, ChatMessageImageData, AiAgentMode, ParsedBlueprint, Product, CartItem, PentestOrder, PentestTargetInfo, PentestStatus, AcquiredDigitalAsset, CustomerFeedback } from '../types';

const API_BASE_URL = '/api'; // Relative path, assumes backend is on same host/port or proxied

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('ckryptbit_session_token_v2');
  } catch (e) {
    console.warn("LocalStorage not available or token access failed.");
    return null;
  }
};

const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem('ckryptbit_session_token_v2', token);
  } catch (e) {
    console.warn("LocalStorage not available or token storage failed.");
  }
};

const removeAuthToken = (): void => {
  try {
    localStorage.removeItem('ckryptbit_session_token_v2');
  } catch (e) {
    console.warn("LocalStorage not available or token removal failed.");
  }
};

async function request<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body: any = null, isProtected: boolean = true): Promise<ApiResponse<T>> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (isProtected) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (endpoint !== '/auth/login' && endpoint !== '/auth/register') { // Don't warn for auth endpoints themselves
      console.warn(`Protected API call to '${endpoint}' without token.`);
      // Could throw an error here or let backend handle 401
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const responseBody = await response.json().catch(() => ({ message: 'Response not JSON or empty' }));

    if (!response.ok) {
      const errorMsg = responseBody.message || `API Error: ${response.status} ${response.statusText}`;
      console.error(`API Error (${response.status}) for ${method} ${endpoint}:`, errorMsg, responseBody);
      return { success: false, message: errorMsg, data: responseBody } as ApiResponse<any>; // Ensure data is passed if present
    }
    // For login/register, responseBody might be the ApiResponse structure itself
    // For other successful calls, responseBody is likely the 'data' part
    if (responseBody.success !== undefined) return responseBody as ApiResponse<T>;
    return { success: true, data: responseBody as T };

  } catch (error) {
    console.error(`Network or parsing error for ${method} ${endpoint}:`, error);
    const message = error instanceof Error ? error.message : 'Network or client-side error';
    return { success: false, message };
  }
}

// --- Authentication ---
export const apiLogin = async (credentials: {username: string, password?: string}): Promise<ApiResponse<{token: string, user: User}>> => {
  const response = await request<{token: string, user: User}>('/auth/login', 'POST', credentials, false);
  if (response.success && response.data?.token) {
    setAuthToken(response.data.token);
  }
  return response;
};
export const apiRegister = async (userData: {username: string, email: string, password?: string}): Promise<ApiResponse<{token: string, user: User}>> => {
  const response = await request<{token: string, user: User}>('/auth/register', 'POST', userData, false);
   if (response.success && response.data?.token) {
    setAuthToken(response.data.token); // Auto-login on register
  }
  return response;
};
export const apiLogout = () => { removeAuthToken(); /* Backend session invalidation might happen via token expiry or a /logout call */ };

// --- Products ---
export const apiFetchProducts = (): Promise<ApiResponse<Product[]>> => request<Product[]>('/products', 'GET', null, false);
export const apiAddProduct = (productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => request<Product>('/products', 'POST', productData);
export const apiUpdateProduct = (productData: Product): Promise<ApiResponse<Product>> => request<Product>(`/products/${productData.id}`, 'PUT', productData);
export const apiDeleteProduct = (productId: string): Promise<ApiResponse<null>> => request<null>(`/products/${productId}`, 'DELETE');

// --- Cart & Checkout ---
export const apiProcessCheckout = (cartItems: CartItem[]): Promise<ApiResponse<{ newOrders: PentestOrder[], newDigitalAssets: AcquiredDigitalAsset[] }>> => 
  request('/checkout', 'POST', { cartItems });


// --- Pentest Orders ---
export const apiFetchUserPentestOrders = (): Promise<ApiResponse<PentestOrder[]>> => request('/orders/my-orders', 'GET');
export const apiFetchAllPentestOrdersAdmin = (): Promise<ApiResponse<PentestOrder[]>> => request('/orders/admin/all', 'GET');
export const apiSubmitPentestTargetInfo = (orderId: string, targetInfo: PentestTargetInfo): Promise<ApiResponse<PentestOrder>> => 
  request(`/orders/${orderId}/target-info`, 'PUT', targetInfo);
export const apiUpdatePentestOrderStatusAdmin = (orderId: string, status: PentestStatus, adminNotes?: string): Promise<ApiResponse<PentestOrder>> =>
  request(`/orders/admin/${orderId}/status`, 'PUT', { status, adminNotes });
export const apiNotifyCustomerAdmin = (orderId: string): Promise<ApiResponse<PentestOrder>> => 
  request(`/orders/admin/${orderId}/notify`, 'POST');
export const apiSubmitPentestFeedback = (orderId: string, feedback: CustomerFeedback): Promise<ApiResponse<PentestOrder>> =>
  request(`/orders/${orderId}/feedback`, 'POST', feedback);


// --- Digital Assets ---
export const apiFetchUserAcquiredDigitalAssets = (): Promise<ApiResponse<AcquiredDigitalAsset[]>> => request('/digital-assets/my-assets', 'GET');
// Note: Digital asset content generation is part of checkout on backend.

// --- AI Proxy ---
export const apiGenerateBlueprint = (selections: SelectedTechnologies): Promise<ApiResponse<ParsedBlueprint>> => 
  request<ParsedBlueprint>('/ai/generate-blueprint', 'POST', { selections });

export const apiSendChatMessage = (payload: {
  userInput: string;
  chatHistory: ChatMessage[]; // Send relevant history
  imageData?: ChatMessageImageData | null;
  agentMode: AiAgentMode;
  selectedCode?: string | null;
  selectedAiProvider: AiProviderId; // To inform backend which system prompt variant or internal logic to use
  localLlmConfig?: LocalLlmConfig;   // If backend needs to dynamically target different local LLMs (less common for proxy)
  huggingFaceConfig?: HuggingFaceConfig; // Same as above
}): Promise<ApiResponse<AiChatStructuredResponse>> => 
  request<AiChatStructuredResponse>('/ai/chat', 'POST', payload);


// --- User Profile ---
export const apiPurgeMyData = (): Promise<ApiResponse<{message:string}>> => request('/user/purge-my-data', 'POST');


export { getAuthToken, setAuthToken, removeAuthToken }; // Export for direct use if needed
