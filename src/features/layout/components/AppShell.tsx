import type { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 flex">
      <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden bg-slate-50">
        <AppSidebar />
        <section className="flex flex-1 flex-col bg-white px-4 py-5 sm:px-6 sm:py-8 lg:px-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-10 lg:rounded-l-[2rem] border-l border-slate-200 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
