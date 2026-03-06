# Space and Time Integration

## SDK Setup
```typescript
import { SpaceAndTime } from '@spaceandtime/sdk'
```

## Query Pattern
```typescript
const result = await sxt.query({
  sql: "SELECT COUNT(*) > 0 FROM eth.transactions WHERE...",
  prove: true  // Returns ZK proof
})
```

## Proof Structure
{ result: boolean, proof: string, commitment: string }

## Tables We Use
- ETHEREUM.TRANSACTIONS
- ETHEREUM.ERC20_TRANSFERS
- BASE.TRANSACTIONS
