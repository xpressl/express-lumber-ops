# Express Lumber Ops - Greenfield Build Plan

## Context

Express Lumber Ops is the operational control layer for a wholesale building materials distributor running on a legacy ERP with no API. The current business runs on paper, spreadsheets, texts, and disconnected workflows. This greenfield build creates a unified platform covering dispatch, delivery, yard, receiving, purchasing, pricing, collections, CRM, and management visibility - 12 major modules plus 11 cross-cutting systems.

The PRD (`express_lumber_ops_greenfield_prd_v2.md`) is the source of truth for WHAT to build. `CLAUDE-RULES.md` is the source of truth for HOW to build it. Both must be followed together.

---

## Architecture Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ App Router, React 18, TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui, design tokens via CSS variables |
| Forms | react-hook-form + Zod |
| Real-time | Socket.io |
| Maps | Leaflet + react-leaflet |
| Charts | Recharts |
| Backend | Next.js API routes (REST) |
| Database | PostgreSQL 16 + Prisma ORM |
| Cache/Queues | Redis 7 |
| Auth | NextAuth.js v4 (JWT + RBAC) |
| SMS | Twilio |
| Email | Resend |
| AI | Anthropic Claude (Vision + PDF extraction) |
| File Storage | S3/MinIO |
| PDF | jsPDF, @react-pdf/renderer |
| PWA | Service worker for offline driver app |

### Directory Structure
```
all_2/
  docs/                           # 12 required documentation files
  prisma/
    schema.prisma
    migrations/
    seed.ts
  public/
    sw.js                         # Service worker for driver PWA
    manifest.json
  src/
    app/
      (auth)/                     # Public auth routes
        login/page.tsx
        forgot-password/page.tsx
      (dashboard)/                # Authenticated routes
        layout.tsx                # Sidebar + topbar + search
        command-center/page.tsx
        orders/page.tsx
        dispatch/page.tsx
        ... (all 24 module pages)
      api/                        # API routes
        auth/[...nextauth]/route.ts
        health/route.ts
        users/route.ts
        ... (60+ route files)
      layout.tsx                  # Root layout
      middleware.ts               # Auth redirect middleware
    components/
      ui/                         # shadcn/ui primitives
      shared/                     # Reusable composites (DataTable, Timeline, StatusBadge, etc.)
      forms/                      # Reusable form patterns
      [module]/                   # Module-specific components
    lib/
      prisma.ts                   # Prisma singleton
      redis.ts                    # Redis singleton
      socket.ts                   # Socket.io setup
      auth/                       # NextAuth config + helpers
      services/                   # Business logic (one file per domain)
      validators/                 # Zod schemas (one file per domain)
      middleware/                  # API middleware (auth, rbac, rate-limit, pagination)
      events/                     # Event backbone
      exceptions/                 # Exception engine
      permissions/                # Permission evaluation engine
      approvals/                  # Approval policy engine
      feature-flags/              # Feature flag evaluation
      notifications/              # SMS/email/internal alerts
      ai/                         # Claude AI extraction + vision
      bridge/                     # Import/export engine
      state-machines/             # Order + other state machines
    types/                        # TypeScript types by domain
    hooks/                        # React hooks
    config/                       # App config, constants, enums
```

### Design Aesthetic (Frontend Design Skill)
- **Tone**: Industrial-utilitarian meets modern operations dashboard
- **Theme**: Dark mode primary (for outdoor/warehouse use), light mode option
- **Typography**: Distinctive display font (JetBrains Mono for data, Instrument Sans for UI) - NOT generic fonts
- **Color**: Deep slate/zinc base, sharp orange/amber accents for alerts/exceptions, green for success states, red for holds/blocks
- **Layout**: Dense data tables with generous whitespace in cards, asymmetric dashboard grid
- **Motion**: Staggered card reveals on load, smooth status transitions, Socket.io-driven live updates with subtle pulse animations
- **Differentiator**: Real-time operational pulse - live counters, breathing status dots, exception heat indicators

---

## Phase 0: Foundation Planning (Documentation)

**Goal**: Create all 12 required documentation files before any code.

### Tasks (can ALL run in parallel via subagents)

| # | Task | File | Size | Agent |
|---|------|------|------|-------|
| 0.1 | Create PLAN.md | `docs/PLAN.md` | M | A |
| 0.2 | Create PROGRESS.md | `docs/PROGRESS.md` | S | A |
| 0.3 | Create DECISIONS.md | `docs/DECISIONS.md` | M | A |
| 0.4 | Create DATA-MODEL.md (all entities, fields, relationships, lifecycle) | `docs/DATA-MODEL.md` | L | B |
| 0.5 | Create API-SPECS.md (all route groups, shapes, auth, side effects) | `docs/API-SPECS.md` | L | C |
| 0.6 | Create RISKS.md | `docs/RISKS.md` | M | A |
| 0.7 | Create PERMISSIONS-MATRIX.md (all permissions x roles x scopes) | `docs/PERMISSIONS-MATRIX.md` | L | D |
| 0.8 | Create APPROVAL-POLICIES.md | `docs/APPROVAL-POLICIES.md` | M | D |
| 0.9 | Create EVENT-BACKBONE.md (all event types, producers, consumers) | `docs/EVENT-BACKBONE.md` | M | E |
| 0.10 | Create EXCEPTION-MODEL.md (categories, severity, queues, SLAs) | `docs/EXCEPTION-MODEL.md` | M | E |
| 0.11 | Create ROLLOUT-PLAN.md | `docs/ROLLOUT-PLAN.md` | M | A |
| 0.12 | Create TEST-STRATEGY.md | `docs/TEST-STRATEGY.md` | M | A |

**Parallelism**: 5 subagents (A-E) can produce all 12 docs simultaneously. Agent A handles 5 smaller docs, B handles data model, C handles API specs, D handles permissions+approvals, E handles events+exceptions.

---

## Phase 1: Platform Backbone

**Goal**: Build the infrastructure every module depends on. NO operational module may start before this is complete.

### 1A: Project Scaffolding (sequential - must be first)

| # | Task | Files | Size |
|---|------|-------|------|
| 1A.1 | Initialize Next.js 14+ with App Router, TypeScript strict | `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts` | M |
| 1A.2 | Install all dependencies (prisma, next-auth, socket.io, zod, react-hook-form, shadcn/ui, recharts, leaflet, etc.) | `package.json` | S |
| 1A.3 | Configure Tailwind v4 + design tokens (CSS variables for colors, spacing, typography) | `src/app/globals.css`, `tailwind.config.ts` | M |
| 1A.4 | Install shadcn/ui primitives (Button, Card, Dialog, Table, Tabs, Select, Input, Badge, Toast, Sheet, Command, Popover, Calendar, DropdownMenu, Avatar, Separator, ScrollArea, Checkbox, RadioGroup, Switch, Tooltip, AlertDialog, Form, Label, Textarea) | `src/components/ui/*.tsx` | M |
| 1A.5 | Create Prisma client singleton | `src/lib/prisma.ts` | S |
| 1A.6 | Create Redis client singleton | `src/lib/redis.ts` | S |
| 1A.7 | Create Socket.io server setup | `src/lib/socket.ts` | S |
| 1A.8 | Create root layout with font loading | `src/app/layout.tsx` | S |

### 1B: Database Schema - Platform Core (after 1A)

All of these can be done in ONE Prisma schema file, but logically grouped:

| # | Task | Models | Size |
|---|------|--------|------|
| 1B.1 | User, UserProfile, Location models | 3 models | M |
| 1B.2 | Role, Permission, RolePermission models | 3 models | M |
| 1B.3 | UserRoleAssignment, AccessScope models | 2 models | M |
| 1B.4 | FeatureFlag, FeatureFlagAssignment models | 2 models | M |
| 1B.5 | ApprovalPolicy, ApprovalRequest, ApprovalStep models | 3 models | M |
| 1B.6 | AuditEvent, SecurityEvent models | 2 models | M |
| 1B.7 | Exception model | 1 model | S |
| 1B.8 | BranchSetting, UserPreference models | 2 models | S |
| 1B.9 | Enums (all role types, permission types, scopes, statuses, severity levels) | enums | M |
| 1B.10 | Run initial migration | migration | S |
| 1B.11 | Seed admin user + default roles + default permissions + sample location | `prisma/seed.ts` | M |

**Parallelism**: 1B.1-1B.9 can be done by ONE subagent (single schema file). 1B.10-1B.11 sequential after.

### 1C: Service Layer - Platform Core (after 1B, can parallelize)

| # | Task | File | Size | Parallel Group |
|---|------|------|------|----------------|
| 1C.1 | Auth service (session, token, login/logout) | `src/lib/auth/options.ts`, `src/lib/auth/helpers.ts` | M | G1 |
| 1C.2 | Permission evaluation service | `src/lib/permissions/evaluate.ts` | M | G1 |
| 1C.3 | Feature flag evaluation service | `src/lib/feature-flags/evaluate.ts` | M | G2 |
| 1C.4 | Approval engine service | `src/lib/approvals/engine.ts` | M | G2 |
| 1C.5 | Audit event service (create, query, timeline) | `src/lib/events/audit.ts` | M | G3 |
| 1C.6 | Security event service | `src/lib/events/security.ts` | S | G3 |
| 1C.7 | Exception engine service (create, assign, resolve, escalate) | `src/lib/exceptions/engine.ts` | M | G3 |
| 1C.8 | Notification service shell (internal, SMS, email) | `src/lib/notifications/service.ts` | M | G4 |

**Parallelism**: 4 subagents (G1-G4) can build these simultaneously.

### 1D: API Middleware (after 1C.1 and 1C.2)

| # | Task | File | Size |
|---|------|------|------|
| 1D.1 | Auth middleware (session check, JWT validation) | `src/lib/middleware/auth.ts` | M |
| 1D.2 | RBAC middleware (role + permission check) | `src/lib/middleware/rbac.ts` | M |
| 1D.3 | Rate limiting middleware | `src/lib/middleware/rate-limit.ts` | S |
| 1D.4 | Error handling middleware (standard error format) | `src/lib/middleware/error-handler.ts` | S |
| 1D.5 | Pagination helper | `src/lib/middleware/pagination.ts` | S |
| 1D.6 | Validation helper (Zod wrapper) | `src/lib/middleware/validate.ts` | S |
| 1D.7 | Scope filtering helper | `src/lib/middleware/scope-filter.ts` | S |

**Parallelism**: 1D.1-1D.7 can all run in parallel (2 subagents).

### 1E: Shared UI Components (after 1A.4, can parallel with 1B-1D)

| # | Task | File | Size | Parallel Group |
|---|------|------|------|----------------|
| 1E.1 | DataTable (sort, filter, search, column prefs, pagination, branch scope) | `src/components/shared/data-table.tsx` | L | U1 |
| 1E.2 | StatusBadge (color-coded by status enum) | `src/components/shared/status-badge.tsx` | S | U1 |
| 1E.3 | Timeline (audit event display, append-only) | `src/components/shared/timeline.tsx` | M | U1 |
| 1E.4 | ExceptionBadge + ExceptionCard | `src/components/shared/exception-card.tsx` | M | U2 |
| 1E.5 | ApprovalDialog (request, approve, deny, reason) | `src/components/shared/approval-dialog.tsx` | M | U2 |
| 1E.6 | ConfirmDialog (destructive action confirmation) | `src/components/shared/confirm-dialog.tsx` | S | U2 |
| 1E.7 | PageHeader (title, breadcrumbs, actions) | `src/components/shared/page-header.tsx` | S | U3 |
| 1E.8 | KPICard (metric + trend + sparkline) | `src/components/shared/kpi-card.tsx` | M | U3 |
| 1E.9 | EmptyState + LoadingState | `src/components/shared/states.tsx` | S | U3 |
| 1E.10 | FileUpload (S3/MinIO) | `src/components/shared/file-upload.tsx` | M | U3 |
| 1E.11 | SearchCommand (command palette shell) | `src/components/shared/search-command.tsx` | M | U3 |

**Parallelism**: 3 subagents (U1-U3).

---

## Phase 2: Core Data and API Contract

**Goal**: Define all core business entities and establish API patterns.

### 2A: Database Schema - Business Core

| # | Task | Models | Size |
|---|------|--------|------|
| 2A.1 | Customer, CustomerContact, CustomerTag, CustomerJobsite | 4 models | M |
| 2A.2 | Product, ProductCategory, ProductCostHistory | 3 models | M |
| 2A.3 | Vendor, VendorPrice, VendorContact | 3 models | M |
| 2A.4 | InventoryLocationBalance, InventoryLengthBalance | 2 models | S |
| 2A.5 | Order, OrderItem, OrderEvent (with state machine enum) | 3 models | L |
| 2A.6 | Truck, Route, RouteStop | 3 models | M |
| 2A.7 | DeliveryProof, CODCollection | 2 models | M |
| 2A.8 | PickupTicket | 1 model | S |
| 2A.9 | YardTask | 1 model | S |
| 2A.10 | ReceivingRecord, ReceivingLine, VerificationReview | 3 models | M |
| 2A.11 | PurchaseOrder, PurchaseOrderLine, VendorInvoice, MatchException, VendorClaim | 5 models | M |
| 2A.12 | Quote, QuoteLine | 2 models | M |
| 2A.13 | CollectionAccount, CollectionActivity, PromiseToPay, Dispute, PaymentPlan | 5 models | M |
| 2A.14 | Lead, Estimate, EstimateLine | 3 models | M |
| 2A.15 | ImportJob, ImportChange | 2 models | M |
| 2A.16 | Attachment, CommunicationLog, NotificationTemplate | 3 models | M |
| 2A.17 | Run migration + update seed with sample data | migration + seed | M |

