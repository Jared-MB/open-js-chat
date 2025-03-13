# OpenJS Chat

OpenJS Chat is a monorepo built using Turborepo, featuring a **Next.js** client and a **NestJS** server. This project provides on open source chat application thinking in a easily adaptability to your needs.

## Monorepo Structure

```
OpenJS-Chat/
├── apps/
│   ├── chat/     # Next.js frontend
│   ├── server/   # NestJS backend
├── packages/     # Shared packages
├── .turbo/       # Turborepo cache
├── package.json  # Monorepo package manager config
├── turbo.json    # Turborepo configuration
└── README.md     # Documentation
```

## Tech Stack

### [Frontend (Client)](https://github.com/Jared-MB/open-js-chat/tree/main/apps/chat)
- **Framework:** [Next.js 15](https://nextjs.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- **WebSockets:** [Socket.io-client](https://socket.io/docs/v4/client-api/)

### [Backend (Server)](https://github.com/Jared-MB/open-js-chat/tree/main/apps/server)
- **Framework:** [NestJS](https://nestjs.com)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **WebSockets:** [Socket.io](https://socket.io/docs/v4/server-api/)

## Setup & Installation

### Prerequisites
Ensure you have the following installed:
- Node.js @^20
- [pnpm](https://pnpm.io/installation)

### Installation
Clone the repository and install dependencies:

```sh
git clone https://github.com/Jared-MB/open-js-chat.git
cd open-js-chat

pnpm install
```

> [!IMPORTANT]
> Each application has its own `README.md` for setup and configuration instructions.

### Running the Applications

#### Development Mode
To run **ALL** the applications in development mode, use the following commands:

```sh
pnpm dev  # Runs all apps in development mode
```

> [!NOTE]
> **RECOMMENDED**: Use the `dev` command to run all apps in development mode. This ensures that all apps are built and run together, making development easier and faster.


#### Client (Next.js)
```sh
pnpm dev:client  # Runs the Next.js frontend
```

#### Server (NestJS)
```sh
pnpm dev:server  # Runs the NestJS backend
```

## Deployment

### Client
- Vercel (for excellent integrations with Next.js/Turborepo)

### Server
- Railway (or any other hosting provider)

## License

This project is licensed under the MIT License.

