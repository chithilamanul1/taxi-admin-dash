'use client';
import { useState } from 'react';

export default function BlogCoverImage({ src, alt, className }) {
    const [imgSrc, setImgSrc] = useState(src || '/hero.jpg');

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`${className} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grayscale hover:grayscale-0 transition-all`}
            onError={() => setImgSrc('/hero.jpg')}
        />
    );
}
