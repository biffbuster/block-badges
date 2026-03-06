<p align="center">
  <img src="public/logos/block_badges.png" alt="Block Badges" width="280" />
</p>

<h1 align="center">Block Badges</h1>

<p align="center">
  <strong>ZK-verified on-chain achievement badges for your wallet history</strong>
</p>

<p align="center">
  Connect your wallet. Prove your on-chain history. Collect soulbound badges.
  <br />
  Every badge is verified with a <strong>Zero-Knowledge Proof</strong> powered by
  <a href="https://www.spaceandtime.io/">Space and Time's Proof of SQL</a> — no trust required.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/chain-Base%20Mainnet-blue" alt="Base Mainnet" />
  <img src="https://img.shields.io/badge/verification-ZK%20Proof%20of%20SQL-purple" alt="ZK Verified" />
  <img src="https://img.shields.io/badge/tokens-Soulbound%20ERC--721-orange" alt="Soulbound" />
  <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js 14" />
</p>

---

## Collect Badges

<p align="center">
  <img src="public/cards/diamond_hands.png" alt="Diamond Hands" width="180" />
  <img src="public/cards/gas_guzzler.png" alt="Gas Guzzler" width="180" />
  <img src="public/cards/eth_steak.png" alt="The Validator" width="180" />
  <img src="public/cards/whale_activity.png" alt="Whale Activity" width="180" />
</p>


---

## How It Works

```
Connect Wallet  ──>  Query Blockchain Data  ──>  ZK Proof Verifies  ──>  Soulbound Badge Minted
                         (Space and Time)         (Proof of SQL)           (Base Mainnet)
```

1. **Connect** your wallet via Privy (supports email, wallet, Google, Twitter)
2. **Browse** the badge collection — each badge has unique on-chain requirements
3. **Pre-check** eligibility — the app queries SXT's indexed blockchain data off-chain (free + fast)
4. **Verify on-chain** — submit an on-chain query to SXT's Query Router on Base. A ZK-SNARK (Proof of SQL) cryptographically proves the query result is correct
5. **Collect** — if qualified, a soulbound ERC-721 (SBT) is automatically minted to your wallet

No centralized server decides if you qualify. The proof is trustless and verifiable by anyone.

---

## Badge Tiers

| Tier | Difficulty | Example |
|------|-----------|---------|
| **Tier 1** | Beginner | Ethereum Villager — 5+ transactions |
| **Tier 2** | Easy | Gas Guzzler — 10+ ETH spent on gas |
| **Tier 3** | Intermediate | Multichain Maximalist — active on 5+ chains |
| **Tier 4** | Hard | Diamond Hands — held BTC for 3+ years |
| **Tier 5** | Veteran | Whale Activity — hold 100+ ETH |

Badges span Ethereum, Base, Polygon, Arbitrum, Optimism, and more.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Animations** | Framer Motion, GSAP (scroll-driven) |
| **Auth & Wallet** | Privy (email/wallet/social), wagmi, viem |
| **Database** | PostgreSQL (Neon serverless) + Prisma ORM |
| **ZK Verification** | Space and Time Proof of SQL SDK (WASM) |
| **On-Chain** | Solidity (Foundry), Base Mainnet, Soulbound ERC-721 |
| **SXT Contracts** | Query Router, ZKpay Executor on Base |

---

