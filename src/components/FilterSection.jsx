// src/components/FilterSection.jsx

import { cn } from '../utils/tools.js';

/**
 * Reusable filter section component
 */
const FilterSection = ({
  title,
  children,
  open = true,
  className
}) => {
  return (
    <details open={open} className={cn("filter-section", className)}>
      <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 cursor-pointer">
        {title}
      </summary>
      <div className="filter-content">
        {children}
      </div>
    </details>
  );
};

export default FilterSection;
