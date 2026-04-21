import type { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 p-2 sm:p-4 lg:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-16px)] w-full max-w-[1600px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-emerald-900/5 lg:flex-row">
        <AppSidebar />
        <section className="flex flex-1 flex-col bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </section>
      </div>
    </main>
  );
}