**Parallelism**: ONE subagent writes the full schema (single file). Then migration runs.

### 2B: Zod Validators (after 2A, can parallelize)

| # | Task | File | Parallel |
|---|------|------|----------|
| 2B.1 | Customer validators | `src/lib/validators/customer.ts` | V1 |
| 2B.2 | Product validators | `src/lib/validators/product.ts` | V1 |
| 2B.3 | Order validators | `src/lib/validators/order.ts` | V1 |
| 2B.4 | Truck/Route validators | `src/lib/validators/dispatch.ts` | V2 |
| 2B.5 | Delivery/POD/COD validators | `src/lib/validators/delivery.ts` | V2 |
| 2B.6 | Receiving validators | `src/lib/validators/receiving.ts` | V2 |
| 2B.7 | Collections validators | `src/lib/validators/collections.ts` | V3 |
| 2B.8 | Pricing/Purchasing validators | `src/lib/validators/pricing.ts` | V3 |
| 2B.9 | CRM/Estimate validators | `src/lib/validators/crm.ts` | V3 |
| 2B.10 | Import validators | `src/lib/validators/import.ts` | V3 |

**Parallelism**: 3 subagents (V1-V3).

### 2C: Order State Machine (after 2A.5)

| # | Task | File | Size |
|---|------|------|------|
| 2C.1 | State machine definition (valid transitions, guards, side effects) | `src/lib/state-machines/order.ts` | L |
| 2C.2 | State machine tests | `src/lib/state-machines/__tests__/order.test.ts` | M |

### 2D: Type Definitions (after 2A, can parallelize)

| # | Task | File | Parallel |
|---|------|------|----------|
| 2D.1 | Core types (User, Role, Permission, etc.) | `src/types/core.ts` | T1 |
| 2D.2 | Customer types | `src/types/customer.ts` | T1 |
| 2D.3 | Order types | `src/types/order.ts` | T1 |
| 2D.4 | Dispatch types | `src/types/dispatch.ts` | T2 |
| 2D.5 | Delivery types | `src/types/delivery.ts` | T2 |
| 2D.6 | Yard/Receiving types | `src/types/yard.ts`, `src/types/receiving.ts` | T2 |
| 2D.7 | Collections types | `src/types/collections.ts` | T2 |
| 2D.8 | CRM/Pricing/Purchasing types | `src/types/crm.ts`, `src/types/pricing.ts`, `src/types/purchasing.ts` | T2 |

**Parallelism**: 2 subagents (T1-T2).

---

## Phase 3: Access Control and Workspace Configuration

**Goal**: Build the full auth/RBAC/feature-flag/approval UI layer.

### 3A: Auth Flows

| # | Task | Files | Size |
|---|------|-------|------|
| 3A.1 | Login page (email/password, branded) | `src/app/(auth)/login/page.tsx`, `src/components/auth/login-form.tsx` | M |
| 3A.2 | Forgot password flow | `src/app/(auth)/forgot-password/page.tsx`, `src/app/api/auth/forgot-password/route.ts` | M |
| 3A.3 | NextAuth config (JWT, session, callbacks) | `src/lib/auth/options.ts` | M |
| 3A.4 | Auth API routes | `src/app/api/auth/[...nextauth]/route.ts` | S |
| 3A.5 | Auth guard HOC / hook | `src/hooks/use-auth.ts`, `src/hooks/use-permissions.ts` | M |
| 3A.6 | Session provider wrapper | `src/components/providers/session-provider.tsx` | S |

### 3B: Dashboard Layout (after 3A)

| # | Task | Files | Size |
|---|------|-------|------|
| 3B.1 | Main dashboard layout (sidebar, topbar, breadcrumbs) | `src/app/(dashboard)/layout.tsx` | L |
| 3B.2 | Sidebar navigation (role-aware, collapsible, module icons) | `src/components/layout/sidebar.tsx` | M |
| 3B.3 | Top bar (user menu, notifications bell, branch selector, search trigger) | `src/components/layout/topbar.tsx` | M |
| 3B.4 | Mobile responsive shell (bottom nav for mobile roles) | `src/components/layout/mobile-nav.tsx` | M |

### 3C: Admin Module - Users & Roles (after 3B, can parallelize)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 3C.1 | User list page (DataTable, search, filter by role/branch/status) | `src/app/(dashboard)/admin/users/page.tsx` | M | R1 |
| 3C.2 | User detail/edit page (profile, roles, permissions, preferences) | `src/app/(dashboard)/admin/users/[id]/page.tsx` | M | R1 |
| 3C.3 | Create user dialog | `src/components/admin/create-user-dialog.tsx` | M | R1 |
| 3C.4 | User API routes (CRUD + role assignment) | `src/app/api/users/route.ts`, `src/app/api/users/[id]/route.ts`, `src/app/api/users/[id]/roles/route.ts` | M | R1 |
| 3C.5 | User service | `src/lib/services/user.service.ts` | M | R1 |
| 3C.6 | Role list page | `src/app/(dashboard)/admin/roles/page.tsx` | M | R2 |
| 3C.7 | Role detail/edit page (permissions assignment matrix) | `src/app/(dashboard)/admin/roles/[id]/page.tsx` | L | R2 |
| 3C.8 | Create role dialog | `src/components/admin/create-role-dialog.tsx` | M | R2 |
| 3C.9 | Role API routes | `src/app/api/roles/route.ts`, `src/app/api/roles/[id]/route.ts` | M | R2 |
| 3C.10 | Role service | `src/lib/services/role.service.ts` | M | R2 |
| 3C.11 | Permission catalog page | `src/app/(dashboard)/admin/permissions/page.tsx` | M | R2 |

**Parallelism**: 2 subagents (R1 users, R2 roles).

### 3D: Admin Module - Feature Flags & Settings (can parallel with 3C)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 3D.1 | Feature flag list page | `src/app/(dashboard)/admin/feature-flags/page.tsx` | M | F1 |
| 3D.2 | Feature flag detail (assignments by company/branch/role/user) | `src/app/(dashboard)/admin/feature-flags/[id]/page.tsx` | M | F1 |
| 3D.3 | Feature flag API routes | `src/app/api/feature-flags/route.ts`, `src/app/api/feature-flags/[id]/route.ts` | M | F1 |
| 3D.4 | Feature flag service | `src/lib/services/feature-flag.service.ts` | M | F1 |
| 3D.5 | Branch settings page | `src/app/(dashboard)/admin/settings/page.tsx` | M | F2 |
| 3D.6 | Branch settings API | `src/app/api/settings/branch/route.ts` | M | F2 |
| 3D.7 | Operational config management (status codes, reason codes, cutoff times, etc.) | `src/app/(dashboard)/admin/configuration/page.tsx` | L | F2 |
| 3D.8 | User preferences page | `src/app/(dashboard)/settings/preferences/page.tsx` | M | F2 |
| 3D.9 | User preferences API | `src/app/api/users/me/preferences/route.ts` | S | F2 |

**Parallelism**: 2 subagents (F1 flags, F2 settings).

### 3E: Admin Module - Approvals & Audit (can parallel with 3C, 3D)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 3E.1 | Approval policy list page | `src/app/(dashboard)/admin/approvals/page.tsx` | M | AP1 |
| 3E.2 | Approval policy editor (requester roles, approver roles, thresholds, timeouts, escalation) | `src/app/(dashboard)/admin/approvals/[id]/page.tsx` | L | AP1 |
| 3E.3 | Approval API routes | `src/app/api/approvals/route.ts`, `src/app/api/approvals/[id]/route.ts` | M | AP1 |
| 3E.4 | Approval service | `src/lib/services/approval.service.ts` | M | AP1 |
| 3E.5 | Audit log viewer (filterable by actor, entity, action, date range) | `src/app/(dashboard)/admin/audit-log/page.tsx` | M | AP2 |
| 3E.6 | Security event viewer | `src/app/(dashboard)/admin/security/page.tsx` | M | AP2 |
| 3E.7 | Audit API routes | `src/app/api/audit/route.ts` | S | AP2 |
| 3E.8 | Access simulation tool (preview what a user can see) | `src/app/(dashboard)/admin/access-simulator/page.tsx` | M | AP2 |

**Parallelism**: 2 subagents (AP1 approvals, AP2 audit).

---

## Phase 4: Order Backbone

**Goal**: Customer, Product, Order with strict state machine.

### 4A: Customer Module (can parallelize API+UI)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 4A.1 | Customer service (CRUD, search, credit check) | `src/lib/services/customer.service.ts` | M | C1 |
| 4A.2 | Customer API routes | `src/app/api/customers/route.ts`, `src/app/api/customers/[id]/route.ts`, `src/app/api/customers/[id]/contacts/route.ts` | M | C1 |
| 4A.3 | Customer directory page (DataTable, search, filter by status/branch/rep/tags) | `src/app/(dashboard)/customers/page.tsx` | M | C2 |
| 4A.4 | Customer detail page (360 shell with tabs: Profile, Orders, Deliveries, Billing, Collections, Pricing, Sales, Communications) | `src/app/(dashboard)/customers/[id]/page.tsx` | L | C2 |
| 4A.5 | Create/edit customer dialog | `src/components/customers/customer-form.tsx` | M | C2 |
| 4A.6 | Customer contacts sub-component | `src/components/customers/contacts-panel.tsx` | M | C2 |

### 4B: Product Module (can parallel with 4A)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 4B.1 | Product service | `src/lib/services/product.service.ts` | M | P1 |
| 4B.2 | Product API routes | `src/app/api/products/route.ts`, `src/app/api/products/[id]/route.ts` | M | P1 |
| 4B.3 | Product catalogue page (cost, sell, margin, vendor, inventory context) | `src/app/(dashboard)/products/page.tsx` | M | P1 |
| 4B.4 | Product detail page | `src/app/(dashboard)/products/[id]/page.tsx` | M | P1 |

### 4C: Order Module (after 4A + 4B)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 4C.1 | Order service (CRUD, state transitions, credit hold check, readiness rollup) | `src/lib/services/order.service.ts` | L | O1 |
| 4C.2 | Order API routes | `src/app/api/orders/route.ts`, `src/app/api/orders/[id]/route.ts`, `src/app/api/orders/[id]/items/route.ts`, `src/app/api/orders/[id]/transition/route.ts` | L | O1 |
| 4C.3 | Order list page | `src/app/(dashboard)/orders/page.tsx` | M | O2 |
| 4C.4 | Order detail page (items, status, timeline, exceptions, attachments) | `src/app/(dashboard)/orders/[id]/page.tsx` | L | O2 |
| 4C.5 | Create/edit order form | `src/components/orders/order-form.tsx` | L | O2 |
| 4C.6 | Order items editor (add/remove/edit lines, readiness indicators) | `src/components/orders/order-items-editor.tsx` | M | O2 |
| 4C.7 | Order status badge + transition buttons | `src/components/orders/order-status-controls.tsx` | M | O2 |
| 4C.8 | Order event timeline component | `src/components/orders/order-timeline.tsx` | M | O2 |
| 4C.9 | Printable pack slip / load summary | `src/components/orders/pack-slip.tsx` | M | O2 |
| 4C.10 | Seed realistic sample data (customers, products, orders) | `prisma/seed.ts` update | M | O1 |

**Parallelism**: 2 subagents per sub-module. 4A and 4B fully parallel. 4C after both.

---

## Phase 5: Dispatch and Pickup

**Goal**: Real-time dispatch board + pickup queue.

### 5A: Dispatch Module

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 5A.1 | Dispatch service (assign truck, sequence stops, capacity calc, checklist validation) | `src/lib/services/dispatch.service.ts` | L | D1 |
| 5A.2 | Route service (create, optimize, profitability score) | `src/lib/services/route.service.ts` | M | D1 |
| 5A.3 | Truck service (availability, capacity rules) | `src/lib/services/truck.service.ts` | M | D1 |
| 5A.4 | Dispatch API routes | `src/app/api/dispatch/route.ts`, `src/app/api/dispatch/trucks/route.ts`, `src/app/api/dispatch/routes/route.ts`, `src/app/api/dispatch/routes/[id]/route.ts` | L | D1 |
| 5A.5 | Socket.io events for dispatch (order-assigned, route-updated, truck-status-changed, stop-status-changed) | `src/lib/socket-events/dispatch.ts` | M | D1 |
| 5A.6 | Order board page (filterable DataTable + Kanban hybrid, desktop-first) | `src/app/(dashboard)/dispatch/page.tsx` | L | D2 |
| 5A.7 | Truck planner (drag-and-drop, capacity visualization) | `src/components/dispatch/truck-planner.tsx` | L | D2 |
| 5A.8 | Route map (Leaflet, stop markers, route polyline, zone overlays) | `src/components/dispatch/route-map.tsx` | L | D2 |
| 5A.9 | Dispatch checklist dialog | `src/components/dispatch/dispatch-checklist.tsx` | M | D2 |
| 5A.10 | Delayed order carryover queue | `src/components/dispatch/carryover-queue.tsx` | M | D2 |
| 5A.11 | Dispatch log page | `src/app/(dashboard)/dispatch/log/page.tsx` | M | D2 |
| 5A.12 | Truck capacity visualizer (weight, pieces, bundles, length) | `src/components/dispatch/capacity-bar.tsx` | M | D2 |

