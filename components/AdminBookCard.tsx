"use client";
import React from "react";
import { Edit, Trash2, Trash } from "lucide-react";
import { iBook } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface AdminBookTableProps {
  books: iBook[];
  onEdit: (isbnNo: string) => void;
  onDelete: (isbnNo: string) => void;
}

const AdminBookTable: React.FC<AdminBookTableProps> = ({
  books,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {books?.map((book, index) => (
              <div
                key={book.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">
                      {index + 1}. {book.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Author: {book.author}
                    </p>

                    <p className="text-sm text-gray-500">ISBN: {book.isbnNo}</p>
                    <p className="text-sm text-gray-500">
                      Available Copies: {book.availableCopies}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(book.isbnNo)}
                      className="hover:bg-green-400 p-2 rounded"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => onDelete(book.isbnNo)}
                      className="hover:bg-red-400 p-2 rounded"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-5 font-medium">S.No</TableHead>
                <TableHead className="px-4 py-5 font-medium">Title</TableHead>
                <TableHead className="px-4 py-5 font-medium">Author</TableHead>

                <TableHead className="px-4 py-5 font-medium">
                  ISBN Number
                </TableHead>
                <TableHead className="px-4 py-5 font-medium">
                  Available Copies
                </TableHead>
                <TableHead className="px-4 py-5 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <tbody className="bg-white">
              {books?.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell className="whitespace-nowrap py-3 pl-6 pr-3">
                    {index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3">
                    {book.title}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3">
                    {book.author}
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-3 py-3">
                    {book.isbnNo}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 flex justify-center items-center">
                    {book.availableCopies}
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-3  pr-3">
                    <div className="flex justify-start gap-2">
                      <button
                        onClick={() => onEdit(book.isbnNo)}
                        className="hover:bg-green-400 p-2 rounded"
                      >
                        <Edit size={16} />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <button className="hover:bg-red-400 p-2 rounded">
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {book.title} will be deleted from our database
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(book.isbnNo)}
                              className="bg-black"
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookTable;
