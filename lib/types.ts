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
  id: number;
  email: string;
  name: string;
  role: string;
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
  issueDate: string;
  returnDate: string | null;
  dueDate: string;
}
export interface Request {
  id: number;
  memberId: number;
  bookId: number;
  bookTitle: string;
  isbnNo: string;
  status: string | null;
}
export interface RequestStatistics {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
}