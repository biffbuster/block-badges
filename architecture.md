# System Architecture

## Flow
User → Connect Wallet → Souve API → SXT Query → ZK Proof → Unlock Badge → Optional: Mint SBT

## Services
- **Web**: Next.js frontend
- **API**: Next.js route handlers
- **SXT**: Space and Time queries + proofs
- **DB**: Achievement definitions, user unlocks, proofs
- **Contracts**: Badge SBTs, protocol airdrop verifiers

## Data Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser    │────▶│  Next.js API     │────▶│  Space and Time │
│  (wagmi +   │     │  Route Handlers  │     │  Proof of SQL   │
│  RainbowKit)│◀────│                  │◀────│  ZK-SNARK Engine│
└─────────────┘     └──────┬───────────┘     └─────────────────┘
                           │
                           ▼
                    ┌──────────────┐     ┌──────────────────┐
                    │  PostgreSQL  │     │  Base Sepolia     │
                    │  (Prisma)   │     │  SBT Contracts    │
                    │  - users    │     │  - BadgeSBT.sol   │
                    │  - unlocks  │     │  - Verifier.sol   │
                    │  - proofs   │     └──────────────────┘
                    └──────────────┘
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/check-achievement` | POST | Verify a badge via SXT Proof of SQL |
| `/api/achievements` | GET | List all available achievements |
| `/api/unlocks/[wallet]` | GET | Get unlocked badges for a wallet |
| `/api/mint` | POST | Initiate SBT mint for unlocked badge |

## Database Schema (Prisma)

```
User
  - wallet (unique, indexed)
  - createdAt

Achievement
  - id (slug)
  - name, description, icon, tier
  - chain, query template
  - points

Unlock
  - userId → User
  - achievementId → Achievement
  - proof (JSON — SXT ZK proof blob)
  - qualified (bool)
  - verifiedAt
  - txHash (optional — SBT mint tx)

ProofLog
  - wallet, achievementId
  - sql executed
  - raw result (JSON)
  - proof blob
  - duration (ms)
  - createdAt
```

## Security Boundaries

```
Client (Browser)                    Server (Node.js)
─────────────────                   ────────────────
wallet address      ──────────▶     SXT_API_KEY (env)
achievementId       ──────────▶     SQL injection via template
                                    ZK proof verification
                                    DB writes (Prisma)
                                    SBT mint signing
```

- SXT API key never leaves the server
- Wallet addresses validated with regex before SQL injection
- SQL templates are hardcoded — user cannot pass arbitrary SQL
- ZK proofs stored for auditability
- SBT minting gated by proof existence in DB

## Contract Architecture (Base Sepolia)

```
BadgeSBT.sol (ERC-1155 Soulbound)
  - mint(address to, uint256 badgeId, bytes proof)
  - soulbound: transfers disabled
  - only Souve backend can mint (onlyMinter role)

AirdropVerifier.sol
  - verifyBadge(address user, uint256 badgeId) → bool
  - protocols call this to check if user holds a badge
  - reads from BadgeSBT balanceOf
```

## Environments

| Env | Chain | DB | SXT |
|-----|-------|----|-----|
| Local | Base Sepolia | Local Postgres | SXT Testnet |
| Staging | Base Sepolia | Managed Postgres | SXT Testnet |
| Production | Base Mainnet | Managed Postgres | SXT Mainnet |
