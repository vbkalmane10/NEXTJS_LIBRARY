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
import { getTransactionsDueToday, sendEmailNotification } from "@/lib/actions";
import { fetchUserDetails } from "@/lib/MemberRepository/actions";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
export default function DueTodayPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const t = useTranslations("dueToday");
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const today = new Date();
        const response = await getTransactionsDueToday(today);
        setTransactions(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load transactions.",
          variant: "destructive",
          className: "bg-red-500",
        });
      } 
    };

    fetchTransactions();
  }, []);

  const handleNotify = async (memberId: number, transaction: any) => {
    setLoadingId(transaction.id);
    try {
      const user = await fetchUserDetails(memberId);
      console.log(user);
      const result = await sendEmailNotification(
        user?.email,
        transaction.bookTitle
      );
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "destructive",
          className: "bg-green-500 text-black",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
          className: "bg-red-500",
        });
      }
    } catch (error) {
      throw new Error("Error while sending notiifcation");
    } finally {
      setLoadingId(null); 
    }
  };

  
  if (transactions.length === 0) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        {t("noBooksDueToday")}
      </div>
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("transactionsDueToday")}</h1>

      <Table className="w-full border-separate border-spacing-y-2">
        <TableHeader className="bg-gray-200 text-gray-700">
          <TableRow>
            <TableHead>{t("serialNo")}</TableHead>

            <TableHead>{t("memberName")}</TableHead>
            <TableHead>{t("bookName")}</TableHead>
            <TableHead>{t("issuedDate")}</TableHead>
            <TableHead className="text-center">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {transactions.map((transaction, index) => (
            <TableRow key={transaction.id} className="bg-gray-50">
              <TableCell>{index + 1}</TableCell>

              <TableCell>{transaction.firstName}</TableCell>
              <TableCell>{transaction.bookTitle}</TableCell>
              <TableCell>{transaction.issueDate}</TableCell>
              <TableCell className="flex justify-center space-x-2">
                <Button
                  onClick={() =>
                    handleNotify(transaction.memberId, transaction)
                  }
                  variant="outline"
                  disabled={loadingId === transaction.id}
                >
                  {loadingId === transaction.id ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    t("notify")
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="min-w-[120px] bg-green-400"
                  
                >
                  {t("markAsReturned")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
