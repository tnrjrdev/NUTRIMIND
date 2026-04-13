import type { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#f6f2e8] px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-[1600px] flex-col overflow-hidden rounded-[28px] border border-[#e8dec0] bg-white shadow-[0_24px_70px_rgba(86,67,18,0.08)] lg:flex-row">
        <AppSidebar />
        <section className="flex flex-1 flex-col bg-[#fbf8ef] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </section>
      </div>
    </main>
  );
}