### 5B: Pickup Module (can parallel with 5A)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 5B.1 | Pickup service (queue management, arrival check-in, prep timer, handoff) | `src/lib/services/pickup.service.ts` | M | PK1 |
| 5B.2 | Pickup API routes | `src/app/api/pickups/route.ts`, `src/app/api/pickups/[id]/route.ts` | M | PK1 |
| 5B.3 | Pickup queue page (board by ready/arrival status, desktop-first) | `src/app/(dashboard)/pickup/page.tsx` | M | PK1 |
| 5B.4 | Pickup card (lane, bay, customer, prep timer, handoff confirmation) | `src/components/pickup/pickup-card.tsx` | M | PK1 |
| 5B.5 | Customer arrival check-in flow | `src/components/pickup/arrival-checkin.tsx` | S | PK1 |

**Parallelism**: 2 main agents (D1 backend, D2 frontend). Pickup (PK1) parallel with both.

---

## Phase 6: Yard and Receiving

**Goal**: Digitize physical yard work and receiving.

### 6A: Yard Module (mobile-first)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 6A.1 | Yard service (task queue, assignment, completion, bay status) | `src/lib/services/yard.service.ts` | M | Y1 |
| 6A.2 | Yard API routes | `src/app/api/yard/tasks/route.ts`, `src/app/api/yard/tasks/[id]/route.ts`, `src/app/api/yard/bays/route.ts` | M | Y1 |
| 6A.3 | My tasks page (mobile-first, swipe actions) | `src/app/(dashboard)/yard/page.tsx` | M | Y2 |
| 6A.4 | Workload board (manager view, desktop) | `src/app/(dashboard)/yard/workload/page.tsx` | M | Y2 |
| 6A.5 | Order prep queue | `src/components/yard/prep-queue.tsx` | M | Y2 |
| 6A.6 | Loading queue | `src/components/yard/loading-queue.tsx` | M | Y2 |
| 6A.7 | Bay status board | `src/components/yard/bay-status.tsx` | M | Y2 |
| 6A.8 | Damage log (photo capture + notes) | `src/components/yard/damage-log.tsx` | M | Y2 |
| 6A.9 | Cycle count tool | `src/components/yard/cycle-count.tsx` | M | Y2 |
| 6A.10 | Length tally tool (for random length materials) | `src/components/yard/length-tally.tsx` | M | Y2 |

### 6B: Receiving Module (mobile-first, parallel with 6A)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 6B.1 | Receiving service (PO receive, line-by-line, discrepancy, vendor issue) | `src/lib/services/receiving.service.ts` | L | R1 |
| 6B.2 | Receiving API routes | `src/app/api/receiving/route.ts`, `src/app/api/receiving/[id]/route.ts`, `src/app/api/receiving/[id]/lines/route.ts` | M | R1 |
| 6B.3 | Expected receipts calendar | `src/app/(dashboard)/receiving/page.tsx` | M | R2 |
| 6B.4 | PO receiving workflow (line-by-line: receive, short, over, damaged, substitute, reject) | `src/app/(dashboard)/receiving/[id]/page.tsx` | L | R2 |
| 6B.5 | Photo capture during receiving | `src/components/receiving/photo-capture.tsx` | M | R2 |
| 6B.6 | Discrepancy review queue | `src/app/(dashboard)/receiving/discrepancies/page.tsx` | M | R2 |
| 6B.7 | Vendor issue creation flow | `src/components/receiving/vendor-issue-form.tsx` | M | R2 |
| 6B.8 | Receiving-to-AP hold workflow | `src/lib/services/receiving-ap-bridge.ts` | M | R1 |

**Parallelism**: Yard (Y1+Y2) and Receiving (R1+R2) fully parallel.

---

## Phase 7: Delivery and Driver Workflows

**Goal**: Phone-first driver PWA with offline capability.

### 7A: Driver PWA Infrastructure

| # | Task | Files | Size |
|---|------|-------|------|
| 7A.1 | Service worker for offline support | `public/sw.js` | L |
| 7A.2 | PWA manifest | `public/manifest.json` | S |
| 7A.3 | Offline data sync service | `src/lib/services/offline-sync.ts` | L |
| 7A.4 | GPS tracking service | `src/lib/services/gps-tracking.ts` | M |
| 7A.5 | Geofence service | `src/lib/services/geofence.ts` | M |

### 7B: Driver UI (mobile-first, after 7A)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 7B.1 | Driver layout (bottom nav, minimal chrome) | `src/app/(driver)/layout.tsx` | M | DR1 |
| 7B.2 | Today's route page (stop list + map) | `src/app/(driver)/route/page.tsx` | L | DR1 |
| 7B.3 | Current stop page (products, notes, contact, gate code, delivery instructions) | `src/app/(driver)/stop/[id]/page.tsx` | L | DR1 |
| 7B.4 | POD capture (signature pad, multi-photo, notes, GPS stamp, timestamp) | `src/components/driver/pod-capture.tsx` | L | DR2 |
| 7B.5 | COD capture (amount due, payment type, collected, shortage reason) | `src/components/driver/cod-capture.tsx` | M | DR2 |
| 7B.6 | Stop outcome selector (delivered, partial, refused, no answer, etc.) | `src/components/driver/stop-outcome.tsx` | M | DR2 |
| 7B.7 | Return to yard flow | `src/components/driver/return-flow.tsx` | M | DR2 |
| 7B.8 | Stop issue escalation | `src/components/driver/issue-escalation.tsx` | M | DR2 |
| 7B.9 | Route summary + end-of-day closeout | `src/app/(driver)/summary/page.tsx` | M | DR2 |

### 7C: Delivery Backend (can parallel with 7B)

| # | Task | Files | Size |
|---|------|-------|------|
| 7C.1 | Delivery service (stop management, POD, COD, route completion) | `src/lib/services/delivery.service.ts` | L |
| 7C.2 | Driver session service | `src/lib/services/driver-session.service.ts` | M |
| 7C.3 | Delivery API routes | `src/app/api/delivery/route.ts`, `src/app/api/delivery/stops/[id]/route.ts`, `src/app/api/delivery/stops/[id]/pod/route.ts`, `src/app/api/delivery/stops/[id]/cod/route.ts` | L |
| 7C.4 | Socket.io events (stop-completed, driver-location-updated, route-completed) | `src/lib/socket-events/delivery.ts` | M |

**Parallelism**: 7A sequential first. Then DR1+DR2+7C all parallel.

---

## Phase 8: Collections and Credit

**Goal**: Structured AR follow-up with ownership and escalation. Desktop-first.

### 8A: Collections Backend

| # | Task | Files | Size |
|---|------|-------|------|
| 8A.1 | Collections service (aging calc, account assignment, promise tracking, dispute management, escalation) | `src/lib/services/collections.service.ts` | L |
| 8A.2 | Credit service (hold recommendation engine, hold/release workflow) | `src/lib/services/credit.service.ts` | M |
| 8A.3 | Collections API routes | `src/app/api/collections/route.ts`, `src/app/api/collections/accounts/[id]/route.ts`, `src/app/api/collections/accounts/[id]/calls/route.ts`, `src/app/api/collections/accounts/[id]/promises/route.ts`, `src/app/api/collections/accounts/[id]/disputes/route.ts` | L |

### 8B: Collections UI (after 8A, can parallelize pages)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 8B.1 | Aging dashboard (buckets: current, 30, 60, 90, 120+, charts) | `src/app/(dashboard)/collections/page.tsx` | L | CL1 |
| 8B.2 | My accounts page | `src/app/(dashboard)/collections/my-accounts/page.tsx` | M | CL1 |
| 8B.3 | Account detail page (contact history, promises, disputes, payment plans, memos) | `src/app/(dashboard)/collections/accounts/[id]/page.tsx` | L | CL2 |
| 8B.4 | Call log form + history | `src/components/collections/call-log-form.tsx` | M | CL2 |
| 8B.5 | Promise to pay form + tracker | `src/components/collections/promise-form.tsx` | M | CL2 |
| 8B.6 | Dispute form + aging tracker | `src/components/collections/dispute-form.tsx` | M | CL2 |
| 8B.7 | Payment plan builder | `src/components/collections/payment-plan.tsx` | M | CL2 |
| 8B.8 | Escalation queue | `src/app/(dashboard)/collections/escalations/page.tsx` | M | CL1 |
| 8B.9 | Credit hold controls (recommend, approve, release) | `src/components/collections/credit-hold-controls.tsx` | M | CL1 |
| 8B.10 | Collector performance dashboard | `src/app/(dashboard)/collections/performance/page.tsx` | M | CL1 |

**Parallelism**: 8A first, then CL1+CL2 parallel.

---

## Phase 9: CRM and Estimates

**Goal**: Revenue recovery from existing customers. Desktop-first.

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 9.1 | CRM service (leads, estimates, follow-ups, dormant detection, cross-sell rules) | `src/lib/services/crm.service.ts` | L | S1 |
| 9.2 | Estimate service (CRUD, line items, margin calc, expiration tracking) | `src/lib/services/estimate.service.ts` | M | S1 |
| 9.3 | CRM API routes | `src/app/api/crm/leads/route.ts`, `src/app/api/crm/estimates/route.ts`, `src/app/api/crm/follow-ups/route.ts` | M | S1 |
| 9.4 | Customer 360 page (full operational history view) | `src/app/(dashboard)/customers/[id]/page.tsx` (enhance from Phase 4) | L | S2 |
| 9.5 | Leads pipeline (Kanban: NEW -> CONTACTED -> ESTIMATE_SENT -> FOLLOW_UP -> NEGOTIATION -> WON -> LOST) | `src/app/(dashboard)/crm/page.tsx` | L | S2 |
| 9.6 | Estimate builder (line items, margin preview, PDF generation) | `src/app/(dashboard)/crm/estimates/[id]/page.tsx` | L | S2 |
| 9.7 | Follow-up queue | `src/app/(dashboard)/crm/follow-ups/page.tsx` | M | S3 |
| 9.8 | Dormant account list | `src/app/(dashboard)/crm/dormant/page.tsx` | M | S3 |
| 9.9 | Cross-sell opportunities (rule engine: "buys X but not Y") | `src/app/(dashboard)/crm/cross-sell/page.tsx` | M | S3 |
| 9.10 | Sales activity log | `src/components/crm/activity-log.tsx` | M | S3 |

**Parallelism**: 3 subagents (S1 backend, S2 main UI, S3 secondary UI).

---

## Phase 10: Pricing and Purchasing

**Goal**: Cost control and vendor management. Desktop-first.

### 10A: Pricing Module

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 10A.1 | Pricing service (import, cost change detection, margin calc, quote exposure) | `src/lib/services/pricing.service.ts` | L | PR1 |
| 10A.2 | Pricing API routes | `src/app/api/pricing/route.ts`, `src/app/api/pricing/imports/route.ts`, `src/app/api/pricing/cost-changes/route.ts` | M | PR1 |
| 10A.3 | Vendor price import workflow (CSV/XLSX upload, mapping, preview, approve) | `src/app/(dashboard)/pricing/import/page.tsx` | L | PR2 |
| 10A.4 | Cost change center (DataTable, severity: LOSS/CRITICAL/WARNING/OK) | `src/app/(dashboard)/pricing/cost-changes/page.tsx` | M | PR2 |
| 10A.5 | Open quote exposure list | `src/app/(dashboard)/pricing/quotes-at-risk/page.tsx` | M | PR2 |
| 10A.6 | Price history viewer | `src/components/pricing/price-history.tsx` | M | PR2 |
| 10A.7 | Quote simulator + bulk impact analysis | `src/components/pricing/quote-simulator.tsx` | L | PR2 |
| 10A.8 | Margin waterfall chart (Recharts) | `src/components/pricing/margin-waterfall.tsx` | M | PR2 |

### 10B: Purchasing Module (can parallel with 10A)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 10B.1 | Purchasing service (RFQ, PO, three-way match, vendor scorecards) | `src/lib/services/purchasing.service.ts` | L | PU1 |
| 10B.2 | Purchasing API routes | `src/app/api/purchasing/rfqs/route.ts`, `src/app/api/purchasing/pos/route.ts`, `src/app/api/purchasing/vendors/route.ts`, `src/app/api/purchasing/match/route.ts` | L | PU1 |
| 10B.3 | Vendor directory page | `src/app/(dashboard)/purchasing/vendors/page.tsx` | M | PU2 |
| 10B.4 | RFQ creation + comparison page | `src/app/(dashboard)/purchasing/rfqs/page.tsx` | L | PU2 |
| 10B.5 | PO creation + tracking page | `src/app/(dashboard)/purchasing/pos/page.tsx` | M | PU2 |
| 10B.6 | Three-way match review (PO vs Receipt vs Invoice) | `src/app/(dashboard)/purchasing/match/page.tsx` | L | PU2 |
| 10B.7 | Vendor scorecards (reliability, fill rate, cost volatility) | `src/components/purchasing/vendor-scorecard.tsx` | M | PU2 |
| 10B.8 | Vendor claim workflow | `src/app/(dashboard)/purchasing/claims/page.tsx` | M | PU2 |

