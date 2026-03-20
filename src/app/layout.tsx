import "./globals.css";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./components/ui/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className="theme-dark" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <div className="flex h-screen w-full overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
