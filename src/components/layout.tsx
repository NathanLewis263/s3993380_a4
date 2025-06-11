import React from "react";
import Header from "./header";
import Footer from "./footer";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  centerMain: boolean;
}

export default function Layout({ children, centerMain = false }: LayoutProps) {
  return (
    <div className="bg-[white] min-h-screen flex flex-col gap">
      <Header />
      <Navigation />
      <main
        className={`bg-[white] flex-1 grid ${centerMain ? "place-content-center" : ""}`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
