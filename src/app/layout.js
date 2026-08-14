import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "WorkComposer — Time tracking that runs quietly in the background",
  description:
    "WorkComposer runs quietly in the background, logging focused time, app usage, and idle gaps.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#17253D",
              color: "#fff",
              border: "1px solid #22324D",
            },
            success: {
              iconTheme: {
                primary: "#22C55E",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
