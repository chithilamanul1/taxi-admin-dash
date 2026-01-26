import NextAuth from "next-auth"
import { authOptions } from "../../../../lib/auth"

const handler = NextAuth(authOptions)

console.log("DEBUG: NextAuth Route Loaded. Secret present?", !!process.env.NEXTAUTH_SECRET);
console.log("DEBUG: Mongo URI present?", !!process.env.MONGODB_URI);

export { handler as GET, handler as POST }
