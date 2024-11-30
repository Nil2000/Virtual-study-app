// import { NEXT_AUTH_OPTIONS } from "@lib/auth";
// import NextAuth from "next-auth/next";

// const handler = NextAuth(NEXT_AUTH_OPTIONS);

// export { handler as GET, handler as POST };

import { handlers } from "@/lib/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;
