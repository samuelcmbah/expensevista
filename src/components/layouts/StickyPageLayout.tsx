// src/layouts/StickyPageLayout.tsx
import React from "react";

interface StickyPageLayoutProps {
  header: React.ReactNode; // Header and filters go here
  children: React.ReactNode; // Scrollable content
  scrollable?: boolean; // Whether the content area should be scrollable
}

export default function StickyPageLayout(props: StickyPageLayoutProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Sticky header */}
      <div
        className="
          sticky
          top-[3.5rem]
          md:top-0
          z-30
          bg-gray-50
          pb-2
          border-b border-gray-100
        "
      >
        <div className="p-2">{props.header}</div>

        <div />
      </div>

      {/* Scrollable content */}
      <div className={
        `flex-1 p-2 pt-[calc(3.5rem+1rem)] md:pt-4
            ${props.scrollable ? " overflow-y-auto" : ""}`
      }>
        {props.children}
      </div>
    </div>
  );
}
