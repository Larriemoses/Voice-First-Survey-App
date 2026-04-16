type AppLogoProps = {
  collapsed?: boolean;
};

export default function AppLogo({ collapsed = false }: AppLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="https://res.cloudinary.com/dvl2r3bdw/image/upload/v1775943825/ChatGPT_Image_Apr_10_2026_12_41_04_AM_cwispp.png"
        alt="Survica"
        className="h-10 w-10 rounded-xl object-contain"
      />

      {!collapsed && (
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight text-slate-900">
            Survica
          </h1>
          <p className="truncate text-xs text-slate-500">Voice Intelligence</p>
        </div>
      )}
    </div>
  );
}
