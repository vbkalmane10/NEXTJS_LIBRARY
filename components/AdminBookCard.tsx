'use client'

import React, { useState } from "react"
import { Edit, Trash2, ArrowUpDown } from "lucide-react"
import { iBook } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface AdminBookTableProps {
  books: iBook[]
  onEdit: (isbnNo: string) => void
  onDelete: (isbnNo: string) => void
}

type SortField = 'title' | 'availableCopies'
type SortOrder = 'asc' | 'desc'

const AdminBookTable: React.FC<AdminBookTableProps> = ({
  books,
  onEdit,
  onDelete,
}) => {
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const t = useTranslations('AdminPage')
  const sortedBooks = [...books].sort((a, b) => {
    if (sortField === 'title') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    } else {
      return sortOrder === 'asc'
        ? a.availableCopies - b.availableCopies
        : b.availableCopies - a.availableCopies
    }
  })

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-2 md:p-0">
      {/* Card View for Mobile Screens */}
      <div className="md:hidden space-y-4">
        {sortedBooks.map((book, index) => (
          <div key={book.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-sm sm:text-base">
                  {index + 1}. {book.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t('author')}: {book.author}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEdit(book.isbnNo)}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-green-300 bg-green-600"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-300 bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
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
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">ISBN: {book.isbnNo}</p>
            <p className="text-xs sm:text-sm text-gray-500">
              Available Copies: {book.availableCopies}
            </p>
          </div>
        ))}
      </div>

      {/* Table View for Larger Screens */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">{t('serialNo')}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort('title')}
                  className="hover:bg-transparent font-medium"
                >
                  {t('title')}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>{t('author')}</TableHead>
              <TableHead>{t('isbnNo')}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort('availableCopies')}
                  className="hover:bg-transparent font-medium"
                >
                  {t('availableCopies')}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBooks.map((book, index) => (
              <TableRow key={book.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbnNo}</TableCell>
                <TableCell className="text-center">{book.availableCopies}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => onEdit(book.isbnNo)}
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-300 bg-green-600"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-300 bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
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
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
  )
}

export default AdminBookTable