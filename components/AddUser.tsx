"use client"

import React, { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "@/components/ui/input"
import { PulseLoader } from "react-spinners"
import { createMember } from "@/lib/MemberRepository/actions"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"

const userSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.number().min(1000000000, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(1, { message: "Address is required" }),
  membershipStatus: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, {
      message: "Password must contain at least one capital letter, one number, and one special character",
    }),
})

type UserFormData = z.infer<typeof userSchema>

export default function AddUser() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: 0,
    address: "",
    membershipStatus: "active",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<UserFormData>>({})
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phoneNumber" ? (value ? parseInt(value, 10) : 0) : value,
    }))
    // Clear the error for this field when the user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validatedData = userSchema.parse(formData)
      const result = await createMember({
        ...validatedData,
        phoneNumber: validatedData.phoneNumber.toString(), 
      })
      if (result) {
        toast({
          title: "Success",
          description: result.message,
          variant: "destructive",
          className: "bg-green-400 text-white",
          duration: 1000,
        })
        setIsModalOpen(false)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: 0,
          address: "",
          membershipStatus: "active",
          password: "",
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<UserFormData>)
      } else {
        console.error("Error adding user:", error)
        toast({
          title: "Error",
          description: "Failed to add user. Please try again.",
          variant: "destructive",
          duration: 1000,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button className="bg-black text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(true)}>
        + Add User
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-center">Add User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                     
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                  
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                   
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                 
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div className="flex justify-between">
                  {loading ? (
                    <div className="flex justify-center mt-4">
                      <PulseLoader color="#3498db" />
                    </div>
                  ) : (
                    <Button type="submit" className="w-50 bg-black">
                      Add User
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}