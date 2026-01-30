'use client';
import { useEffect, useRef } from 'react';

export default function AutoSubmitForm({ url, params }) {
    const formRef = useRef(null);

    useEffect(() => {
        if (formRef.current) {
            formRef.current.submit();
        }
    }, []);

    return (
        <form ref={formRef} method="POST" action={url} className="hidden">
            {Object.entries(params).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
            ))}
        </form>
    );
}
