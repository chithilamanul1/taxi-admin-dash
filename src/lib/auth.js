import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "./db"
import User from "../models/User"
import bcrypt from "bcryptjs"
import { sendEmail, templates } from "./email"

const SUPER_ADMINS = [
    'chithilamanul1@gmail.com',
    'srilankantaxilk@gmail.com',
    'srilankantaxi@gmail.com'
];

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('[Auth] Missing credentials');
                    return null
                }

                try {
                    await dbConnect()
                    const user = await User.findOne({ email: credentials.email })

                    if (!user) {
                        console.log(`[Auth] User not found: ${credentials.email}`);
                        return null
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    if (!isValid) {
                        console.log(`[Auth] Invalid password for: ${credentials.email}`);
                        return null
                    }

                    // Super Admin Check
                    const isSuperAdmin = SUPER_ADMINS.includes(user.email);

                    if (isSuperAdmin && (user.role !== 'admin' || !user.isAdmin)) {
                        user.role = 'admin';
                        user.isAdmin = true;
                        await user.save();
                        console.log(`[Auth] Verified/Promoted super admin: ${user.email}`);
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        role: user.role || 'user',
                        isAdmin: user.isAdmin || user.role === 'admin',
                        image: user.image || null,
                        permissions: user.permissions || []
                    }
                } catch (error) {
                    console.error('[Auth] Authorize error:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    await dbConnect()

                    const isAdminByEmail = SUPER_ADMINS.includes(user.email);

                    // Check if user exists in DB
                    let existingUser = await User.findOne({ email: user.email })

                    let isNewUser = false
                    if (!existingUser) {
                        isNewUser = true;
                        existingUser = await User.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: isAdminByEmail ? 'admin' : 'user', 
                            isAdmin: isAdminByEmail,
                            provider: 'google',
                            password: 'google-oauth-' + Date.now()
                        });

                        await sendEmail({
                            to: user.email,
                            subject: 'Welcome to Airport Taxis Tours',
                            html: templates.welcome(user.name)
                        })
                    } else {
                        // Ensure super admins have the correct role and isAdmin flag
                        let updated = false;
                        if (isAdminByEmail && existingUser.role !== 'admin') {
                            existingUser.role = 'admin';
                            existingUser.isAdmin = true;
                            updated = true;
                        }
                        if (updated) await existingUser.save();
                    }

                    try {
                        const { logUserLogin } = await import('./discord')
                        const { sendLoginNotification } = await import('./email-service')
                        await logUserLogin(user, 'Google')
                        if (!isNewUser) await sendLoginNotification(user)
                    } catch (notifyError) {
                        console.error('Login notification failed:', notifyError)
                    }

                    return true
                } catch (error) {
                    console.error("Error during Google sign in:", error)
                    return false
                }
            }
            return true
        },
        async jwt({ token, user, account }) {
            // When user first logs in
            if (user) {
                token.id = user.id
                token.role = user.role
                token.isAdmin = user.isAdmin || user.role === 'admin'
                token.permissions = user.permissions || []
            }

            // For subsequent requests, if it's a social provider, we might want to refresh from DB
            // to catch role/permission changes without waiting for re-login
            if (account?.provider === 'google' || !token.role) {
                try {
                    await dbConnect()
                    const dbUser = await User.findOne({ email: token.email })
                    if (dbUser) {
                        token.id = dbUser._id.toString()
                        token.role = dbUser.role
                        token.isAdmin = dbUser.isAdmin || dbUser.role === 'admin'
                        token.permissions = dbUser.permissions || []
                    }
                } catch (e) {
                    console.error('[Auth] JWT fetch error:', e)
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role
                session.user.id = token.id
                session.user.isAdmin = token.isAdmin
                session.user.permissions = token.permissions
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
}
