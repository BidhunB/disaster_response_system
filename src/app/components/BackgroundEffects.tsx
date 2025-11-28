export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}
