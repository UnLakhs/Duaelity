"use client";

import { useState } from "react";
import StatusFilter from "./StatusFilter";

interface FiltersSidebarProps {
  onFiltersChange: (filters: { statuses: string[] }) => void;
}

const FiltersSidebar = ({ onFiltersChange }: FiltersSidebarProps) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Handle status filter changes
  const handleStatusChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
    onFiltersChange({ statuses }); // Pass the updated filters to the parent
  };

  return (
    <div className="w-64 p-4 bg-gray-800 rounded-lg space-y-6">
      <StatusFilter
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
      />
      {/* Add more filter components here */}
    </div>
  );
};

export default FiltersSidebar;
