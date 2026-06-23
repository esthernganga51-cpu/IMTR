"use client";

import React, { useState } from "react";

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: "pending" | "paid" | "overdue";
  paymentMethod?: "cash" | "check" | "bank" | "mobile";
  notes?: string;
}

type PaymentMethod = NonNullable<FeeRecord["paymentMethod"]>;

export function FeesManagementPage() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    dueDate: "",
    paymentMethod: "cash" as PaymentMethod,
  });

  const handleAddFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.amount || !formData.dueDate) return;

    const newFee: FeeRecord = {
      id: `FEE-${Date.now()}`,
      studentId: formData.studentId,
      studentName: "New Student",
      amount: parseInt(formData.amount),
      dueDate: new Date(formData.dueDate),
      status: "pending",
    };

    setFees([newFee, ...fees]);
    setFormData({ studentId: "", amount: "", dueDate: "", paymentMethod: "cash" });
    setShowForm(false);
  };

  const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = fees.filter(f => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = fees.filter(f => f.status === "pending").reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fees Management</h1>
          <p className="text-gray-600 mt-1">Track student fees and payments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          + Add Fee Record
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">KES {totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Paid</p>
          <p className="text-3xl font-bold text-green-600 mt-1">KES {paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-red-600 mt-1">KES {pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Add Fee Record</h3>
          <form onSubmit={handleAddFee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Student ID"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="number"
              placeholder="Amount (KES)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank">Bank</option>
              <option value="mobile">Mobile Money</option>
            </select>
            <button type="submit" className="bg-green-600 text-white font-medium py-2 px-4 rounded-md">
              Save Fee
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Due Date</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{fee.studentName}</td>
                <td className="px-4 py-3 font-medium">KES {fee.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{fee.dueDate.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      fee.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : fee.status === "overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {fee.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{fee.paymentMethod || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
