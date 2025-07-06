import React from "react";

const FilterSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="py-2 flex items-center gap-2" aria-label={title}>
    {/* <div className="flex items-center gap-2 text-sm font-bold text-content/80 mb-2 px-2">
      {icon}
      <span>{title}</span>
    </div> */}
    {icon}
    {children}
  </div>
);

export default FilterSection;