**Parallelism**: PR1+PR2 and PU1+PU2 all parallel (4 subagents).

---

## Phase 11: Bridge and Import Engine

**Goal**: Make legacy ERP data usable with controlled imports.

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 11.1 | Import engine service (file parsing, mapping, confidence scoring, duplicate detection) | `src/lib/bridge/import-engine.ts` | L | B1 |
| 11.2 | CSV parser | `src/lib/bridge/parsers/csv-parser.ts` | M | B1 |
| 11.3 | XLSX parser | `src/lib/bridge/parsers/xlsx-parser.ts` | M | B1 |
| 11.4 | PDF parser (Claude AI extraction) | `src/lib/bridge/parsers/pdf-parser.ts` | L | B1 |
| 11.5 | Field mapping template service | `src/lib/bridge/mapping-templates.ts` | M | B1 |
| 11.6 | Confidence scoring engine | `src/lib/bridge/confidence.ts` | M | B1 |
| 11.7 | Import API routes | `src/app/api/imports/route.ts`, `src/app/api/imports/[id]/route.ts`, `src/app/api/imports/[id]/approve/route.ts` | M | B1 |
| 11.8 | Import upload page (file upload, type selection, mapping preview) | `src/app/(dashboard)/imports/page.tsx` | L | B2 |
| 11.9 | Import review page (side-by-side diff, approve/reject per row) | `src/app/(dashboard)/imports/[id]/page.tsx` | L | B2 |
| 11.10 | Reconciliation dashboard (health score by source, change tracking) | `src/app/(dashboard)/imports/reconciliation/page.tsx` | M | B2 |
| 11.11 | Import history page | `src/app/(dashboard)/imports/history/page.tsx` | M | B2 |

**Parallelism**: 2 subagents (B1 backend, B2 frontend).

---

## Phase 12: Reporting, Search, and Command Center

**Goal**: Management visibility and operational nerve center.

### 12A: Universal Search

| # | Task | Files | Size |
|---|------|-------|------|
| 12A.1 | Search service (multi-entity: orders, invoices, POs, customers, products, trucks, etc.) | `src/lib/services/search.service.ts` | M |
| 12A.2 | Search API route | `src/app/api/search/route.ts` | M |
| 12A.3 | Command palette (Cmd+K, recent items, pinned records, quick actions) | `src/components/shared/search-command.tsx` (enhance from Phase 1) | L |

### 12B: Command Center (after 12A)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 12B.1 | Command center page | `src/app/(dashboard)/command-center/page.tsx` | L | CC1 |
| 12B.2 | Today overview panel (order counts, truck counts, pickup queue, delayed stops, COD due, etc.) | `src/components/command-center/today-overview.tsx` | L | CC1 |
| 12B.3 | Top exceptions panel | `src/components/command-center/top-exceptions.tsx` | M | CC1 |
| 12B.4 | Department health blocks (dispatch, yard, delivery, collections, purchasing, pricing) | `src/components/command-center/department-health.tsx` | M | CC2 |
| 12B.5 | Quick actions panel | `src/components/command-center/quick-actions.tsx` | M | CC2 |
| 12B.6 | Live activity feed (Socket.io) | `src/components/command-center/activity-feed.tsx` | M | CC2 |
| 12B.7 | Shift handoff summary | `src/components/command-center/shift-handoff.tsx` | M | CC2 |
| 12B.8 | SLA monitor | `src/components/command-center/sla-monitor.tsx` | M | CC2 |

### 12C: Reports (can parallel with 12B)

| # | Task | Files | Size | Parallel |
|---|------|-------|------|----------|
| 12C.1 | Report service (data aggregation for all 16 report types) | `src/lib/services/report.service.ts` | L | RP1 |
| 12C.2 | Report API routes | `src/app/api/reports/[type]/route.ts` | M | RP1 |
| 12C.3 | Reports page (report selector, date range, branch filter, export) | `src/app/(dashboard)/reports/page.tsx` | M | RP2 |
| 12C.4 | On-time delivery report (Recharts) | `src/components/reports/on-time-delivery.tsx` | M | RP2 |
| 12C.5 | Route profitability report | `src/components/reports/route-profitability.tsx` | M | RP2 |
| 12C.6 | Order cycle time report | `src/components/reports/order-cycle-time.tsx` | M | RP2 |
| 12C.7 | Collector performance report | `src/components/reports/collector-performance.tsx` | M | RP2 |
| 12C.8 | Vendor fill rate report | `src/components/reports/vendor-fill-rate.tsx` | M | RP2 |
| 12C.9 | Price change impact report | `src/components/reports/price-change-impact.tsx` | M | RP2 |
| 12C.10 | 10 additional report components | `src/components/reports/*.tsx` | L | RP2 |

### 12D: Global Exception Center + Daily Close

| # | Task | Files | Size |
|---|------|-------|------|
| 12D.1 | Exception center page (centralized queue, priority, owner, SLA, resolution) | `src/app/(dashboard)/exceptions/page.tsx` | L |
| 12D.2 | Daily close service | `src/lib/services/daily-close.service.ts` | L |
| 12D.3 | Daily close page | `src/app/(dashboard)/daily-close/page.tsx` | L |

**Parallelism**: 12A first. Then CC1+CC2+RP1+RP2+12D all parallel (5 subagents).

---

## Phase 13: Hardening

**Goal**: Production readiness.

| # | Task | Size | Parallel |
|---|------|------|----------|
| 13.1 | Unit tests for all service layers | L | H1 |
| 13.2 | Integration tests for API routes | L | H2 |
| 13.3 | Workflow tests (order lifecycle, dispatch flow, delivery flow, collections flow) | L | H3 |
| 13.4 | Role/permission tests (every role x every action) | M | H1 |
| 13.5 | Audit event tests (every auditable action produces events) | M | H2 |
| 13.6 | Import validation tests (each import type with good/bad data) | M | H3 |
| 13.7 | Mobile workflow tests (driver PWA, yard, receiving) | M | H3 |
| 13.8 | Performance optimization (query analysis, indexing, lazy loading, image optimization) | M | H1 |
| 13.9 | Security audit (OWASP top 10, RBAC bypass testing, sensitive data exposure) | M | H2 |
| 13.10 | Seed data finalization (realistic building supply data across all modules) | M | H3 |

**Parallelism**: 3 subagents (H1-H3).

---

## Cross-Cutting Services (Built Incrementally)

These are built as needed by the phases that first require them:

| Service | First Needed | Files |
|---------|-------------|-------|
| Auth + Session | Phase 1 | `src/lib/auth/*` |
| Permission Engine | Phase 1 | `src/lib/permissions/*` |
| Feature Flag Engine | Phase 1 | `src/lib/feature-flags/*` |
| Approval Engine | Phase 1 | `src/lib/approvals/*` |
| Audit Event Service | Phase 1 | `src/lib/events/*` |
| Exception Engine | Phase 1 | `src/lib/exceptions/*` |
| Notification Service (shell) | Phase 1 | `src/lib/notifications/*` |
| SMS (Twilio) | Phase 5 (pickup) | `src/lib/notifications/sms.ts` |
| Email (Resend) | Phase 5 (pickup) | `src/lib/notifications/email.ts` |
| File Upload (S3/MinIO) | Phase 6 (receiving photos) | `src/lib/storage/*` |
| AI Extraction (Claude) | Phase 11 (import) | `src/lib/ai/*` |
| AI Vision (Claude) | Phase 6 (receiving verification) | `src/lib/ai/vision.ts` |
| GPS Tracking | Phase 7 (driver) | `src/lib/services/gps-tracking.ts` |
| Geofence | Phase 7 (driver) | `src/lib/services/geofence.ts` |
| Offline Sync | Phase 7 (driver PWA) | `src/lib/services/offline-sync.ts` |
| Daily Close | Phase 12 | `src/lib/services/daily-close.service.ts` |

---

## Parallelization Strategy Summary

### Maximum Parallel Subagents Per Phase

| Phase | Max Parallel Agents | Description |
|-------|-------------------|-------------|
| 0 | 5 | Documentation (A-E) |
| 1 | 4 | Services (G1-G4) + 2 middleware + 3 UI = up to 9 but staggered |
| 2 | 3 | Validators (V1-V3) + Types (T1-T2) |
| 3 | 6 | Auth + Layout + Users(R1-R2) + Flags(F1-F2) + Approvals(AP1-AP2) |
| 4 | 4 | Customer(C1-C2) + Product(P1) + Order(O1-O2) |
| 5 | 3 | Dispatch(D1-D2) + Pickup(PK1) |
| 6 | 4 | Yard(Y1-Y2) + Receiving(R1-R2) |
| 7 | 3 | Infrastructure + Driver(DR1-DR2) + Backend |
| 8 | 3 | Backend + Collections(CL1-CL2) |
| 9 | 3 | Backend(S1) + Main UI(S2) + Secondary(S3) |
| 10 | 4 | Pricing(PR1-PR2) + Purchasing(PU1-PU2) |
| 11 | 2 | Backend(B1) + Frontend(B2) |
| 12 | 5 | Search + CC(CC1-CC2) + Reports(RP1-RP2) + Exceptions |
| 13 | 3 | Testing groups (H1-H3) |

---

## Verification Plan

After each phase, verify:

1. **Phase 0**: All 12 docs exist with complete content per CLAUDE-RULES.md spec
2. **Phase 1**: `npm run build` succeeds, Prisma migrations applied, seed runs, auth login works
3. **Phase 2**: All models migrate, Zod validators pass type-check, state machine unit tests pass
4. **Phase 3**: Login flow works, role CRUD works, permission checks enforce correctly, feature flags toggle, audit log records access changes
4. **Phase 4**: Create customer, create product, create order, transition order through states, verify audit events
5. **Phase 5**: Assign orders to trucks, sequence stops on map, dispatch route, pickup check-in flow
6. **Phase 6**: Complete yard task, receive PO with discrepancy, capture damage photo, cycle count
7. **Phase 7**: Driver loads route, navigates stops, captures POD/COD, completes route, works offline
8. **Phase 8**: View aging dashboard, log call, create promise, manage dispute, recommend credit hold
9. **Phase 9**: View customer 360, create estimate, follow up on dormant, cross-sell suggestion appears
10. **Phase 10**: Import vendor prices, see cost changes, create RFQ, three-way match review
11. **Phase 11**: Upload CSV, map fields, review low-confidence rows, approve import, see reconciliation
12. **Phase 12**: Command center shows live data, search finds records, reports render charts, daily close reconciles
13. **Phase 13**: All test suites pass, no OWASP vulnerabilities, mobile workflows tested

---

## Execution Approach

When implementation begins:
1. Start Phase 0 with 5 parallel documentation agents
2. Once Phase 0 complete, begin Phase 1A (scaffolding) sequentially
3. After scaffolding, fan out Phase 1B-1E with maximum parallelism
4. Each subsequent phase follows the dependency chain but maximizes internal parallelism
5. Use the `superpowers:subagent-driven-development` skill for parallel agent execution
6. Use `superpowers:test-driven-development` where applicable (state machines, services)
7. Apply `frontend-design` skill for every UI component (industrial-utilitarian aesthetic)
8. Follow `express-lumber-ops` skill patterns for all API routes, services, and database work
9. Run code review after each phase completion

---
---

# APPENDIX A: Complete Data Model

## Platform Core Models (Phase 1)

### User
```
id              String    @id @default(cuid())
email           String    @unique
passwordHash    String
firstName       String
lastName        String
phone           String?
avatarUrl       String?
status          UserStatus (ACTIVE, INACTIVE, SUSPENDED, PENDING)
lastLoginAt     DateTime?
failedLoginCount Int      @default(0)
lockedUntil     DateTime?
mustChangePassword Boolean @default(false)
twoFactorEnabled Boolean  @default(false)
twoFactorSecret  String?
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
deletedAt       DateTime?
createdBy       String?
```

### UserProfile
```
id              String    @id @default(cuid())
userId          String    @unique -> User
title           String?
department      String?
defaultLocationId String? -> Location
defaultPrinter  String?
timezone        String    @default("America/New_York")
locale          String    @default("en-US")
```

### Location (Branch)
```
id              String    @id @default(cuid())
code            String    @unique
name            String
address         String
city            String
state           String
zip             String
phone           String?
fax             String?
email           String?
timezone        String    @default("America/New_York")
isActive        Boolean   @default(true)
cutoffTime      String    @default("14:00")   // dispatch cutoff
settings        Json?                          // branch-specific JSON config
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
deletedAt       DateTime?
```

