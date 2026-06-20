export default function FakeStatusBar() {
  return (
    <div className="mockup-only safe-top min-h-[58px] items-start justify-between px-screen text-label font-extrabold text-ink">
      <div className="leading-none">9:41</div>
      <div className="relative h-battery-h w-battery rounded-battery border-2 border-ink">
        <div className="absolute right-battery-nub-offset top-battery-nub-top h-battery-nub-h w-battery-nub-w rounded-r bg-ink" />
        <div className="absolute inset-battery-inset rounded-batteryInner bg-ink" />
      </div>
    </div>
  );
}
