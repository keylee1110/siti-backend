export interface Event {
  id: string
  title: string
  summary?: string
  description?: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  startAt: string
  endAt?: string
  coverImage?: string
  gallery?: string[]
  location?: {
    name?: string
    lat?: number
    lng?: number
  }
  createdAt: string
  updatedAt?: string
}

export interface Club {
  id: string
  officialName: string
  shortName?: string
  foundedDate?: string
  founder?: string
  mission?: string
  featuredImages?: string[]
  contactEmail?: string
  contactPhone?: string
  facebookUrl?: string
  website?: string
}

export interface PartnerInquiry {
  id: string
  email: string
  organization?: string
  name?: string
  phone?: string
  message: string
  status: "NEW" | "REVIEWING" | "DONE"
  createdAt: string
}

export interface PaginatedResponse<T> {
  content: T[]
  number: number
  size: number
  totalElements: number
  totalPages: number
}
