"use client";

export function ComplaintsManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
        <p className="text-gray-600 mt-1">Handle student complaints and issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Open</p>
          <p className="text-3xl font-bold text-red-600 mt-1">0</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">0</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-green-600 mt-1">0</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No complaints yet</p>
        <p className="text-gray-400 text-sm mt-2">Complaints will appear here</p>
      </div>
    </div>
  );
}
