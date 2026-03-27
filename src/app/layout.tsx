import "./globals.css";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import { UserProvider } from "./components/UserContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className="theme-dark" suppressHydrationWarning>
      <body className="antialiased">
        <UserProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
