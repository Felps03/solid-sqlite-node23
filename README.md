# Node.js 23 SQLite PoC

This Proof of Concept (PoC) demonstrates experimental features of Node.js 23 using its native synchronous SQLite API (DatabaseSync). The project is organized following SOLID principles and includes:

- **Native Synchronous SQLite:** Uses `DatabaseSync` from `node:sqlite` to interact with SQLite without external SQLite packages.
- **Modular Architecture:** Organized into configuration, models, validators, repositories, controllers, routes, and middlewares.
- **Environment Configuration:** Uses `dotenv` to manage environment variables.
- **Logging:** Integrated logging with Winston.
- **Native Testing:** Uses Node.js's built-in `node:test` module and the global `fetch` API for endpoint testing.

## Getting Started

### Prerequisites

- **Node.js 23** (or higher) is required.
- Clone the repository and navigate to the project root.

### Installation

Install dependencies:
```bash
npm install
# solid-sqlite-node23
