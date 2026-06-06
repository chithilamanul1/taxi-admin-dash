'use client'

import dynamic from 'next/dynamic'

import { usePathname } from 'next/navigation'

const LiveChatWidget = dynamic(() => import('./LiveChatWidget'), {
    ssr: false,
})

export default function ClientSideWidgets() {
    const pathname = usePathname()
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/driver')) return null
    return <LiveChatWidget />
}
