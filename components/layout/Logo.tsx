import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link
      aria-label="Nuclii home"
      className="fixed left-4 top-6 z-50 inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-6 lg:left-10 lg:top-8"
      href="/"
    >
      <Image alt="Nuclii" className="h-7 w-auto" height={28} priority src="/nuclii-logo.png" width={75} />
    </Link>
  );
}

export { Logo };
