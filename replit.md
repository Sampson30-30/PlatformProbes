# Learning Platform Portfolio

## Overview

This is a portfolio website showcasing Alex's learning platform development services. The application demonstrates interactive educational components and enables self-service pricing for custom learning module development. Built as a full-stack React application, it serves as both a business showcase and a working demonstration of educational component capabilities.

The platform targets organizations and content creators who need professional, React-based learning modules but want to understand pricing and capabilities before engaging in consultations. The site reduces unpaid consultation time by clearly demonstrating value propositions and enabling self-service cost calculation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query for server state and React useState for local component state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints with structured JSON responses
- **Data Validation**: Zod schemas for runtime type validation and API contract enforcement
- **Error Handling**: Centralized error handling middleware with structured error responses

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL (configured via Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Development Storage**: In-memory storage implementation for development/demo purposes
- **Production Storage**: PostgreSQL with connection pooling via Neon serverless

### Component Library Architecture
The application features a sophisticated component library for educational content:
- **Interactive Components**: Quiz components with scoring and feedback systems
- **Reflection Tools**: Journal components with auto-save and word counting
- **Content Explorers**: Tabbed interfaces and grid explorers for content navigation
- **Comparison Tools**: Spectrum visualizations for comparing different items or concepts
- **Timeline Components**: Historical or process-based content display
- **Pricing Calculator**: Interactive cost estimation based on component selection

### Development and Build System
- **Build Tool**: Vite for fast development server and optimized production builds
- **TypeScript**: Strict type checking with path mapping for clean imports
- **Development**: Hot module replacement and runtime error overlay for development efficiency
- **Production Build**: Separate client and server builds with ESBuild for server bundling

### Authentication and Session Management
- **Session Storage**: Connect-pg-simple for PostgreSQL-based session management
- **Security**: Prepared for authentication implementation with user schema defined

## External Dependencies

### Database and Storage
- **Neon Database**: PostgreSQL serverless database hosting
- **Drizzle ORM**: Type-safe database operations and migrations
- **Connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **Radix UI**: Accessibility-focused UI primitives for consistent component behavior
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library for UI elements
- **Embla Carousel**: Carousel functionality for component showcases

### Development and Build Tools
- **Vite**: Fast development server and build tool with React plugin
- **ESBuild**: Fast JavaScript bundler for server-side code
- **TypeScript**: Type checking and development tooling
- **Replit Integration**: Development environment integration with error overlays and cartographer

### Form and Data Management
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **TanStack Query**: Server state management with caching and synchronization
- **Date-fns**: Date manipulation and formatting utilities

### Communication and Notifications
- **Toast Notifications**: User feedback system for form submissions and interactions
- **Email Integration**: Prepared for contact form email delivery (implementation pending)

The architecture prioritizes developer experience with type safety, fast development iteration, and clear separation of concerns between client and server code. The component library is designed to be easily customizable and reusable across different educational contexts.