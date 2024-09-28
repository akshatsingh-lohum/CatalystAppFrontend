export const metadata = {
  title: "Catalyst App - Welcome",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
