import type { ReactNode } from "react";
import BottomNavbar from "./BottomNavbar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <main className="overflow-x-hidden">
        <Navbar />
        {children}
        <BottomNavbar />
      </main>
    </>
  );
}

export default Layout;
