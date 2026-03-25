/** Re-export Prisma enums for use in client components */
export type {
  UserStatus,
  PermissionAction,
  ScopeType,
  FlagState,
  FlagLevel,
  ApprovalStatus,
  ExceptionSeverity,
  ExceptionStatus,
  SecurityEventType,
} from "@prisma/client";

/** Pagination response shape (mirrors middleware) */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** API error response shape */
export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

/** Common entity with timestamps */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** Soft-deletable entity */
export interface SoftDeletableEntity extends BaseEntity {
  deletedAt: string | null;
}
