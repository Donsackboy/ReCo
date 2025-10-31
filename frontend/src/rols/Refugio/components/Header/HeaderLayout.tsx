import React from "react";
import "./HeaderLayout.css";

interface HeaderLayoutProps {
  children: React.ReactNode;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ children }) => {
  return <div className="header-layout">{children}</div>;
};

export default HeaderLayout;
