# Cerebro Empresarial IA

Una plataforma de inteligencia artificial empresarial diseñada para convertirse en el principal asesor, analista, secretario, coordinador y sistema de automatización de una empresa.

## Architecture
- **Hexagonal Architecture**: Strict separation between Domain, Application, and Infrastructure.
- **Modular Monolith**: Organized by business modules.
- **Clean Code**: SOLID, DRY, KISS, YAGNI.

## Tech Stack
### Backend
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- Zod for validation
- AI Adapters (OpenAI, Gemini, Anthropic)

### Frontend
- React + Vite + TypeScript
- TailwindCSS
- React Query + Axios
- Zustand for state management

## Business Modules
- **Auth** - User registration, login, RBAC
- **Memory** - Enterprise memory (operational, strategic, learning)
- **Agents** - Multi-agent coordination
- **Simulation** - Strategic scenario simulation
- **DB Analyzer** - Automatic database discovery & query generation
- **Automation** - Rule-based business process automation
- **Communication** - Omnichannel messaging

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation
1. Clone the repository.
2. Setup Backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npx prisma generate
   npx prisma db push
   ```
3. Setup Frontend:
   ```bash
   cd frontend
   npm install
   ```

## Development
- Run Backend: `npm run dev` (from backend folder)
- Run Frontend: `npm run dev` (from frontend folder)
