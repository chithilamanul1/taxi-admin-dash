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

                    // Check if user exists
                    let existingUser = await User.findOne({ email: user.email })
                    let isNewUser = false

                    if (!existingUser) {
                        isNewUser = true
                        // Create new user from Google profile
                        existingUser = await User.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: 'user',
                            provider: 'google',
                            password: 'google-oauth-' + Date.now() // Placeholder
                        })

                        // Send Welcome Email
                        await sendEmail({
                            to: user.email,
                            subject: 'Welcome to Airport Taxi Tours',
                            html: templates.welcome(user.name)
                        })
                    }

                    // Log login to Discord and send login notification email
                    try {
                        const { logUserLogin } = await import('./discord')
                        const { sendLoginNotification } = await import('./email-service')

                        await logUserLogin(user, 'Google')

                        // Send login notification (not for new users - they get welcome email)
                        if (!isNewUser) {
                            await sendLoginNotification(user)
                        }
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
