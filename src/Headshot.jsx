// Matt's headshot, from the original in brand-source/headshot-original.jpeg. That file
// is 1.5 MB at 1284x1813, so the site serves cropped, resized copies from public/team/
// instead: a 4:5 portrait at 480 and 800 wide, and a square avatar at 192, each as
// WebP with a JPEG fallback and with the camera metadata stripped.

export function HeadshotPortrait({ className = '' }) {
  return (
    <picture>
      <source type="image/webp" srcSet="/team/matt-swanson-480.webp 480w, /team/matt-swanson-800.webp 800w" sizes="(min-width: 1024px) 320px, 100vw" />
      <img
        src="/team/matt-swanson-480.jpg"
        srcSet="/team/matt-swanson-480.jpg 480w, /team/matt-swanson-800.jpg 800w"
        sizes="(min-width: 1024px) 320px, 100vw"
        width={480}
        height={600}
        alt="Matt Swanson"
        loading="lazy"
        decoding="async"
        className={`object-cover ${className}`}
      />
    </picture>
  );
}

// Decorative by default: everywhere it appears, Matt's name is in the text beside it.
export function HeadshotAvatar({ size = 48, alt = '', className = '' }) {
  return (
    <picture>
      <source type="image/webp" srcSet="/team/matt-swanson-avatar.webp" />
      <img
        src="/team/matt-swanson-avatar.jpg"
        width={size}
        height={size}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        loading="lazy"
        decoding="async"
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    </picture>
  );
}
