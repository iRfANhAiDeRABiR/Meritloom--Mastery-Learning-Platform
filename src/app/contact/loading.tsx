export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="container-page py-16 flex flex-col items-center">
        <div className="h-6 w-24 rounded-full bg-line" />
        <div className="mt-4 h-12 w-1/2 max-w-sm rounded-xl bg-line" />
        <div className="mt-4 h-6 w-1/3 max-w-xs rounded bg-line" />
      </div>

      <div className="container-page pb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        <div className="h-72 rounded-[24px] bg-line/50" />
        <div className="h-96 rounded-[24px] bg-line/50" />
      </div>
    </div>
  );
}
