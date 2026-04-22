export function Waveform() {
  return (
    <div className="flex h-9 items-center justify-center gap-1 rounded-md bg-gray-100 px-4 text-xs text-gray-400">
      <span className="h-2 w-1 rounded-full bg-gray-300" />
      <span className="h-5 w-1 rounded-full bg-gray-300" />
      <span className="h-3 w-1 rounded-full bg-gray-300" />
      <span className="h-7 w-1 rounded-full bg-gray-300" />
      <span className="h-4 w-1 rounded-full bg-gray-300" />
      <span className="ml-3">Audio preview appears here</span>
    </div>
  );
}