## Run Locally

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **PostgreSQL** database (or a free [Neon](https://neon.tech) account)
- **Space and Time** API key — [console.spaceandtime.io](https://console.spaceandtime.io)
- **Privy** app ID — [privy.io](https://www.privy.io/)
- **WalletConnect** project ID — [cloud.walletconnect.com](https://cloud.walletconnect.com)

### 1. Clone the repo

```bash
git clone https://github.com/biffbuster/block-badges.git
cd block-badges
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Server-only secrets (NEVER prefix with NEXT_PUBLIC_)
SXT_API_KEY=your_sxt_api_key
DATABASE_URL=your_postgres_connection_string
MINTER_PRIVATE_KEY=0xYourPrivateKey
BASE_RPC_URL=https://mainnet.base.org

# Deployed contract addresses (fill after deployment)
BLOCK_BADGE_ADDRESS=
BADGE_VERIFIER_ADDRESS=

# Basescan API key (for contract verification)
BASESCAN_API_KEY=

# Client-safe public values
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_SXT_TOKEN_ADDRESS=0xE6Bfd33F52d82Ccb5b37E16D3dD81f9FFDAbB195
NEXT_PUBLIC_QUERY_ROUTER_ADDRESS=0x220a7036a815a1Bd4A7998fb2BCE608581fA2DbB
```

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to your database
npm run db:push
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Smart Contracts

Built with [Foundry](https://book.getfoundry.sh/) and deployed on **Base Mainnet**.

| Contract | Description |
|----------|-------------|
| **BlockBadge.sol** | Soulbound ERC-721 SBT. Non-transferable. Only the BadgeVerifier can mint. |
| **BadgeVerifier.sol** | Submits SQL queries to SXT Query Router, receives ZK-proven callbacks, auto-mints SBTs when verified. |

### SXT Protocol Addresses (Base Mainnet)

| Contract | Address |
|----------|---------|
| SXT Query Router | `0x220a7036a815a1Bd4A7998fb2BCE608581fA2DbB` |
| SXT Token | `0xE6Bfd33F52d82Ccb5b37E16D3dD81f9FFDAbB195` |

### Deploy Contracts

If you want to deploy your own instance:

```bash
cd contracts
forge install
forge build
forge script script/DeployBadgeVerifier.s.sol --rpc-url base --broadcast
```

---

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes (check-achievement, mint, sync, metadata)
│   ├── dashboard/              # Badge grid, card detail, how-it-works
│   └── page.tsx                # Landing page
├── components/
│   ├── landing/                # Hero, Features, HowItWorks, Showcase, FAQ
│   ├── layout/                 # Header, Footer
│   └── providers/              # Privy + wagmi provider
├── hooks/
│   ├── useCheckAchievement.ts  # Off-chain pre-check via SXT SDK
│   └── useVerifyBadgeOnChain.ts # On-chain ZK verification
├── lib/
│   ├── achievements.ts         # Badge definitions + SQL templates
│   ├── contract.ts             # Viem clients, ABIs, addresses
│   ├── evaluators.ts           # Result evaluation per badge
│   ├── db.ts                   # Prisma client
│   └── sxt.ts                  # SXT SDK client (server-only)
└── types/                      # TypeScript declarations

contracts/
├── src/
│   ├── BlockBadge.sol          # Soulbound ERC-721
│   └── BadgeVerifier.sol       # On-chain ZK verification
└── script/                     # Foundry deploy scripts
```

---

## Verification Flow

```
┌─────────────────────────────────────────────────────────┐
│                        USER                             │
│  1. Connect wallet                                      │
│  2. Click "Verify On-Chain"                             │
│  3. Approve SXT token spend (~100 SXT)                  │
│  4. Submit verification tx                              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       v
┌──────────────────────────────────────────────────────────┐
│                  BADGE VERIFIER (Base)                    │
│  - Receives user's wallet + badge type                   │
│  - Forwards SQL query to SXT Query Router                │
│  - Deposits SXT payment                                  │
└──────────────────────┬───────────────────────────────────┘
                       │
                       v
┌──────────────────────────────────────────────────────────┐
│             SXT QUERY ROUTER + EXECUTOR                   │
│  - Executes SQL against indexed blockchain data           │
│  - Generates ZK-SNARK (Proof of SQL)                     │
│  - Calls back BadgeVerifier.queryCallback()              │
└──────────────────────┬───────────────────────────────────┘
                       │
                       v
┌──────────────────────────────────────────────────────────┐
│               CALLBACK → MINT                             │
│  - BadgeVerifier checks if result meets threshold         │
│  - If qualified → mints soulbound SBT to wallet          │
│  - ~23 SXT consumed, ~77 SXT refunded                    │
└──────────────────────────────────────────────────────────┘
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |

---

## Supported Chains

Block Badges queries indexed blockchain data across:

- Ethereum
- Base
- Polygon
- Arbitrum
- Optimism
- ZKsync
- Avalanche
- Bitcoin
- Sui
- Aptos

---

## License

MIT

---

<p align="center">
  <strong>Verified through Proof of SQL</strong>
  <br />
  <sub>Built with <a href="https://www.spaceandtime.io/">Space and Time</a> | Deployed on <a href="https://base.org/">Base</a></sub>
</p>
