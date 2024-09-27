"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { iMember, Professor } from "../lib/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface EditUserFormProps {
  user: Professor;
  onClose: () => void;
  onSubmit: (updatedUser: Professor) => void;
  isPending: boolean;
}

const EditProfessorForm: React.FC<EditUserFormProps> = ({
  user,
  onClose,
  onSubmit,
  isPending,
}) => {
  const [formData, setFormData] = useState<Professor>({ ...user });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-center">Edit Professor</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
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
            <Label htmlFor="department">Department</Label>
            <Input
              type="text"
              name="department"
              value={formData.department!}
              onChange={handleChange}
              placeholder="Department"
              required
            />
          </div>
          <div>
            <Label htmlFor="shortBio">Short Bio</Label>
            <Input
              type="text"
              name="shortBio"
              value={formData.shortBio!}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>
          <div>
            <Label htmlFor="calendlylink">Calendly Link</Label>
            <Input
              type="text"
              name="calendlyLink"
              value={formData.calendlyLink ? formData.calendlyLink : ""}
              onChange={handleChange}
              placeholder="Calendly Link"
            />
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

export default EditProfessorForm;
