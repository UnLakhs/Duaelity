"use client";

interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
}

const statusOptions = ["Upcoming", "Ongoing", "Finished"];

const StatusFilter = ({
  selectedStatuses,
  onStatusChange,
}: StatusFilterProps) => {
  const handleStatusChange = (status: string) => {
    const updatedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    onStatusChange(updatedStatuses);
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Tournament Status</h3>
      {statusOptions.map((status) => (
        <label key={status} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedStatuses.includes(status)}
            onChange={() => handleStatusChange(status)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{status}</span>
        </label>
      ))}
    </div>
  );
};

export default StatusFilter;
