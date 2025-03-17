"use client";

import { useState } from "react";
import StatusFilter from "./StatusFilter";

interface FiltersSidebarProps {
  onFiltersChange: (filters: { statuses: string[]; prizePoolRange: { min: number; max: number } }) => void;
}

const FiltersSidebar = ({ onFiltersChange }: FiltersSidebarProps) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [prizePoolRange, setPrizePoolRange] = useState<{ min: number; max: number }>({ min: 0, max: Infinity });

  // Handle status filter changes
  const handleStatusChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
    onFiltersChange({ statuses, prizePoolRange }); // Pass the updated filters to the parent
  };

  // Handle prize pool range changes
  const handlePrizePoolRangeChange = (min: number, max: number) => {
    setPrizePoolRange({ min, max });
    onFiltersChange({ statuses: selectedStatuses, prizePoolRange: { min, max } }); // Pass the updated filters to the parent
  };

  return (
    <div className="w-64 p-4 bg-gray-800 rounded-lg space-y-6">
      <h2 className="font-bold text-2xl">Filters</h2>

      {/* Status Filter */}
      <StatusFilter
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
      />

      {/* Prize Pool Range Filter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Prize Pool</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Min"
            className="w-1/2 p-2 border rounded-lg bg-gray-700 text-white"
            onChange={(e) =>
              handlePrizePoolRangeChange(Number(e.target.value), prizePoolRange.max)
            }
          />
          <input
            type="text"
            placeholder="Max"
            className="w-1/2 p-2 border rounded-lg bg-gray-700 text-white"
            onChange={(e) =>
              handlePrizePoolRangeChange(prizePoolRange.min, Number(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;