"use client";
import React from "react";
import { Edit, RefreshCcw, Trash2 } from "lucide-react";
import { iMember, Professor } from "@/lib/types";
import {
  Table,
  TableBody,
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
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface AdminProfessorTableProps {
  users: Professor[];
  onRefresh: (email: string) => void;
  onEdit: (id: number | undefined) => void;
  //onDelete: (id: number | undefined) => void;
}

const AdminProfessorTable: React.FC<AdminProfessorTableProps> = ({
  users,
  onRefresh,
  onEdit,
  //onDelete,
}) => {
  const t = useTranslations("UserTable");
  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-md">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">{t("serialNo")}</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Short Bio</TableHead>
              <TableHead>Calendly Link</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {user.shortBio}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {user.calendlyLink}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-green-600 hover:bg-green-400 p-2 rounded transition-colors duration-200"
                      onClick={() => onEdit(user.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-red-600 hover:bg-red-400 p-2 rounded transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {user.name} will be deleted from our database
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog> */}
                    {!user.calendlyLink && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onRefresh(user.email)}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {users?.map((user, index) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="font-semibold">Email:</dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Department:</dt>
                  <dd>{user.department}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Short Bio:</dt>
                  <dd className="line-clamp-2">{user.shortBio}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Calendly Link:</dt>
                  <dd className="truncate">{user.calendlyLink}</dd>
                </div>
              </dl>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(user.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {/* <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {user.name} will be deleted from our database
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog> */}
                {!user.calendlyLink && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRefresh(user.email)}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProfessorTable;
