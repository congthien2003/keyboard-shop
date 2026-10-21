"use client";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
export function ProductImage({ src, alt, ...props }: ImageProps) {
 const [failed,setFailed] = useState(false);
 useEffect(() => setFailed(false), [src]);
 return <Image {...props} src={failed || !src ? "/images/mechkey/keyboard.svg" : src} alt={alt} onError={() => setFailed(true)}/>;
}
