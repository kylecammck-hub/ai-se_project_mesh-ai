// Small hand-built SVG icons matching the Figma design's onboarding
// illustrations and the "Mesh AI" sparkle mark. Recreated as inline SVG
// (rather than exported PNGs) so they stay crisp at any size and don't
// depend on binary assets living in the repo.

type IconProps = {
  className?: string;
};

/**
 * The purple sparkle-in-a-rounded-square mark used next to "Mesh AI" in the
 * header and on the Intro page title.
 */
export function LogoMark({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoMarkGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b9a4f2" />
          <stop offset="1" stopColor="#7c5cd6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#logoMarkGradient)" />
      <path
        d="M12 6.5 L13.3 10.7 L17.5 12 L13.3 13.3 L12 17.5 L10.7 13.3 L6.5 12 L10.7 10.7 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

/** Stack of documents — "Bring all your documents into one secure AI workspace" */
export function DocumentsIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="97"
      height="100"
      viewBox="0 0 97 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M39 21h32l14 14v50a5 5 0 0 1-5 5H39a5 5 0 0 1-5-5V26a5 5 0 0 1 5-5Z"
        fill="#c9b8f2"
      />
      <path d="M71 21 85 35H71Z" fill="#a892e8" />
      <path
        d="M28 32h32l14 14v50a5 5 0 0 1-5 5H28a5 5 0 0 1-5-5V37a5 5 0 0 1 5-5Z"
        fill="#ffffff"
        stroke="#c9b8f2"
        strokeWidth="1.5"
      />
      <path d="M60 32 74 46H60Z" fill="#f0eaff" stroke="#c9b8f2" strokeWidth="1.5" />
    </svg>
  );
}

/** Folder — "Organize and manage the documents that power your AI" */
export function FolderIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="97"
      height="100"
      viewBox="0 0 97 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M42 22h30l13 13v51a5 5 0 0 1-5 5H42a5 5 0 0 1-5-5V27a5 5 0 0 1 5-5Z"
        fill="#c9b8f2"
      />
      <path d="M72 22 85 35H72Z" fill="#a892e8" />
      <path
        d="M13 38a4 4 0 0 1 4-4h17l7 8h32a4 4 0 0 1 4 4v34a5 5 0 0 1-5 5H18a5 5 0 0 1-5-5V38Z"
        fill="#ffffff"
        stroke="#c9b8f2"
        strokeWidth="1.5"
      />
      <path
        d="M13 46h68v29a5 5 0 0 1-5 5H18a5 5 0 0 1-5-5V46Z"
        fill="#f0eaff"
        stroke="#c9b8f2"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Sparkling document stack — "Your knowledge base, accessible through a simple chat interface" */
export function SparkleStackIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="97"
      height="100"
      viewBox="0 0 97 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40 30h32l14 14v45a5 5 0 0 1-5 5H40a5 5 0 0 1-5-5V35a5 5 0 0 1 5-5Z"
        fill="#c9b8f2"
      />
      <path d="M72 30 86 44H72Z" fill="#a892e8" />
      <path
        d="M28 40h32l14 14v41a5 5 0 0 1-5 5H28a5 5 0 0 1-5-5V45a5 5 0 0 1 5-5Z"
        fill="#e2d8fb"
      />
      <path d="M60 40 74 54H60Z" fill="#d2c3f6" />
      <path
        d="M36 52 39.5 61 49 64.5 39.5 68 36 77 32.5 68 23 64.5 32.5 61Z"
        fill="#ffffff"
      />
      <path
        d="M66 66 68 71.5 73.5 73.5 68 75.5 66 81 64 75.5 58.5 73.5 64 71.5Z"
        fill="#ffffff"
      />
    </svg>
  );
}
