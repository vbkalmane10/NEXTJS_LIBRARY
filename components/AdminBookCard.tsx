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
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden space-y-4">
            {sortedBooks.map((book, index) => (
              <div
                key={book.id}
                className="w-full rounded-md bg-white p-4 shadow"
              >
                <div className="flex flex-col space-y-2 border-b pb-4">
                  <div className="flex justify-between items-start">
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
                        className="hover:bg-green-400"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-400"
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
                              className="bg-black"
                            >
                              Continue
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
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-5 font-medium">{t('serialNo')}</TableHead>
                  <TableHead className="px-4 py-5 font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort('title')}
                      className="hover:bg-transparent"
                    >
                      {t('title')}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                      <span className="sr-only">
                        Sort by title {sortOrder === 'asc' ? 'descending' : 'ascending'}
                      </span>
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-5 font-medium">{t('author')}</TableHead>
                  <TableHead className="px-4 py-5 font-medium">
                  {t('isbnNo')}
                  </TableHead>
                  <TableHead className="px-4 py-5 font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort('availableCopies')}
                      className="hover:bg-transparent"
                    >
                     {t('availableCopies')}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                      <span className="sr-only">
                        Sort by available copies {sortOrder === 'asc' ? 'descending' : 'ascending'}
                      </span>
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-5 font-medium">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBooks.map((book, index) => (
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
                    <TableCell className="whitespace-nowrap px-3 py-3 text-center">
                      {book.availableCopies}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-3 pr-3">
                      <div className="flex justify-start gap-2">
                        <Button
                          onClick={() => onEdit(book.isbnNo)}
                          variant="ghost"
                          size="icon"
                          className="hover:bg-green-400"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-red-400"
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
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBookTable