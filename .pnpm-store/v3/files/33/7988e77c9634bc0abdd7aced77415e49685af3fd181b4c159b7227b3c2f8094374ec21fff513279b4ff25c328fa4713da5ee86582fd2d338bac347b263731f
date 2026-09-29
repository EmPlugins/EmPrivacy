//#region src/oauth/types.d.ts
/**
 * OAuth types
 */
interface OAuthProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
}
interface OAuthProvider {
  name: string;
  authorizeUrl: string;
  tokenUrl: string;
  userInfoUrl?: string;
  scopes: string[];
  /**
   * Parse the user profile from the provider's response
   */
  parseProfile(data: unknown): OAuthProfile;
}
interface OAuthConfig {
  clientId: string;
  clientSecret: string;
}
interface OAuthState {
  provider: string;
  redirectUri: string;
  codeVerifier?: string;
  nonce?: string;
  /**
   * When present, this OAuth flow is accepting an invite. The callback
   * completes the invite (creating the user with the invited role and linking
   * the OAuth account) instead of falling back to the self-signup policy, but
   * only when the provider-verified email matches the invited address.
   */
  inviteToken?: string;
}
//#endregion
export { OAuthState as i, OAuthProfile as n, OAuthProvider as r, OAuthConfig as t };
//# sourceMappingURL=types-CXPUTn1t.d.mts.map