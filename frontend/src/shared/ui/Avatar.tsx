interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
}

export default function Avatar({ src, alt, size = 40 }: AvatarProps) {
  return (
    <div
      className="flex-shrink-0 rounded-[var(--radius-9999)] bg-cover bg-center bg-no-repeat"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(${src})`,
      }}
      role="img"
      aria-label={alt}
    />
  );
}
