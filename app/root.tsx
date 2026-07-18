import { Outlet, Links, Meta, Scripts, ScrollRestoration } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import RootLayout from './components/layout/RootLayout';
import './app.css';

export function meta() {
  return [
    { title: 'UtilityTools' },
    { name: 'description', content: 'Tools online gratis, 100% diproses di browser.' },
  ];
}

export default function Root() {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <RootLayout>
            <Outlet />
          </RootLayout>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}