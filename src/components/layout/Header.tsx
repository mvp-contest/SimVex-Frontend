import Image from "next/image";

interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  return (
    <header className="h-[88px] bg-(--color-card-bg) border-b-[3px] border-(--color-border-primary) flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Image
          src="/images/simvex-logo.png"
          alt="SIMVEX Logo"
          width={51}
          height={51}
          className="object-cover"
        />
        <h1 className="text-[32px] font-bold text-(--color-text-primary)">
          SIMVEX
        </h1>
      </div>
      <div className="text-[28px] font-semibold text-(--color-text-primary)">
        {username}
      </div>
    </header>
  );
}
