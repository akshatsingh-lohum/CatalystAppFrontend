// src/app/layout.js
import "../globals.css";

import Sidebar from "../fonts/components/Sidebar";
import Header from "../fonts/components/Header";

export const metadata = {
  title: "Home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