### Role
```
id              String    @id @default(cuid())
name            String    @unique
displayName     String
description     String?
isSystem        Boolean   @default(false)     // system roles can't be deleted
isDefault       Boolean   @default(false)     // auto-assign to new users
department      String?
sortOrder       Int       @default(0)
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

### Permission
```
id              String    @id @default(cuid())
code            String    @unique             // e.g. "orders.create"
name            String
description     String?
module          String                        // e.g. "orders", "dispatch", "collections"
action          PermissionAction (VIEW, CREATE, EDIT, DELETE, APPROVE, OVERRIDE, EXPORT, ADMIN)
resourceType    String?                       // e.g. "Order", "Customer"
isSystem        Boolean   @default(false)
```

### RolePermission
```
id              String    @id @default(cuid())
roleId          String    -> Role
permissionId    String    -> Permission
scopeType       ScopeType (ALL, BRANCH, OWN, TEAM, ASSIGNED, READ_ONLY)
scopeValue      String?                       // branch ID, team ID, etc.
fieldRestrictions Json?                       // field-level visibility rules
conditions      Json?                         // threshold conditions
@@unique([roleId, permissionId])
```

### UserRoleAssignment
```
id              String    @id @default(cuid())
userId          String    -> User
roleId          String    -> Role
locationId      String?   -> Location         // null = all locations
isTemporary     Boolean   @default(false)
expiresAt       DateTime?
assignedBy      String    -> User
assignedAt      DateTime  @default(now())
revokedAt       DateTime?
revokedBy       String?
reason          String?
@@unique([userId, roleId, locationId])
```

### FeatureFlag
```
id              String    @id @default(cuid())
code            String    @unique             // e.g. "collections_module"
name            String
description     String?
category        String?                       // e.g. "modules", "features", "experiments"
defaultState    FlagState (ON, OFF, BETA, READ_ONLY, HIDDEN)
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

### FeatureFlagAssignment
```
id              String    @id @default(cuid())
flagId          String    -> FeatureFlag
level           FlagLevel (COMPANY, BRANCH, ROLE, USER, ENVIRONMENT)
targetId        String                        // locationId, roleId, userId, or env name
state           FlagState
createdBy       String    -> User
createdAt       DateTime  @default(now())
@@unique([flagId, level, targetId])
```

### ApprovalPolicy
```
id              String    @id @default(cuid())
name            String
description     String?
actionType      String                        // e.g. "price_override", "credit_release", "writeoff"
entityType      String?                       // e.g. "Order", "Customer"
requesterRoles  String[]                      // roles that can request
approverRoles   String[]                      // roles that can approve
thresholdField  String?                       // field to check threshold against
thresholdMin    Decimal?                      // min value requiring approval
thresholdMax    Decimal?                      // max value requiring approval
timeoutHours    Int       @default(24)
escalationRoles String[]                      // roles for timeout escalation
requireReason   Boolean   @default(true)
requireAttachment Boolean @default(false)
isActive        Boolean   @default(true)
locationId      String?   -> Location         // null = all locations
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

### ApprovalRequest
```
id              String    @id @default(cuid())
policyId        String    -> ApprovalPolicy
requesterId     String    -> User
entityType      String
entityId        String
status          ApprovalStatus (PENDING, APPROVED, DENIED, EXPIRED, ESCALATED, CANCELLED)
oldValue        Json?
newValue        Json?
reason          String
attachmentIds   String[]
locationId      String    -> Location
expiresAt       DateTime
resolvedAt      DateTime?
resolvedBy      String?   -> User
resolutionNote  String?
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

### AuditEvent
```
id              String    @id @default(cuid())
actorId         String?   -> User             // null for system events
actorName       String
action          String                        // e.g. "order.created", "role.changed"
entityType      String                        // e.g. "Order", "User"
entityId        String
entityName      String?                       // human-readable label
locationId      String?   -> Location
before          Json?                         // previous state
after           Json?                         // new state
metadata        Json?                         // extra context
source          String    @default("web")     // web, api, import, system
ipAddress       String?
userAgent       String?
timestamp       DateTime  @default(now())
```

### SecurityEvent
```
id              String    @id @default(cuid())
type            SecurityEventType (LOGIN, LOGOUT, FAILED_LOGIN, PASSWORD_CHANGE, ROLE_CHANGE, PERMISSION_CHANGE, FEATURE_FLAG_CHANGE, SENSITIVE_ACCESS, EXPORT, IMPERSONATION)
actorId         String?   -> User
targetUserId    String?   -> User
details         Json?
ipAddress       String?
userAgent       String?
success         Boolean
timestamp       DateTime  @default(now())
```

### Exception
```
id              String    @id @default(cuid())
category        ExceptionCategory (see Appendix D)
severity        ExceptionSeverity (CRITICAL, HIGH, MEDIUM, LOW)
title           String
description     String?
entityType      String
entityId        String
entityName      String?
module          String                        // originating module
ownerId         String?   -> User
locationId      String    -> Location
status          ExceptionStatus (OPEN, ACKNOWLEDGED, IN_PROGRESS, RESOLVED, ESCALATED, DISMISSED)
slaTargetAt     DateTime?
resolvedAt      DateTime?
resolvedBy      String?   -> User
resolutionNote  String?
escalatedAt     DateTime?
escalatedTo     String?   -> User
priorityScore   Int       @default(0)         // computed weighted score
relatedExceptionIds String[]
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

### BranchSetting
```
id              String    @id @default(cuid())
locationId      String    -> Location
key             String                        // e.g. "dispatch_cutoff_time"
value           Json
category        String                        // e.g. "dispatch", "receiving", "collections"
description     String?
@@unique([locationId, key])
```

### UserPreference
```
id              String    @id @default(cuid())
userId          String    -> User
key             String                        // e.g. "landing_page", "theme", "density"
value           Json
@@unique([userId, key])
```

## Business Core Models (Phase 2)

### Customer
```
id              String    @id @default(cuid())
accountNumber   String    @unique
companyName     String
dba             String?
type            CustomerType (COMMERCIAL, RESIDENTIAL, CONTRACTOR, GOVERNMENT)
status          CustomerStatus (ACTIVE, INACTIVE, ON_HOLD, COD_ONLY, CLOSED)
creditLimit     Decimal   @default(0)  @db.Decimal(12,2)
currentBalance  Decimal   @default(0)  @db.Decimal(12,2)
paymentTerms    String    @default("NET30")
taxExempt       Boolean   @default(false)
taxId           String?
defaultSalesRepId String? -> User
billingAddress  Json                          // { street, city, state, zip }
shippingAddress Json?
defaultDeliveryInstructions String?
communicationPreferences Json?               // { sms: bool, email: bool, optOut: bool }
tags            CustomerTag[]
notes           String?
erpCustomerId   String?   @unique            // link to ERP
locationId      String    -> Location
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
deletedAt       DateTime?
createdBy       String    -> User
```

### Product
```
id              String    @id @default(cuid())
sku             String    @unique
name            String
description     String?
categoryId      String?   -> ProductCategory
uom             String                        // EA, LF, BF, BDL, PC, etc.
isRandomLength  Boolean   @default(false)
weight          Decimal?  @db.Decimal(10,2)   // per unit
currentCost     Decimal   @db.Decimal(10,4)
currentSell     Decimal   @db.Decimal(10,2)
marginPercent   Decimal?  @db.Decimal(5,2)
primaryVendorId String?   -> Vendor
status          ProductStatus (ACTIVE, DISCONTINUED, SPECIAL_ORDER)
minOrderQty     Decimal?  @db.Decimal(10,2)
leadTimeDays    Int?
erpProductId    String?   @unique
locationId      String    -> Location
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
deletedAt       DateTime?
```

### Order
```
id              String    @id @default(cuid())
orderNumber     String    @unique
type            OrderType (DELIVERY, PICKUP, WILL_CALL, TRANSFER, RETURN_PICKUP, VENDOR_DROP_SHIP)
status          OrderStatus (DRAFT, IMPORTED, NEEDS_REVIEW, APPROVED, ON_CREDIT_HOLD, WAITING_INVENTORY, PARTIALLY_READY, READY, LOADING, LOADED, DISPATCHED, OUT_FOR_DELIVERY, DELIVERED, PICKUP_READY, PICKED_UP, REFUSED, RESCHEDULED, CANCELLED, CLOSED)
customerId      String    -> Customer
customerPO      String?
jobsiteName     String?
deliveryAddress Json?                         // override from customer default
contactName     String?
contactPhone    String?
salesRepId      String?   -> User
requestedDate   DateTime
appointmentFlag Boolean   @default(false)
appointmentWindow String?                     // e.g. "8AM-10AM"
codFlag         Boolean   @default(false)
codAmount       Decimal?  @db.Decimal(12,2)
holdReasons     String[]
rescheduleReason String?
specialInstructions String?
internalNotes   String?
routeId         String?   -> Route
truckId         String?   -> Truck
stopSequence    Int?
readinessPercent Int      @default(0)         // computed from line items
totalWeight     Decimal?  @db.Decimal(10,2)
totalPieces     Int?
totalAmount     Decimal?  @db.Decimal(12,2)
marginPercent   Decimal?  @db.Decimal(5,2)
priorityScore   Int       @default(0)
erpOrderId      String?
locationId      String    -> Location
dispatchedAt    DateTime?
deliveredAt     DateTime?
closedAt        DateTime?
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
deletedAt       DateTime?
createdBy       String    -> User
```

### OrderItem
```
id              String    @id @default(cuid())
orderId         String    -> Order
productId       String    -> Product
lineNumber      Int
description     String
quantity        Decimal   @db.Decimal(10,2)
uom             String
unitPrice       Decimal   @db.Decimal(10,2)
unitCost        Decimal   @db.Decimal(10,4)
extendedPrice   Decimal   @db.Decimal(12,2)
length          Decimal?  @db.Decimal(10,2)   // for random length
weight          Decimal?  @db.Decimal(10,2)
locationCode    String?                       // warehouse location
readyStatus     ItemReadyStatus (NOT_READY, PARTIAL, READY, BACKORDERED, SUBSTITUTED)
substitutionAllowed Boolean @default(false)
substitutedWith String?
issueFlag       Boolean   @default(false)
issueNote       String?
notes           String?
```

### Truck
```
id              String    @id @default(cuid())
number          String    @unique
name            String?
type            TruckType (FLATBED, BOX, BOOM, PICKUP, MOFFETT)
maxWeight       Decimal   @db.Decimal(10,2)   // lbs
maxPieces       Int?
maxBundles      Int?
maxLength       Decimal?  @db.Decimal(10,2)   // feet
axleCount       Int       @default(2)
hasLiftgate     Boolean   @default(false)
hasMoffett      Boolean   @default(false)
status          TruckStatus (AVAILABLE, IN_USE, MAINTENANCE, OUT_OF_SERVICE)
currentDriverId String?   -> User
locationId      String    -> Location
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
deletedAt       DateTime?
```

### Route
```
id              String    @id @default(cuid())
routeNumber     String    @unique
date            DateTime  @db.Date
truckId         String    -> Truck
driverId        String    -> User
dispatcherId    String    -> User
status          RouteStatus (PLANNING, READY, DISPATCHED, IN_PROGRESS, COMPLETED, CANCELLED)
departedAt      DateTime?
completedAt     DateTime?
totalStops      Int       @default(0)
completedStops  Int       @default(0)
totalWeight     Decimal?  @db.Decimal(10,2)
totalPieces     Int?
estimatedMiles  Decimal?  @db.Decimal(10,1)
estimatedDuration Int?                        // minutes
profitabilityScore Decimal? @db.Decimal(5,2)
feasibilityScore Decimal?  @db.Decimal(5,2)
routeNotes      String?
locationId      String    -> Location
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

### RouteStop
```
id              String    @id @default(cuid())
routeId         String    -> Route
orderId         String    -> Order
sequence        Int
address         Json                          // { street, city, state, zip, lat, lng }
customerName    String
contactName     String?
contactPhone    String?
deliveryInstructions String?
gateCode        String?
appointmentWindow String?
estimatedArrival DateTime?
actualArrival   DateTime?
estimatedServiceTime Int?                     // minutes
status          StopStatus (PENDING, EN_ROUTE, ARRIVED, IN_PROGRESS, COMPLETED, FAILED, SKIPPED)
outcome         StopOutcome? (DELIVERED, PARTIAL, REFUSED, NO_ANSWER, SITE_CLOSED, RESCHEDULED, DAMAGED, LEFT_ON_SITE)
failureReason   String?
completedAt     DateTime?
geofenceEntered Boolean   @default(false)
geofenceLat     Decimal?  @db.Decimal(10,7)
geofenceLng     Decimal?  @db.Decimal(10,7)
```

### DeliveryProof
```
id              String    @id @default(cuid())
stopId          String    -> RouteStop
signatureUrl    String?
signedBy        String?
photos          String[]                      // S3 URLs
notes           String?
gpsLat          Decimal   @db.Decimal(10,7)
gpsLng          Decimal   @db.Decimal(10,7)
capturedAt      DateTime  @default(now())
capturedBy      String    -> User
```

### CODCollection
```
id              String    @id @default(cuid())
stopId          String    -> RouteStop
orderId         String    -> Order
customerId      String    -> Customer
amountDue       Decimal   @db.Decimal(12,2)
amountCollected Decimal   @db.Decimal(12,2)
paymentType     PaymentType (CASH, CHECK, CREDIT_CARD, OTHER)
checkNumber     String?
shortageAmount  Decimal?  @db.Decimal(12,2)
shortageReason  String?
refusalReason   String?
proofPhotoUrl   String?
collectedBy     String    -> User
collectedAt     DateTime  @default(now())
verifiedBy      String?   -> User
verifiedAt      DateTime?
```

