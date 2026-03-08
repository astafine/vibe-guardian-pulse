

## Plan: Native Google Sign-In Without Browser Bar on Android

### Problem
Currently, Google sign-in on Android opens an external system browser (`Browser.open()`), showing a browser bar. You want the sign-in to happen natively within the app (the familiar Google account picker bottom sheet).

### Solution
Use the **`@capgo/capacitor-social-login`** Capacitor plugin, which uses Android's native **Credential Manager** for Google sign-in — no browser opens at all. The user sees the native Google account picker overlay.

### Changes Required

**1. Install the plugin** — `@capgo/capacitor-social-login`

**2. Update `capacitor.config.json`** — Register the plugin and specify which providers to include (Google only):
```json
"plugins": {
  "SocialLogin": {
    "providers": {
      "google": true,
      "apple": false,
      "facebook": false
    }
  }
}
```

**3. Update `src/pages/Auth.tsx`** — For the native platform path:
- Import `SocialLogin` from `@capgo/capacitor-social-login`
- On app init, call `SocialLogin.initialize({ google: { webClientId: '<your-google-web-client-id>' } })`
- Replace the `Browser.open()` call with `SocialLogin.login({ provider: 'google' })`, which returns an ID token
- Use the returned Google ID token to sign in via `supabase.auth.signInWithIdToken({ provider: 'google', token: idToken })`
- Keep the existing web/preview flow unchanged (non-native platforms)

**4. Remove `@capacitor/browser` usage** from the native sign-in path (it can stay for other uses).

**5. No changes to `useOAuthCallback.ts`** — The deep-link listener is no longer needed for Google sign-in on native since we get the token directly, but it can remain as a fallback.

### Important Setup Note
You will need your **Google Web Client ID** (from Google Cloud Console, the OAuth 2.0 "Web application" client ID — the same one configured in your backend auth settings). This is required for the native Credential Manager to work. You may need to provide this as a secret or hardcode it since it's a public client ID.

### Post-Implementation
After this change, you'll need to:
1. `git pull` the project
2. `npm install`
3. `npx cap sync android`
4. Rebuild the Android app

