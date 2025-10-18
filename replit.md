# Fertilizer Supply-Chain Dashboard

## Overview

This is a data analytics dashboard for tracking fertilizer supply and demand across Indian states. The application displays fertilizer availability, requirements, and trends through interactive tables, charts, and metrics cards. It provides insights into critical shortages, top required fertilizers, and state-wise distribution patterns.

The system serves as a utility-focused dashboard prioritizing data clarity and efficiency over visual flourishes, following design inspirations from Linear, Notion, and Vercel Analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component System**: shadcn/ui components built on Radix UI primitives, providing accessible, customizable components with consistent styling through Tailwind CSS.

**Routing**: Wouter for lightweight client-side routing (single-page application with dashboard as the main route).

**State Management**: 
- TanStack Query (React Query) for server state management, data fetching, and caching
- React hooks for local component state
- Theme context for dark/light mode toggling

**Styling Approach**:
- Tailwind CSS with custom design tokens defined in CSS variables
- Component-level styling using `cn()` utility (clsx + tailwind-merge)
- Design system following the "New York" style from shadcn/ui
- Custom color palette focused on agricultural green as primary color
- Responsive design with mobile breakpoints

**Data Visualization**:
- Recharts for line charts showing fertilizer trends over time
- TanStack Table for advanced data tables with sorting, filtering, and pagination
- Custom metrics cards for high-level KPIs

**Key Design Decisions**:
- No traditional backend authentication - uses in-memory storage with session-based user management (prepared schema exists but not currently implemented)
- Single-page dashboard approach rather than multi-page navigation
- Data-first design emphasizing information density and scannability
- Theme toggle for accessibility (light/dark modes)

### Backend Architecture

**Server Framework**: Express.js running on Node.js

**API Design**: RESTful API endpoints for fertilizer data retrieval:
- `/api/fertilizer/data` - Main data endpoint with filtering support (state, product, year, month)
- `/api/fertilizer/metrics` - Dashboard-level aggregated metrics
- `/api/fertilizer/top-required` - Top 5 most required fertilizers
- `/api/fertilizer/least-available` - Top 5 least available fertilizers
- `/api/fertilizer/trends/:product` - Monthly trends for specific products

**Data Storage**: 
- In-memory storage implementation (`MemStorage` class)
- Static fertilizer dataset imported from shared module
- No persistent database currently used (Drizzle ORM configured for PostgreSQL but database schema only defines users table)

**Development Setup**:
- Vite middleware integration for hot module replacement in development
- Custom request logging middleware
- Error handling middleware with status code propagation

**Rationale for In-Memory Storage**:
- Dataset is static and doesn't require real-time updates
- Eliminates database setup complexity for a dashboard focused on data visualization
- Fast query performance for filtering and aggregations
- Database migration path available through Drizzle ORM when persistence is needed

### External Dependencies

**Database**: 
- PostgreSQL (via Neon serverless) configured but not actively used
- Drizzle ORM for database schema definition and migrations
- Connection string expected via `DATABASE_URL` environment variable

**UI Libraries**:
- Radix UI - Unstyled, accessible component primitives (@radix-ui/react-*)
- Recharts - Composable charting library for React
- TanStack Table - Headless UI for building powerful tables
- Lucide React - Icon library

**Form & Validation**:
- React Hook Form for form state management (@hookform/resolvers)
- Zod for runtime type validation and schema definition
- Drizzle-Zod for generating Zod schemas from database models

**Styling & Theming**:
- Tailwind CSS for utility-first styling
- class-variance-authority for managing component variants
- date-fns for date formatting and manipulation

**Development Tools**:
- TypeScript for type safety across frontend and backend
- ESBuild for production builds (backend bundling)
- Replit plugins for development environment integration

**Session Management**:
- connect-pg-simple for PostgreSQL-backed session storage (configured but sessions not implemented in current routes)

**Third-Party Services**:
- Google Fonts (Inter font family) loaded via CDN
- No external API integrations currently

**Key Architectural Trade-offs**:
- Static data over dynamic database queries - simpler deployment, no DB costs, but limited to pre-loaded dataset
- In-memory filtering over database queries - faster for small datasets but won't scale to millions of records
- Session infrastructure prepared but not utilized - authentication can be added without architectural changes
- Shared schema types between client and server - type safety across boundaries but requires build coordination