### CollectionAccount (Phase 8)
```
id              String    @id @default(cuid())
customerId      String    -> Customer
collectorId     String?   -> User
status          CollectionStatus (ACTIVE, WATCH, ESCALATED, HOLD, RESOLVED, CLOSED)
currentBalance  Decimal   @db.Decimal(12,2)
aging_current   Decimal   @db.Decimal(12,2) @default(0)
aging_30        Decimal   @db.Decimal(12,2) @default(0)
aging_60        Decimal   @db.Decimal(12,2) @default(0)
aging_90        Decimal   @db.Decimal(12,2) @default(0)
aging_120_plus  Decimal   @db.Decimal(12,2) @default(0)
lastContactDate DateTime?
lastPaymentDate DateTime?
nextActionDate  DateTime?
nextActionNote  String?
promiseReliabilityScore Decimal? @db.Decimal(3,2)  // 0.00 to 1.00
holdRecommended Boolean   @default(false)
holdReason      String?
internalMemo    String?
locationId      String    -> Location
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

### PromiseToPay
```
id              String    @id @default(cuid())
accountId       String    -> CollectionAccount
customerId      String    -> Customer
amount          Decimal   @db.Decimal(12,2)
promiseDate     DateTime
status          PromiseStatus (PENDING, KEPT, BROKEN, PARTIAL, CANCELLED)
paymentReceived Decimal?  @db.Decimal(12,2)
receivedDate    DateTime?
notes           String?
createdBy       String    -> User
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

### ReceivingRecord
```
id              String    @id @default(cuid())
purchaseOrderId String    -> PurchaseOrder
receivedBy      String    -> User
status          ReceivingStatus (IN_PROGRESS, PENDING_REVIEW, APPROVED, REJECTED, AP_HOLD)
totalLinesExpected Int
totalLinesReceived Int
hasDiscrepancy  Boolean   @default(false)
discrepancySeverity DiscrepancySeverity? (LOW, MEDIUM, HIGH, CRITICAL)
reviewedBy      String?   -> User
reviewedAt      DateTime?
reviewNotes     String?
locationId      String    -> Location
receivedAt      DateTime  @default(now())
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

### PurchaseOrder
```
id              String    @id @default(cuid())
poNumber        String    @unique
vendorId        String    -> Vendor
status          POStatus (DRAFT, SUBMITTED, CONFIRMED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED, CLOSED)
totalAmount     Decimal   @db.Decimal(12,2)
expectedDate    DateTime?
approvedBy      String?   -> User
approvedAt      DateTime?
notes           String?
locationId      String    -> Location
createdBy       String    -> User
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
deletedAt       DateTime?
```

### ImportJob (Phase 11)
```
id              String    @id @default(cuid())
type            ImportType (ORDERS, CUSTOMERS, INVOICES, AR_AGING, VENDOR_PRICES, PRODUCTS, INVENTORY, QUOTES)
fileName        String
fileUrl         String
status          ImportStatus (UPLOADING, PARSING, MAPPED, REVIEWING, APPROVED, REJECTED, PROCESSING, COMPLETED, FAILED)
totalRows       Int       @default(0)
processedRows   Int       @default(0)
createdRows     Int       @default(0)
updatedRows     Int       @default(0)
unchangedRows   Int       @default(0)
errorRows       Int       @default(0)
confidenceScore Decimal?  @db.Decimal(3,2)    // 0.00 to 1.00
mappingTemplateId String?
errors          Json?
reviewedBy      String?   -> User
reviewedAt      DateTime?
locationId      String    -> Location
createdBy       String    -> User
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt
```

---

# APPENDIX B: Permissions Matrix

## Complete Permission Catalog (71 permissions)

### Orders Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `orders.view` | VIEW | All roles except YARD_WORKER |
| `orders.create` | CREATE | ADMIN, MANAGER, DISPATCHER, COUNTER_SALES, OUTSIDE_SALES |
| `orders.edit` | EDIT | ADMIN, MANAGER, DISPATCHER, COUNTER_SALES |
| `orders.cancel` | DELETE | ADMIN, MANAGER, DISPATCHER (own branch) |
| `orders.override_status` | OVERRIDE | ADMIN, MANAGER |
| `orders.view_margin` | VIEW | ADMIN, MANAGER, EXECUTIVE, PRICING |
| `orders.view_cost` | VIEW | ADMIN, MANAGER, EXECUTIVE, PRICING, PURCHASING |

### Dispatch Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `dispatch.view_board` | VIEW | ADMIN, MANAGER, DISPATCHER, YARD_MANAGER |
| `dispatch.assign_truck` | EDIT | ADMIN, MANAGER, DISPATCHER |
| `dispatch.reorder_stops` | EDIT | ADMIN, MANAGER, DISPATCHER |
| `dispatch.release_route` | APPROVE | ADMIN, MANAGER, DISPATCHER |
| `dispatch.override_capacity` | OVERRIDE | ADMIN, MANAGER (requires approval) |
| `dispatch.view_driver_location` | VIEW | ADMIN, MANAGER, DISPATCHER |

### Delivery Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `delivery.view_routes` | VIEW | ADMIN, MANAGER, DISPATCHER, DRIVER |
| `delivery.capture_pod` | CREATE | DRIVER |
| `delivery.capture_cod` | CREATE | DRIVER |
| `delivery.view_cod_amounts` | VIEW | ADMIN, MANAGER, DISPATCHER, DRIVER, CASHIER |
| `delivery.mark_stop_complete` | EDIT | DRIVER |
| `delivery.escalate_issue` | CREATE | DRIVER, DISPATCHER |

### Yard Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `yard.view_tasks` | VIEW | ADMIN, MANAGER, YARD_MANAGER, YARD_WORKER |
| `yard.assign_tasks` | EDIT | ADMIN, MANAGER, YARD_MANAGER |
| `yard.complete_task` | EDIT | YARD_MANAGER, YARD_WORKER |
| `yard.mark_ready` | EDIT | ADMIN, MANAGER, YARD_MANAGER, YARD_WORKER |
| `yard.mark_loaded` | EDIT | ADMIN, MANAGER, YARD_MANAGER, YARD_WORKER |
| `yard.log_damage` | CREATE | ADMIN, MANAGER, YARD_MANAGER, YARD_WORKER |
| `yard.adjust_inventory` | EDIT | ADMIN, MANAGER, YARD_MANAGER (requires approval) |
| `yard.approve_cycle_count` | APPROVE | ADMIN, MANAGER |

### Receiving Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `receiving.view` | VIEW | ADMIN, MANAGER, PURCHASING, RECEIVING_CLERK, AP_SUPPORT |
| `receiving.receive_po` | CREATE | ADMIN, MANAGER, RECEIVING_CLERK |
| `receiving.log_discrepancy` | CREATE | RECEIVING_CLERK, PURCHASING |
| `receiving.approve_receiving` | APPROVE | ADMIN, MANAGER, PURCHASING |
| `receiving.create_vendor_issue` | CREATE | ADMIN, MANAGER, PURCHASING, RECEIVING_CLERK |

### Collections Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `collections.view_aging` | VIEW | ADMIN, MANAGER, AR_MANAGER, COLLECTIONS_REP |
| `collections.assign_accounts` | EDIT | ADMIN, MANAGER, AR_MANAGER |
| `collections.log_call` | CREATE | COLLECTIONS_REP, AR_MANAGER |
| `collections.create_promise` | CREATE | COLLECTIONS_REP, AR_MANAGER |
| `collections.create_dispute` | CREATE | COLLECTIONS_REP, AR_MANAGER |
| `collections.edit_payment_plan` | EDIT | AR_MANAGER, CREDIT_MANAGER |
| `collections.approve_writeoff` | APPROVE | ADMIN, EXECUTIVE, CREDIT_MANAGER |
| `collections.recommend_hold` | CREATE | COLLECTIONS_REP, AR_MANAGER |
| `collections.release_hold` | APPROVE | ADMIN, MANAGER, AR_MANAGER, CREDIT_MANAGER |

### Customer Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `customers.view` | VIEW | All roles |
| `customers.create` | CREATE | ADMIN, MANAGER, COUNTER_SALES, OUTSIDE_SALES |
| `customers.edit` | EDIT | ADMIN, MANAGER, COUNTER_SALES, OUTSIDE_SALES |
| `customers.edit_credit` | EDIT | ADMIN, MANAGER, AR_MANAGER, CREDIT_MANAGER |
| `customers.view_balance` | VIEW | ADMIN, MANAGER, AR_MANAGER, CREDIT_MANAGER, COLLECTIONS_REP, EXECUTIVE |

### Pricing Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `pricing.view_catalogue` | VIEW | ADMIN, MANAGER, PRICING, PURCHASING, COUNTER_SALES, OUTSIDE_SALES |
| `pricing.view_cost` | VIEW | ADMIN, MANAGER, EXECUTIVE, PRICING, PURCHASING |
| `pricing.edit_sell_price` | EDIT | ADMIN, MANAGER, PRICING |
| `pricing.approve_price_override` | APPROVE | ADMIN, MANAGER, PRICING |
| `pricing.import_vendor_prices` | CREATE | ADMIN, PRICING, PURCHASING |

### Purchasing Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `purchasing.view` | VIEW | ADMIN, MANAGER, PURCHASING, RECEIVING_CLERK |
| `purchasing.create_po` | CREATE | ADMIN, MANAGER, PURCHASING |
| `purchasing.approve_po` | APPROVE | ADMIN, MANAGER (threshold-based) |
| `purchasing.create_rfq` | CREATE | PURCHASING |
| `purchasing.approve_ap_match` | APPROVE | ADMIN, MANAGER, AP_SUPPORT, FINANCE |

### CRM Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `crm.view_leads` | VIEW | ADMIN, MANAGER, COUNTER_SALES, OUTSIDE_SALES |
| `crm.create_estimate` | CREATE | COUNTER_SALES, OUTSIDE_SALES |
| `crm.edit_estimate` | EDIT | COUNTER_SALES, OUTSIDE_SALES (own only) |
| `crm.view_dormant` | VIEW | ADMIN, MANAGER, OUTSIDE_SALES |

### Import Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `imports.upload` | CREATE | ADMIN, MANAGER |
| `imports.approve_batch` | APPROVE | ADMIN, MANAGER |
| `imports.view_history` | VIEW | ADMIN, MANAGER |

### Admin Module
| Permission Code | Action | Roles with Access |
|----------------|--------|-------------------|
| `admin.manage_users` | ADMIN | ADMIN, SYSTEMS_ADMIN |
| `admin.manage_roles` | ADMIN | ADMIN, SYSTEMS_ADMIN |
| `admin.manage_feature_flags` | ADMIN | ADMIN, SYSTEMS_ADMIN |
| `admin.manage_settings` | ADMIN | ADMIN, SYSTEMS_ADMIN, BRANCH_MANAGER (own branch) |
| `admin.view_audit_log` | VIEW | ADMIN, MANAGER, SYSTEMS_ADMIN |
| `admin.view_security_events` | VIEW | ADMIN, SYSTEMS_ADMIN |
| `admin.export_reports` | EXPORT | ADMIN, MANAGER, EXECUTIVE |

### Field-Level Visibility Rules
| Field | Hidden From |
|-------|------------|
| `Product.currentCost` | COUNTER_SALES, OUTSIDE_SALES, DRIVER, YARD_WORKER, COLLECTIONS_REP |
| `Order.marginPercent` | COUNTER_SALES, OUTSIDE_SALES, DRIVER, YARD_WORKER, COLLECTIONS_REP |
| `Customer.currentBalance` | DRIVER, YARD_WORKER, COUNTER_SALES |
| `Customer.creditLimit` | DRIVER, YARD_WORKER, COUNTER_SALES |
| `CollectionAccount.*` | DRIVER, YARD_WORKER, COUNTER_SALES, OUTSIDE_SALES |
| `Dispute.internalNotes` | DRIVER, YARD_WORKER |
| `Route.profitabilityScore` | DRIVER, YARD_WORKER |

---

# APPENDIX C: Event Backbone

## Event Types (32 event types)

### Authentication Events
| Event | Producer | Consumers |
|-------|----------|-----------|
| `auth.login` | Auth service | SecurityEvent log, analytics |
| `auth.logout` | Auth service | SecurityEvent log |
| `auth.failed_login` | Auth service | SecurityEvent log, lockout service |
| `auth.password_changed` | Auth service | SecurityEvent log, notification |

### Access Control Events
| Event | Producer | Consumers |
|-------|----------|-----------|
| `role.assigned` | User service | AuditEvent, SecurityEvent |
| `role.revoked` | User service | AuditEvent, SecurityEvent |
| `permission.changed` | Role service | AuditEvent, SecurityEvent, cache invalidation |
| `feature_flag.changed` | FeatureFlag service | AuditEvent, SecurityEvent, cache invalidation |

### Order Events
| Event | Producer | Consumers |
|-------|----------|-----------|
| `order.created` | Order service | AuditEvent, exception check, notification |
| `order.updated` | Order service | AuditEvent |
| `order.status_changed` | Order state machine | AuditEvent, exception engine, dispatch board (Socket.io), notification |
| `order.credit_hold_applied` | Credit service | AuditEvent, exception engine, collections notification |
| `order.credit_hold_released` | Credit service | AuditEvent, dispatch notification |

### Dispatch Events
| Event | Producer | Consumers |
|-------|----------|-----------|
| `dispatch.truck_assigned` | Dispatch service | AuditEvent, dispatch board (Socket.io) |
| `dispatch.route_created` | Route service | AuditEvent, driver notification |
| `dispatch.route_released` | Dispatch service | AuditEvent, driver PWA (Socket.io), notification |
| `dispatch.route_completed` | Delivery service | AuditEvent, daily close, reports |

### Delivery Events
| Event | Producer | Consumers |
|-------|----------|-----------|
| `delivery.stop_completed` | Delivery service | AuditEvent, dispatch board (Socket.io), customer SMS |
| `delivery.pod_captured` | Delivery service | AuditEvent, order update |
| `delivery.cod_collected` | Delivery service | AuditEvent, collections, cashier notification |
| `delivery.stop_failed` | Delivery service | AuditEvent, exception engine, dispatch notification |
| `delivery.driver_location_updated` | GPS tracking | Dispatch board (Socket.io), geofence service |

### Receiving Events
| Event | Producer | Consumers |
|-------|----------|-----------|
| `receiving.completed` | Receiving service | AuditEvent, inventory update, AP workflow |
| `receiving.discrepancy_found` | Receiving service | AuditEvent, exception engine, purchasing notification |

### Collections Events
| Event | Producer | Consumers |
|-------|----------|-----------|
| `collections.promise_created` | Collections service | AuditEvent, calendar reminder |
| `collections.promise_broken` | Daily close service | AuditEvent, exception engine, escalation |
| `collections.dispute_opened` | Collections service | AuditEvent, exception engine |
| `collections.hold_recommended` | Collections service | AuditEvent, approval workflow |

### Import Events
| Event | Producer | Consumers |
|-------|----------|-----------|
| `import.created` | Import engine | AuditEvent |
| `import.approved` | Import engine | AuditEvent, data processing |
| `import.rejected` | Import engine | AuditEvent, notification |

### Approval Events
| Event | Producer | Consumers |
|-------|----------|-----------|
| `approval.requested` | Approval engine | AuditEvent, approver notification |
| `approval.granted` | Approval engine | AuditEvent, requester notification, action execution |
| `approval.denied` | Approval engine | AuditEvent, requester notification |

---

# APPENDIX D: Exception Model

## Exception Categories (16 categories)

| Category | Severity Default | SLA (hours) | Module | Auto-Created By |
|----------|-----------------|-------------|--------|-----------------|
| `LATE_ORDER` | HIGH | 2 | Dispatch | Order past requested date without dispatch |
| `ROUTE_OVERLOAD` | MEDIUM | 4 | Dispatch | Truck over capacity threshold |
| `DELIVERY_FAILURE` | HIGH | 2 | Delivery | Stop outcome = REFUSED/NO_ANSWER/SITE_CLOSED |
| `MISSING_POD` | MEDIUM | 4 | Delivery | Stop completed without POD |
| `COD_SHORT` | HIGH | 2 | Delivery | COD collected < COD due |
| `BACKORDER_RISK` | MEDIUM | 8 | Orders | Order items on backorder > 3 days |
| `RECEIVING_DISCREPANCY` | HIGH | 4 | Receiving | Receiving line qty != PO line qty |
| `INVOICE_MISMATCH` | HIGH | 8 | Purchasing | Three-way match failure |
| `PRICE_MARGIN_RISK` | MEDIUM | 24 | Pricing | Margin below threshold after cost change |
| `PROMISE_DUE_TODAY` | MEDIUM | 8 | Collections | Promise to pay due date = today |
| `DISPUTE_OVERDUE` | HIGH | 4 | Collections | Dispute open > SLA target |
| `HOLD_WITH_URGENT_ORDER` | CRITICAL | 1 | Credit | Customer on hold with order due today |
| `UNAUTHORIZED_ACCESS` | CRITICAL | 1 | Security | Failed permission check on sensitive resource |
| `APPROVAL_OVERDUE` | MEDIUM | 4 | Approvals | Approval request past timeout |
| `IMPORT_BLOCKED` | HIGH | 4 | Bridge | Import batch below confidence threshold |
| `CYCLE_COUNT_VARIANCE` | MEDIUM | 8 | Yard | Count variance > acceptable threshold |

## Exception Priority Score Calculation
```
priorityScore = (severityWeight * 40) + (slaUrgency * 30) + (financialImpact * 20) + (customerImpact * 10)

