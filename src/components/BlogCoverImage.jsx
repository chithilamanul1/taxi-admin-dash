'use client';
import { useState } from 'react';

export default function BlogCoverImage({ src, alt, className }) {
    const [imgSrc, setImgSrc] = useState(src || '/hero.jpg');

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setImgSrc('/hero.jpg')}
        />
    );
}
