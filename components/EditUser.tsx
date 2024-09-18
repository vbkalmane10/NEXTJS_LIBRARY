"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { iMember } from "../lib/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

interface EditUserFormProps {
  user: iMember;
  onClose: () => void;
  onSubmit: (updatedUser: iMember) => void;
  isPending: boolean;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  onClose,
  onSubmit,
  isPending,
}) => {
  const [formData, setFormData] = useState<iMember>({ ...user });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      membershipStatus: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md mx-auto flex justify-center items-center">
      <h2 className="text-2xl font-semibold text-center">Edit User</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Firstname</Label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Lastname</Label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName ?? ""}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber ?? ""}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              name="address"
              value={formData.address ?? ""}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
          <div>
            <Label htmlFor="membershipStatus">Membership Status</Label>
            <Select
              value={formData.membershipStatus}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-black bg-transparent rounded hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-white bg-black rounded hover:bg-blue-600"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
