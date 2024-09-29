"use client"

import React, { useState } from "react";
import { Badge, Check, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { Request } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";

interface RequestTableProps {
  requests: Request[];
  onApprove: (request: Request) => void;
  onReject: (request: Request) => void;
}

export default function RequestTable({ requests, onApprove, onReject }: RequestTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Request>('bookTitle')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})

  const sortedRequests = [...requests].sort((a, b) => {
    if (a[sortColumn]! < b[sortColumn]!) return sortDirection === 'asc' ? -1 : 1
    if (a[sortColumn]! > b[sortColumn]!) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (column: keyof Request) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const renderSortIcon = (column: keyof Request) => {
    if (column !== sortColumn) return null
    return sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  const handleAction = async (request: Request, action: 'approve' | 'reject') => {
    setLoadingStates(prev => ({ ...prev, [request.id]: true }))
    try {
      if (action === 'approve') {
        await onApprove(request)
      } else {
        await onReject(request)
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [request.id]: false }))
    }
  }

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-300 text-yellow-800'
      case 'Approved':
        return 'bg-green-300 text-green-800'
      case 'Rejected':
        return 'bg-red-300 text-red-800'
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-md">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead onClick={() => handleSort('bookTitle')} className="cursor-pointer py-4 px-6 text-base font-semibold">
                <div className="flex items-center">
                  Book Title
                  {renderSortIcon('bookTitle')}
                </div>
              </TableHead>
              <TableHead className="py-4 px-6 text-base font-semibold">User</TableHead>
              <TableHead className="py-4 px-6 text-base font-semibold">Book ID</TableHead>
              <TableHead className="py-4 px-6 text-base font-semibold">ISBN Number</TableHead>
              <TableHead className="py-4 px-6 text-base font-semibold">Status</TableHead>
              <TableHead className="py-4 px-6 text-base font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRequests.map((request) => (
              <TableRow key={request.id} className="hover:bg-gray-50">
                <TableCell className="py-4 px-6 text-base font-medium">{request.bookTitle}</TableCell>
                <TableCell className="py-4 px-6 text-base">{request.firstName}</TableCell>
                <TableCell className="py-4 px-6 text-base">{request.bookId}</TableCell>
                <TableCell className="py-4 px-6 text-base">{request.isbnNo}</TableCell>
                <TableCell className="py-4 px-6">
                  <div className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status)} w-fit`}>
                    {request.status}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  {request.status === "Pending" && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(request, 'approve')}
                        disabled={loadingStates[request.id]}
                        className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 px-4 py-2 text-sm"
                      >
                        {loadingStates[request.id] ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-5 w-5 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(request, 'reject')}
                        disabled={loadingStates[request.id]}
                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 text-sm"
                      >
                        {loadingStates[request.id] ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <X className="h-5 w-5 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        {sortedRequests.map((request) => (
          <div key={request.id} className="border-b border-gray-200 p-4 last:border-b-0">
            <div className="flex flex-col space-y-2 mb-4">
              <h3 className="text-lg font-medium">{request.bookTitle}</h3>
              <p className="text-sm text-gray-600">User: {request.firstName}</p>
              <p className="text-sm text-gray-600">Book ID: {request.bookId}</p>
              <p className="text-sm text-gray-600">ISBN: {request.isbnNo}</p>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)} w-fit`}>
                {request.status}
              </div>
            </div>
            {request.status === "Pending" && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(request, 'approve')}
                  disabled={loadingStates[request.id]}
                  className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 px-3 py-1 text-sm flex-1"
                >
                  {loadingStates[request.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(request, 'reject')}
                  disabled={loadingStates[request.id]}
                  className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-1 text-sm flex-1"
                >
                  {loadingStates[request.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}