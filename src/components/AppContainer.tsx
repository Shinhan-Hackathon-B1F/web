export default function AppContainer({ children }: { children: React.ReactNode }) {
    return (
      <main className="w-full max-w-[420px] mx-auto px-4 py-6">{children}</main>
    );
  }