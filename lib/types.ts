import { JWT } from "next-auth/jwt";
import NextAuth, { DefaultSession } from "next-auth";
export interface iMemberBase {
  firstName: string;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  password: string | null;
}

export interface iMember extends iMemberBase {
  id: number;
  membershipStatus: string;
  role: string;
}
export interface Token {
  user?: iMember;
  [key: string]: unknown;
}

export interface SessionUser {
  id: number | undefined;
  email: string;
  name: string | undefined;
  role: string | undefined;
}

export interface Session {
  user: SessionUser;
}

export interface iBookBase {
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbnNo: string;
  pages: number;
  totalCopies: number;
  price: number | null;
  imageUrl?: string | null;
}
export interface iBook extends iBookBase {
  id: number;
  availableCopies: number;
}
export interface iTransactionBase {
  bookId: number;
  memberId: number;
}

export interface iTransaction extends iTransactionBase {
  issueDate: string | null;
  returnDate: string | null;
  dueDate: string | null;
}
export interface Request {
  id: number;
  memberId: number;
  bookId: number;
  bookTitle: string;
  isbnNo: string;
  status: string | null;
  firstName?: string | null;
  issueDate: string | null;
  returnDate: string | null;
  dueDate: string | null;
}
export type CreateRequest = Omit<Request, "id">;
export interface RequestStatistics {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
}
export interface ProfileContentProps {
  userInfo: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phoneNumber: string;
    membershipStatus: string;
    role: string;
    password: string;
  };
  statistics: RequestStatistics;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleEdit: () => void;
}
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      email: string;
      name: string;
      role: string;
      expires?: string;
    };
  }

  interface User {
    id: number;
    email: string;
    firstName: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string;
    name: string;
    role: string;
  }
}
export type CloudinaryUploadResponse = {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
};
export interface Professor {
  id?: number | undefined;
  name: string;
  email: string;
  department: string | null;
  shortBio: string | null;
  calendlyLink: string | null;
}
