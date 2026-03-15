'use client';
import { useState } from 'react';

export default function BlogCoverImage({ src, alt, className }) {
    const [imgSrc, setImgSrc] = useState(src || '/hero.jpg');

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`${className} rounded-none border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] grayscale hover:grayscale-0 transition-all duration-300`}
            onError={() => setImgSrc('/hero.jpg')}
        />
    );
}
