const API_BASE_URL = 'http://localhost:8080/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export interface FlightDto {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime?: string;
  arrivalTime?: string;
  status?: string;
}

export async function fetchFlights(): Promise<FlightDto[]> {
  return request<FlightDto[]>('/flights');
}

export interface CreateIncidentPayload {
  type: string;
  location?: string;
  description?: string;
  anonymousReport?: boolean;
}

export interface IncidentDto extends CreateIncidentPayload {
  id: number;
  createdAt: string;
  status?: string;
}

export async function createIncident(payload: CreateIncidentPayload): Promise<IncidentDto> {
  return request<IncidentDto>('/incidents', {
    method: 'POST',
    body: JSON.stringify({
      anonymousReport: true,
      ...payload,
    }),
  });
}

// Admin incidents (back-office)
export async function fetchIncidents(): Promise<IncidentDto[]> {
  return request<IncidentDto[]>('/incidents');
}

export async function updateIncidentStatus(
  id: number,
  status: string,
): Promise<IncidentDto> {
  return request<IncidentDto>(`/incidents/${id}/status?status=${encodeURIComponent(status)}`, {
    method: 'PATCH',
  });
}

export interface CreateBaggageClaimPayload {
  tagNumber: string;
  issueType: string;
  description?: string;
}

export interface BaggageClaimDto extends CreateBaggageClaimPayload {
  id: number;
  status: string;
  createdAt: string;
}

export async function createBaggageClaim(
  payload: CreateBaggageClaimPayload,
): Promise<BaggageClaimDto> {
  return request<BaggageClaimDto>('/baggage-claims', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthUser> {
  return request<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(payload: LoginPayload): Promise<AuthUser> {
  return request<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Admin dashboard stats
export interface AdminDashboardStats {
  totalFlights: number;
  totalIncidents: number;
  totalBaggageClaims: number;
  totalUsers: number;
}

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  return request<AdminDashboardStats>('/admin/dashboard');
}
