import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "./db"
import User from "../models/User"
import bcrypt from "bcryptjs"
import { sendEmail, templates } from "./email"

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
                    return null
                }

                await dbConnect()
                const user = await User.findOne({ email: credentials.email })

                if (!user) return null

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) return null

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role || 'user',
                    image: user.image || null
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    await dbConnect()

                    const superAdmins = ['chithilamanul1@gmail.com', 'airporttaxis.lk@gmail.com', 'airporttaxis@gmail.com'];
                    const isAdminByEmail = superAdmins.includes(user.email);

                    // Check if user exists in DB
                    let existingUser = await User.findOne({ email: user.email })

                    // If not a super admin AND not an existing admin in DB, block sign in
                    if (!isAdminByEmail && (!existingUser || existingUser.role !== 'admin')) {
                        console.log(`Unauthorized Google login attempt: ${user.email}`);
                        return false; // Blocks the sign-in
                    }

                    let isNewUser = false
                    if (!existingUser) {
                        isNewUser = true;
                        existingUser = await User.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: 'admin', // Since we only allow admins to sign in via Google now
                            isAdmin: true,
                            provider: 'google',
                            password: 'google-oauth-' + Date.now()
                        });

                        await sendEmail({
                            to: user.email,
                            subject: 'Welcome to Airport Taxis Tours Admin Panel',
                            html: templates.welcome(user.name)
                        })
                    } else if (isAdminByEmail && existingUser.role !== 'admin') {
                        existingUser.role = 'admin';
                        existingUser.isAdmin = true;
                        await existingUser.save();
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
            if (user) {
                if (account?.provider === 'google') {
                    await dbConnect()
                    const dbUser = await User.findOne({ email: user.email })
                    if (dbUser) {
                        token.id = dbUser._id.toString()
                        token.role = dbUser.role
                    }
                } else {
                    token.role = user.role || 'user'
                    token.id = user.id
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role
                session.user.id = token.id
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
