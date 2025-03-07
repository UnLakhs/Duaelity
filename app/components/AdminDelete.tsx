"use client";
import { useEffect, useState } from "react";

interface AdminDeleteProps {
  tournamentId: string | null;
  onClose: () => void;
  isOpen: boolean;
  onSuccess: () => void;    
}

const AdminDelete = ({ tournamentId, onClose, isOpen, onSuccess }: AdminDeleteProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`/api/Admin`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournamentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete tournament");
      }

      setSuccess("Tournament deleted successfully");

      //refresh tournament list
      onSuccess();

      // Delay closing modal so success message can be seen
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Error deleting tournament:", error);
      setError("Failed to delete tournament");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4 max-w-md"
      >
        <h2 className="text-lg font-bold text-black">Are you sure?</h2>
        <p className="text-black">Do you really want to delete this tournament?</p>

        {/* Success & Error Messages */}
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;
