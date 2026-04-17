type AppLogoProps = {
  collapsed?: boolean;
};

export default function AppLogo({ collapsed = false }: AppLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="https://res.cloudinary.com/dvl2r3bdw/image/upload/v1775943825/ChatGPT_Image_Apr_10_2026_12_41_04_AM_cwispp.png"
        alt="Survica"
        className="h-10 w-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] object-contain p-1.5 shadow-sm"
      />

      {!collapsed ? (
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight text-[var(--color-text)]">
            Survica
          </h1>
          <p className="truncate text-xs text-[var(--color-text-muted)]">
            Voice survey operating system
          </p>
        </div>
      ) : null}
    </div>
  );
}