Where:
  severityWeight: CRITICAL=4, HIGH=3, MEDIUM=2, LOW=1
  slaUrgency: (slaTarget - now) / slaTarget, inverted (closer to breach = higher)
  financialImpact: dollar value normalized 0-4
  customerImpact: key account=4, regular=2, new=1
```

---

# APPENDIX E: Approval Policies

## Required Approval Policies (11 policies)

| Policy | Action Type | Requester Roles | Approver Roles | Threshold | Timeout |
|--------|-----------|-----------------|----------------|-----------|---------|
| Price Override | `price_override` | COUNTER_SALES, OUTSIDE_SALES, PRICING | MANAGER, PRICING (>5% discount) | margin < 15% | 4h |
| Credit Release | `credit_release` | COLLECTIONS_REP, AR_MANAGER | MANAGER, CREDIT_MANAGER | balance > credit limit | 2h |
| Write-off | `writeoff` | AR_MANAGER | EXECUTIVE, CREDIT_MANAGER | amount > $500 | 24h |
| Inventory Adjustment | `inventory_adjustment` | YARD_MANAGER, YARD_WORKER | MANAGER | variance > 10% or > $1000 | 8h |
| AP Match Exception | `ap_match_exception` | AP_SUPPORT | MANAGER, FINANCE | variance > $100 | 8h |
| Truck Overload | `truck_overload_override` | DISPATCHER | MANAGER | weight > 110% capacity | 1h |
| Route Departure Exception | `route_departure_exception` | DISPATCHER | MANAGER | unresolved issues on route | 2h |
| Return Above Threshold | `return_approval` | COUNTER_SALES, CUSTOMER_SERVICE | MANAGER | amount > $500 | 4h |
| Vendor Claim Settlement | `vendor_claim_settlement` | PURCHASING | MANAGER | amount > $2000 | 24h |
| Import Batch Approval | `import_batch_approval` | SYSTEM (auto) | MANAGER, ADMIN | confidence < 0.85 | 8h |
| User Role Escalation | `role_escalation` | MANAGER | ADMIN | any temporary role grant | 2h |

---

# APPENDIX F: API Route Specification

## Route Groups and Endpoints

### Auth (`/api/auth`)
```
POST /api/auth/[...nextauth]          # NextAuth handler (login, callback, session)
POST /api/auth/forgot-password        # Send reset email
POST /api/auth/reset-password         # Reset with token
GET  /api/auth/session                # Get current session
```

### Users (`/api/users`)
```
GET    /api/users                     # List users (paginated, filterable)
POST   /api/users                     # Create user
GET    /api/users/:id                 # Get user detail
PATCH  /api/users/:id                 # Update user
DELETE /api/users/:id                 # Soft delete user
GET    /api/users/:id/roles           # Get user's role assignments
POST   /api/users/:id/roles           # Assign role to user
DELETE /api/users/:id/roles/:roleId   # Revoke role
GET    /api/users/me                  # Current user profile
PATCH  /api/users/me/preferences      # Update preferences
```
Auth: All endpoints require auth. User management requires `admin.manage_users`.

### Roles (`/api/roles`)
```
GET    /api/roles                     # List all roles
POST   /api/roles                     # Create role
GET    /api/roles/:id                 # Get role with permissions
PATCH  /api/roles/:id                 # Update role
DELETE /api/roles/:id                 # Delete non-system role
POST   /api/roles/:id/permissions     # Assign permissions
DELETE /api/roles/:id/permissions/:permId  # Remove permission
```
Auth: Requires `admin.manage_roles`.

### Feature Flags (`/api/feature-flags`)
```
GET    /api/feature-flags             # List all flags
POST   /api/feature-flags             # Create flag
GET    /api/feature-flags/:id         # Get flag with assignments
PATCH  /api/feature-flags/:id         # Update flag
POST   /api/feature-flags/:id/assignments  # Create assignment
DELETE /api/feature-flags/:id/assignments/:assignmentId
GET    /api/feature-flags/evaluate    # Evaluate all flags for current user
```
Auth: Requires `admin.manage_feature_flags`. Evaluate is any authenticated user.

### Approvals (`/api/approvals`)
```
GET    /api/approvals                 # List approval requests (filter by status)
POST   /api/approvals                 # Create approval request
GET    /api/approvals/:id             # Get request detail
POST   /api/approvals/:id/approve     # Approve (requires approver role)
POST   /api/approvals/:id/deny        # Deny (requires approver role)
POST   /api/approvals/:id/cancel      # Cancel (requester only)
GET    /api/approvals/policies        # List policies
POST   /api/approvals/policies        # Create policy
PATCH  /api/approvals/policies/:id    # Update policy
```

### Customers (`/api/customers`)
```
GET    /api/customers                 # List (paginated, search, filter by status/branch/rep/tags)
POST   /api/customers                 # Create
GET    /api/customers/:id             # Detail with 360 data
PATCH  /api/customers/:id             # Update
DELETE /api/customers/:id             # Soft delete
GET    /api/customers/:id/contacts    # List contacts
POST   /api/customers/:id/contacts    # Add contact
PATCH  /api/customers/:id/contacts/:cid  # Update contact
GET    /api/customers/:id/orders      # Order history
GET    /api/customers/:id/deliveries  # Delivery history
GET    /api/customers/:id/aging       # AR aging for customer
GET    /api/customers/:id/timeline    # Event timeline
GET    /api/customers/:id/communications  # Communication log
```

### Orders (`/api/orders`)
```
GET    /api/orders                    # List (paginated, filter by status/date/branch/customer/rep)
POST   /api/orders                    # Create order
GET    /api/orders/:id                # Detail with items + timeline
PATCH  /api/orders/:id                # Update order
DELETE /api/orders/:id                # Soft delete (only DRAFT/IMPORTED)
POST   /api/orders/:id/transition     # State transition { toStatus, reason? }
GET    /api/orders/:id/items          # List items
POST   /api/orders/:id/items          # Add item
PATCH  /api/orders/:id/items/:itemId  # Update item
DELETE /api/orders/:id/items/:itemId  # Remove item
GET    /api/orders/:id/timeline       # Event timeline
POST   /api/orders/:id/attachments    # Upload attachment
```
Side effects: State transitions trigger audit events, exception checks, Socket.io broadcast.

### Dispatch (`/api/dispatch`)
```
GET    /api/dispatch/board            # Order board (filter by date/status/zone/truck/readiness)
GET    /api/dispatch/trucks           # Truck list with current status + capacity
POST   /api/dispatch/trucks/:id/assign  # Assign orders to truck
GET    /api/dispatch/routes           # Route list (filter by date/status)
POST   /api/dispatch/routes           # Create route (truck, driver, date)
GET    /api/dispatch/routes/:id       # Route detail with stops
PATCH  /api/dispatch/routes/:id       # Update route
POST   /api/dispatch/routes/:id/stops/reorder  # Reorder stops { stopIds[] }
POST   /api/dispatch/routes/:id/release  # Release route for dispatch
POST   /api/dispatch/routes/:id/checklist  # Validate dispatch checklist
GET    /api/dispatch/carryover        # Delayed orders not yet dispatched
```

### Delivery (`/api/delivery`)
```
GET    /api/delivery/my-route         # Driver's current route + stops
GET    /api/delivery/stops/:id        # Stop detail (products, notes, instructions)
POST   /api/delivery/stops/:id/arrive # Mark arrived (GPS)
POST   /api/delivery/stops/:id/complete  # Complete stop { outcome, notes }
POST   /api/delivery/stops/:id/pod    # Upload POD { signature, photos, notes, gps }
POST   /api/delivery/stops/:id/cod    # Record COD { amount, paymentType, checkNumber }
POST   /api/delivery/stops/:id/escalate  # Escalate issue
POST   /api/delivery/location         # Update driver GPS location
GET    /api/delivery/summary          # Route summary for end-of-day
POST   /api/delivery/closeout         # End-of-day closeout
```

### Yard (`/api/yard`)
```
GET    /api/yard/tasks                # My tasks (filter by type/status/priority)
GET    /api/yard/tasks/:id            # Task detail
PATCH  /api/yard/tasks/:id            # Update task (start, complete, add notes)
POST   /api/yard/tasks/:id/photos     # Upload photos
GET    /api/yard/workload             # Workload board (manager view)
POST   /api/yard/tasks/assign         # Assign task to worker
GET    /api/yard/bays                 # Bay status
PATCH  /api/yard/bays/:id             # Update bay status
POST   /api/yard/damage               # Log damage
GET    /api/yard/cycle-counts         # List cycle counts
POST   /api/yard/cycle-counts         # Create cycle count
PATCH  /api/yard/cycle-counts/:id     # Submit count results
```

### Receiving (`/api/receiving`)
```
GET    /api/receiving                 # Expected receipts calendar
GET    /api/receiving/:id             # Receiving record detail with lines
POST   /api/receiving                 # Start receiving against PO
POST   /api/receiving/:id/lines/:lineId  # Receive line { qty, status, notes, photos }
POST   /api/receiving/:id/complete    # Complete receiving (triggers discrepancy check)
GET    /api/receiving/discrepancies   # Discrepancy queue
PATCH  /api/receiving/discrepancies/:id  # Resolve discrepancy
POST   /api/receiving/vendor-issues   # Create vendor issue
```

### Collections (`/api/collections`)
```
GET    /api/collections/aging         # Aging dashboard data
GET    /api/collections/accounts      # My accounts (collector view)
GET    /api/collections/accounts/:id  # Account detail
PATCH  /api/collections/accounts/:id  # Update account (status, notes, next action)
POST   /api/collections/accounts/:id/calls  # Log call
POST   /api/collections/accounts/:id/promises  # Create promise
PATCH  /api/collections/promises/:id  # Update promise status
POST   /api/collections/accounts/:id/disputes  # Create dispute
PATCH  /api/collections/disputes/:id  # Update dispute
POST   /api/collections/accounts/:id/payment-plans  # Create payment plan
GET    /api/collections/escalations   # Escalation queue
POST   /api/collections/accounts/:id/hold  # Recommend credit hold
POST   /api/collections/accounts/:id/release  # Release credit hold (approval required)
GET    /api/collections/performance   # Collector performance metrics
```

### Pricing (`/api/pricing`)
```
GET    /api/pricing/catalogue         # Product catalogue with pricing
GET    /api/pricing/cost-changes      # Cost change log
POST   /api/pricing/imports           # Upload vendor price file
GET    /api/pricing/imports/:id       # Import detail + preview
POST   /api/pricing/imports/:id/approve  # Approve price import
GET    /api/pricing/quotes-at-risk    # Open quotes affected by cost changes
GET    /api/pricing/history/:productId  # Price history for product
POST   /api/pricing/simulate          # Quote simulator { products, quantities }
```

### Purchasing (`/api/purchasing`)
```
GET    /api/purchasing/vendors        # Vendor directory
GET    /api/purchasing/vendors/:id    # Vendor detail + scorecard
POST   /api/purchasing/rfqs           # Create RFQ
GET    /api/purchasing/rfqs/:id       # RFQ detail with responses
POST   /api/purchasing/rfqs/:id/compare  # Compare vendor responses
POST   /api/purchasing/pos            # Create PO
GET    /api/purchasing/pos/:id        # PO detail
PATCH  /api/purchasing/pos/:id        # Update PO
GET    /api/purchasing/match          # Three-way match queue
POST   /api/purchasing/match/:id/resolve  # Resolve match exception
GET    /api/purchasing/claims         # Vendor claims
POST   /api/purchasing/claims         # Create claim
```

### CRM (`/api/crm`)
```
GET    /api/crm/leads                 # Lead pipeline
POST   /api/crm/leads                 # Create lead
PATCH  /api/crm/leads/:id            # Update lead (status, notes)
GET    /api/crm/estimates             # Estimate list
POST   /api/crm/estimates             # Create estimate
GET    /api/crm/estimates/:id         # Estimate detail
PATCH  /api/crm/estimates/:id         # Update estimate
POST   /api/crm/estimates/:id/pdf     # Generate estimate PDF
GET    /api/crm/follow-ups            # Follow-up queue
GET    /api/crm/dormant               # Dormant accounts
GET    /api/crm/cross-sell            # Cross-sell opportunities
```

### Imports (`/api/imports`)
```
POST   /api/imports/upload            # Upload import file
GET    /api/imports                   # Import history
GET    /api/imports/:id               # Import detail + row-level review
POST   /api/imports/:id/map           # Apply field mapping
POST   /api/imports/:id/approve       # Approve import
POST   /api/imports/:id/reject        # Reject import
GET    /api/imports/:id/diff          # Side-by-side diff
GET    /api/imports/reconciliation    # Reconciliation dashboard
GET    /api/imports/templates         # Mapping templates
POST   /api/imports/templates         # Save mapping template
```

### Search (`/api/search`)
```
GET    /api/search?q=term             # Universal search across all entities
GET    /api/search/recent             # Recent items for current user
POST   /api/search/pin                # Pin a record
```

### Reports (`/api/reports`)
```
GET    /api/reports/:type             # Get report data { type, dateFrom, dateTo, locationId }
GET    /api/reports/:type/export      # Export report as CSV/PDF
```
Types: `on-time-delivery`, `route-profitability`, `order-cycle-time`, `pickup-wait-time`, `receiving-discrepancy-rate`, `vendor-fill-rate`, `price-change-impact`, `collector-performance`, `promise-kept-rate`, `estimate-conversion`, `dormant-recovery`, `damage-frequency`, `cycle-count-accuracy`, `approval-turnaround`, `role-usage-audit`, `feature-adoption`

### Audit (`/api/audit`)
```
GET    /api/audit                     # Audit events (filter by actor/entity/action/date)
GET    /api/audit/entity/:type/:id    # Timeline for specific entity
GET    /api/audit/security            # Security events
```

### Exceptions (`/api/exceptions`)
```
GET    /api/exceptions                # Exception queue (filter by category/severity/status/owner)
GET    /api/exceptions/:id            # Exception detail
PATCH  /api/exceptions/:id            # Update (acknowledge, assign, resolve, escalate)
GET    /api/exceptions/summary        # Dashboard summary counts
```

### Daily Close (`/api/daily-close`)
```
GET    /api/daily-close/:date         # Daily close data for date
POST   /api/daily-close/:date/run     # Trigger daily close process
GET    /api/daily-close/:date/report  # Daily close report
```

### Health (`/api/health`)
```
GET    /api/health                    # Health check (no auth)
```

---

# APPENDIX G: Order State Machine Transitions

```
DRAFT           -> IMPORTED, NEEDS_REVIEW, APPROVED, CANCELLED
IMPORTED        -> NEEDS_REVIEW, APPROVED, CANCELLED
NEEDS_REVIEW    -> APPROVED, ON_CREDIT_HOLD, CANCELLED
APPROVED        -> ON_CREDIT_HOLD, WAITING_INVENTORY, PARTIALLY_READY, READY, CANCELLED
ON_CREDIT_HOLD  -> APPROVED (requires credit release approval)
WAITING_INVENTORY -> PARTIALLY_READY, READY, CANCELLED, RESCHEDULED
PARTIALLY_READY -> READY, WAITING_INVENTORY, CANCELLED, RESCHEDULED
READY           -> LOADING, PICKUP_READY, CANCELLED, RESCHEDULED
LOADING         -> LOADED, READY (unload)
LOADED          -> DISPATCHED
DISPATCHED      -> OUT_FOR_DELIVERY
OUT_FOR_DELIVERY -> DELIVERED, REFUSED, RESCHEDULED
DELIVERED       -> CLOSED
PICKUP_READY    -> PICKED_UP, CANCELLED
PICKED_UP       -> CLOSED
REFUSED         -> RESCHEDULED, CANCELLED, CLOSED
RESCHEDULED     -> APPROVED (re-enters flow)
CANCELLED       -> (terminal)
CLOSED          -> (terminal)
```

### Transition Side Effects
| Transition | Side Effects |
|-----------|-------------|
| -> ON_CREDIT_HOLD | Create exception, notify dispatcher, notify collections |
| -> READY | Notify dispatcher, update dispatch board (Socket.io) |
| -> DISPATCHED | Create driver notification, update route, audit event |
| -> OUT_FOR_DELIVERY | Start GPS tracking, notify customer (SMS if enabled) |
| -> DELIVERED | Require POD, update route progress, check COD |
| -> REFUSED | Create exception, notify dispatcher, create yard return task |
| -> CANCELLED | Restore inventory reservations, audit event, notify stakeholders |

---

# APPENDIX H: Socket.io Event Definitions

## Rooms (channels)
```
dispatch:${locationId}           # Dispatch board updates
route:${routeId}                 # Route-specific updates
driver:${userId}                 # Driver-specific messages
yard:${locationId}               # Yard task updates
pickup:${locationId}             # Pickup queue updates
command-center:${locationId}     # Command center live feed
notifications:${userId}          # User-specific notifications
```

## Events
```
// Dispatch
order:status-changed      { orderId, oldStatus, newStatus, locationId }
order:assigned-to-truck    { orderId, truckId, routeId, locationId }
route:updated              { routeId, changes, locationId }
truck:status-changed       { truckId, status, locationId }

