import type {
  Event,
  PaginatedResponse,
  Club,
  PartnerInquiry,
} from "@/lib/types"



export interface ApiResponse<T> {
  data: T | null
  error: {
    type: string
    message: string
    status?: number
  } | null
  meta: any | null
}

export interface AuthState {
  email: string
  role: string
  csrfToken: string
}

let authState: AuthState | null = null

export function setAuthState(state: AuthState | null) {
  authState = state
}

export function getAuthState() {
  return authState
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { requiresAuth?: boolean } = {},
): Promise<ApiResponse<T>> {
  const { requiresAuth = false, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  // Add CSRF token for admin endpoints
  if (requiresAuth && authState?.csrfToken) {
    headers.set("X-CSRF-Token", authState.csrfToken)
  }

  const isServer = typeof window === "undefined"
  // On the server, use the internal API URL. On the client, use the public one.
  const baseUrl = isServer
    ? process.env.INTERNAL_API_URL
    : process.env.NEXT_PUBLIC_API_URL || ""

  const finalUrl = `${baseUrl}${endpoint}`

  const response = await fetch(finalUrl, {
    ...fetchOptions,
    headers,
    credentials: "include",
  })

  const data: ApiResponse<T> = await response.json()
  return data
}

export async function login(email: string, password: string) {
  const response = await apiCall<{
    message: string
    csrf: string
    email: string
    role: string
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  if (response.error) {
    throw new Error(response.error.message)
  }

  if (response.data) {
    setAuthState({
      email: response.data.email,
      role: response.data.role,
      csrfToken: response.data.csrf,
    })
  }

  return response.data
}

export async function logout() {
  await apiCall("/api/auth/logout", {
    method: "POST",
    requiresAuth: true,
  })
  setAuthState(null)
}

export async function getMe() {
  const response = await apiCall<{
    email: string
    role: string
    csrf: string
  }>("/api/auth/me", {
    method: "GET",
  })

  if (response.error) {
    setAuthState(null)
    return null
  }

  if (response.data) {
    setAuthState({
      email: response.data.email,
      role: response.data.role,
      csrfToken: response.data.csrf,
    })
  }
  return response.data
}

export async function getClubInfo() {
  return apiCall<Club>("/api/club")
}

export async function getPublishedEvents(page = 0, size = 10) {
  return apiCall<PaginatedResponse<Event>>(`/api/events?status=PUBLISHED&page=${page}&size=${size}`)
}

export async function getEventById(id: string) {
  return apiCall<Event>(`/api/events/${id}`)
}

export async function searchEvents(query: string, page = 0, size = 10) {
  return apiCall<PaginatedResponse<Event>>(`/api/events/search?query=${query}&page=${page}&size=${size}`)
}

export async function submitPartnerInquiry(data: {
  orgName: string
  contactEmail: string
  message: string
}) {
  return apiCall("/api/partner-inquiries", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Admin endpoints
export async function getAllEvents(page = 0, size = 10, status?: string) {
  const statusParam = status ? `&status=${status}` : ""
  return apiCall<PaginatedResponse<Event>>(`/api/admin/events?page=${page}&size=${size}${statusParam}`, {
    requiresAuth: true,
  })
}

export async function createEvent(event: any) {
  return apiCall<Event>("/api/admin/events", {
    method: "POST",
    body: JSON.stringify(event),
    requiresAuth: true,
  })
}

export async function updateEvent(id: string, event: any) {
  return apiCall<Event>(`/api/admin/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(event),
    requiresAuth: true,
  })
}

export async function deleteEvent(id: string) {
  return apiCall(`/api/admin/events/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  })
}

export async function getPartnerInquiries(page = 0, size = 10, status?: string) {
  const statusParam = status ? `&status=${status}` : ""
  return apiCall<PaginatedResponse<PartnerInquiry>>(
    `/api/admin/partner-inquiries?page=${page}&size=${size}${statusParam}`,
    {
      requiresAuth: true,
    },
  )
}

export async function updateInquiryStatus(id: string, status: string) {
  return apiCall(`/api/admin/partner-inquiries/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
    requiresAuth: true,
  })
}

export async function getPresignedUrl(filename: string, contentType: string, directory = "events") {
  return apiCall<{
    url: string
    method: string
    key: string
    publicUrl: string
  }>("/api/admin/uploads/presign", {
    method: "POST",
    body: JSON.stringify({
      filename,
      contentType,
      directory,
      expiresMinutes: 10,
    }),
    requiresAuth: true,
  })
}
