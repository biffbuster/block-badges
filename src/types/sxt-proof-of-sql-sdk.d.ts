declare module "sxt-proof-of-sql-sdk" {
  export interface SxTResult {
    [column: string]:
      | { Int: number[] }
      | { BigInt: string[] }
      | { VarChar: string[] }
      | { Decimal75: string[] }
      | { Boolean: boolean[] };
  }

  export class SxTClient {
    constructor(
      zkQueryURL: string,
      authURL: string,
      rpcURL: string,
      apiKey: string
    );
    queryAndVerify(sql: string, blockHash?: string): Promise<SxTResult>;
  }

  export function verify_prover_response_hyper_kzg(
    proverResponse: unknown
  ): SxTResult;
}