// Delivery
stop:status-changed        { stopId, routeId, status, outcome?, locationId }
driver:location-updated    { driverId, lat, lng, timestamp }
route:progress-updated     { routeId, completedStops, totalStops }

// Yard
task:assigned              { taskId, assigneeId, locationId }
task:completed             { taskId, locationId }
bay:status-changed         { bayId, status, locationId }

// Pickup
pickup:status-changed      { ticketId, status, locationId }
pickup:customer-arrived    { ticketId, locationId }

// Command Center
exception:created          { exceptionId, category, severity, locationId }
exception:resolved         { exceptionId, locationId }
activity:new               { event, locationId }  // live feed

// Notifications
notification:new           { id, title, body, type, entityType?, entityId?, userId }
```

---

# APPENDIX I: Required Documentation File Outlines

## What Each Phase 0 Doc Must Contain

### docs/PLAN.md
- Overall build phases (0-13) with goals
- Current phase indicator
- Module order with dependencies graph
- Immediate next tasks (top 10)
- Decision log references
- Risk references

### docs/PROGRESS.md
- Phase completion status table
- Current sprint/focus
- Completed tasks (date-stamped)
- Active tasks with owners
- Blockers
- Known gaps
- Date of last update

### docs/DECISIONS.md
- Architecture decisions (Next.js App Router, Prisma, shadcn/ui, etc.)
- Schema decisions (soft deletes, UUID PKs, multi-location, audit trail)
- Auth decisions (NextAuth JWT, RBAC, session timeout)
- Infra decisions (PostgreSQL, Redis, S3)
- Tradeoffs (App Router vs Pages Router, Prisma vs Drizzle, etc.)
- Rejected alternatives with reasoning

### docs/DATA-MODEL.md
- Complete entity list (from Appendix A)
- Field definitions for each entity
- Relationships diagram (text-based)
- Lifecycle notes per entity
- Indexing strategy (which fields need indexes)
- Soft delete rules
- Multi-location scoping rules

### docs/API-SPECS.md
- Complete route catalog (from Appendix F)
- Request/response shapes per endpoint
- Validation rules per endpoint
- Auth requirements per endpoint
- Scope rules per endpoint
- Side effects (audit events, notifications, Socket.io broadcasts)
- Idempotency requirements for imports

### docs/RISKS.md
- Technical: ERP data quality, import reliability, offline sync complexity
- Operational: user adoption, training, parallel running period
- Rollout: branch-by-branch enablement, feature flag management
- Migration: no data migration (greenfield), but import reliability
- Data quality: duplicate detection, confidence scoring
- Mitigation plan for each risk

### docs/PERMISSIONS-MATRIX.md
- Complete permission catalog (from Appendix B)
- Role-to-permission mapping table
- Scope restrictions per role
- Field-level visibility rules
- Approval-required actions cross-reference

### docs/APPROVAL-POLICIES.md
- Complete policy catalog (from Appendix E)
- Requester/approver role mapping
- Threshold rules
- Timeout and escalation rules
- Audit requirements

### docs/EVENT-BACKBONE.md
- Complete event catalog (from Appendix C)
- Producer-consumer mapping
- Event retention rules (keep all audit events indefinitely)
- Timeline behavior per entity type
- Notification triggers per event

### docs/EXCEPTION-MODEL.md
- Complete category catalog (from Appendix D)
- Severity definitions
- SLA rules per category
- Queue ownership rules
- Resolution states
- Escalation paths
- Priority score calculation

### docs/ROLLOUT-PLAN.md
- Module rollout order (follows phase order)
- Pilot users per module (by role)
- Pilot branch (single branch first)
- Training notes per role
- Cutover risks and fallback plans
- Feature flag enablement sequence

### docs/TEST-STRATEGY.md
- Unit tests: service layer functions, state machine transitions, validators
- Integration tests: API routes end-to-end with database
- Workflow tests: multi-step business flows (order -> dispatch -> deliver -> close)
- Role/permission tests: every role x every action matrix
- Audit tests: every auditable action produces correct events
- Import tests: each import type with valid/invalid/edge-case data
- Mobile tests: driver PWA offline/online transitions, GPS, photo capture

---

# APPENDIX J: Seed Data Plan

## Realistic Building Supply Sample Data

### Locations (2)
- Express Lumber - Main Yard (primary, NYC metro)
- Express Lumber - South Branch (secondary)

### Users (18 users, one per role)
- Admin, General Manager, Branch Manager, 2 Dispatchers, Yard Manager, 2 Yard Workers, 2 Drivers, Counter Sales, Outside Sales, Collections Rep, AR Manager, Purchasing, Receiving Clerk, AP Support, Systems Admin

### Customers (25)
- Mix of: commercial contractors (10), residential builders (5), government (2), handyman/small (8)
- Various credit statuses: active, on hold, COD only
- Realistic names like "Martinez Construction", "Oak Hill Builders", "City Parks Dept"

### Products (50)
- Lumber: 2x4, 2x6, 2x8, 2x10, 2x12 (various lengths and species)
- Plywood: CDX, BC, AC, OSB (4x8 sheets)
- Treated lumber, deck boards
- Doors: interior, exterior, storm
- Trim: baseboards, crown molding, casing
- Hardware: nails, screws, brackets, hangers
- Roofing: shingles, felt, flashing
- Realistic SKUs, costs, sell prices, margins

### Orders (30)
- Mix of statuses across the full lifecycle
- Various types: delivery, pickup, will call
- Some with credit holds, backorders, exceptions
- Range of sizes from small pickup to full truck loads

### Trucks (5)
- Flatbed 48', Flatbed 24', Box truck, Boom truck, Pickup

### Routes (5)
- Various statuses: planning, dispatched, in progress, completed

### Collections (10 accounts)
- Various aging: current, 30-day, 60-day, 90-day, 120+
- Some with promises, disputes, payment plans
