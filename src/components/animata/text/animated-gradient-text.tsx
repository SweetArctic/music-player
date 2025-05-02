import React from "react";
import "./AnimatedGradientText.css";

interface AnimatedGradientTextProps {
  className?: string;
  children: React.ReactNode;
}

export default function AnimatedGradientText({
  className = "",
  children,
}: AnimatedGradientTextProps) {
  const text = typeof children === "string" ? children : "";

  return (
    <div className={`animated-gradient-text ${className}`}>
      {text
        ? text.split("").map((char, index) => (
            <span className="letter-wrapper" key={index}>
              {char}
            </span>
          ))
        : children}
    </div>
  );
}
