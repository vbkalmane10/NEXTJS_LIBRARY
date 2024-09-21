"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getTransactionsDueToday } from "@/lib/actions";
import { format } from "date-fns";
import { iTransaction } from "@/lib/types";

export default function DueTodayPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const today = new Date();
      const response = await getTransactionsDueToday(today);
      setTransactions(response);
    };

    fetchTransactions();
  }, []);

  const handleNotify = (transactionId: string) => {
    alert(`Notify member for transaction: ${transactionId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Transactions Due Today</h1>

      <Table className="w-full border-separate border-spacing-y-2">
        <TableHeader className="bg-gray-200 text-gray-700">
          <TableRow>
            <TableHead>S.No</TableHead>

            <TableHead>Member Name</TableHead>
            <TableHead>Book Name</TableHead>
            <TableHead>Issued Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {transactions.map((transaction, index) => (
            <TableRow key={transaction.id} className="bg-gray-50">
              <TableCell>{index + 1}</TableCell>

              <TableCell>{transaction.firstName}</TableCell>
              <TableCell>{transaction.bookTitle}</TableCell>
              <TableCell>{transaction.issueDate}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleNotify(transaction.id)}
                  variant="outline"
                >
                  Notify
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
