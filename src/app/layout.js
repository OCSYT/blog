import { Open_Sans } from 'next/font/google';
const OpenSansFont = Open_Sans({ subsets: ['latin'] });
import "./globals.css";


export const metadata = {
  title: "Programming Blog",
  description: "Programming blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${OpenSansFont} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
