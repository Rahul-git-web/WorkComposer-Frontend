// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "WorkComposer Clone",
  description: "Productivity and work management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        {children}
      </body>
    </html>
  );
}