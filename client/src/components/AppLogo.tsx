import {
  BRAND_LOGO_URL,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "../lib/branding";

type AppLogoProps = {
  collapsed?: boolean;
};

export default function AppLogo({ collapsed = false }: AppLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={BRAND_LOGO_URL}
        alt={`${BRAND_NAME} logo`}
        className="h-10 w-12 shrink-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] object-contain px-1.5 py-1 shadow-sm"
      />

      {!collapsed ? (
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-[var(--color-text)]">
            {BRAND_NAME}
          </p>
          <p className="truncate text-xs text-[var(--color-text-muted)]">
            {BRAND_TAGLINE}
          </p>
        </div>
      ) : null}
    </div>
  );
}
