declare module 'psl' {
  /**
   * Local typing shim for `psl` to avoid TS7016 caused by the package's `exports`
   * making its bundled typings non-resolvable under `moduleResolution: nodenext`.
   *
   * This intentionally matches the shape used in `webmunk-core`:
   * - `psl.parse()` returns either a parsed domain object (no `error`) or an error object (has `error`).
   * - Type is accessible as BOTH `import("psl").ParsedDomain` and `psl.ParsedDomain`.
   */
  declare namespace psl {
    export interface ParsedDomain {
      input: string;
      tld?: string | null;
      sld?: string | null;
      domain?: string | null;
      subdomain?: string | null;
      listed: boolean;
      error?: undefined;
    }

    export interface ParsedError {
      input: string;
      error: string;
      listed: boolean;
    }

    export type ParsedResult = ParsedDomain | ParsedError;
  }

  export type ParsedDomain = psl.ParsedDomain;
  export type ParsedError = psl.ParsedError;
  export type ParsedResult = psl.ParsedResult;

  declare const psl: {
    parse(hostname: string): psl.ParsedResult;
  };

  export default psl;
}


