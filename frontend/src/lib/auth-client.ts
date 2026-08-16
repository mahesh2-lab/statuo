import { createAuthClient } from 'better-auth/react';
import { sentinelClient } from "@better-auth/infra/client";


export const authClient = createAuthClient({
  plugins: [
    sentinelClient()
  ],
  baseURL: import.meta.env.VITE_API_URL ?? '',
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
