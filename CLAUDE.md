# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Textock is a React-based template management application that allows users to create, organize, and reuse text templates with dynamic variables. The app supports user authentication, categorization, tagging, and template sharing functionality.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Environment Setup
The application requires these environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Architecture

### Core Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with dark mode support (`class` strategy)
- **Backend**: Supabase (authentication + PostgreSQL database)
- **Forms**: React Hook Form
- **Icons**: Lucide React

### Key Architectural Patterns

#### Hook-Based State Management
The app uses custom hooks for state management:
- `useAuth()` - Handles authentication state, sign in/up/out operations
- `useTemplates()` - Manages template CRUD operations and local state
- `useDarkMode()` - Manages theme switching with localStorage persistence

#### Template Variable System
Templates support dynamic variables using `{{variableName}}` syntax:
- `extractVariables()` - Parses template content to find variables
- `replaceVariables()` - Substitutes variables with user-provided values
- `validateTemplate()` - Validates template syntax and variable formatting

#### Component Organization
```
src/
├── components/
│   ├── auth/         # Authentication forms
│   ├── layout/       # Header and layout components
│   ├── templates/    # Template-specific components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and API clients
└── types/            # TypeScript type definitions
```

### Database Schema
The app uses a single `templates` table with:
- Row Level Security (RLS) enabled
- User-based access control policies
- Automatic `updated_at` timestamp updates
- JSONB field for variable definitions
- Support for categorization, tagging, and public sharing

### State Flow
1. Authentication state managed by `useAuth` hook
2. Templates fetched and cached by `useTemplates` hook
3. Template variables extracted automatically when content changes
4. All database operations go through Supabase client with error handling

## Development Notes

### Japanese Interface
The application interface is primarily in Japanese. Error messages, validation text, and UI labels use Japanese text.

### Variable Validation
Template variables must follow strict formatting:
- Use double curly braces: `{{variableName}}`
- No empty variables: `{{}}` is invalid
- Single braces `{variable}` are invalid
- The validation system provides detailed error messages for malformed variables

### Authentication Flow
- Sign up disabled email confirmation for development
- Auth state changes are logged for debugging
- User sessions persist across browser refreshes
- Sign out clears all client-side state

### Theme System
Dark mode is implemented using Tailwind's `class` strategy. The `useDarkMode` hook manages theme state and applies the `dark` class to the document element.