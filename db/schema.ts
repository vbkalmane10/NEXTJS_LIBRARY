import { date, mysqlTable, serial, varchar, int } from "drizzle-orm/mysql-core";
export const membersTable = mysqlTable("members", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }),
  email: varchar("email", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 10 }),
  address: varchar("address", { length: 255 }),
  membershipStatus: varchar("membershipStatus", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  // refreshToken: varchar("refreshToken", { length: 255 }),
});
export const booksTable = mysqlTable("books", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  publisher: varchar("publisher", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 255 }).notNull(),
  pages: int("pages").notNull(),
  totalCopies: int("totalCopies").notNull(),
  availableCopies: int("availableCopies").notNull(),
});
export const transactionsTable = mysqlTable("transactions", {
  id: int("id").primaryKey().autoincrement(),
  bookId: int("bookId")
    .notNull()
    .references(() => booksTable.id), // Foreign key reference to booksTable
  memberId: int("memberId")
    .notNull()
    .references(() => membersTable.id), // Foreign key reference to membersTable
  issueDate: varchar("issueDate", { length: 25 }).notNull(),
  returnDate: varchar("returnDate", { length: 25 }),
  dueDate: varchar("dueDate", { length: 255 }).notNull(),
});
export const requestsTable = mysqlTable("requests", {
  id: int("id").primaryKey().autoincrement(),
  memberId: int("memberId")
    .notNull()
    .references(() => membersTable.id),
  bookId: int("bookId")
    .notNull()
    .references(() => booksTable.id),
  bookTitle: varchar("bookTitle", { length: 255 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 13 }).notNull(),
  status: varchar("status", { length: 255 }),
});
