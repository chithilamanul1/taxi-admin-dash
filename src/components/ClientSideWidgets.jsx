'use client'

import dynamic from 'next/dynamic'

const LiveChatWidget = dynamic(() => import('./LiveChatWidget'), {
    ssr: false,
})

export default function ClientSideWidgets() {
    return <LiveChatWidget />
}
