import { pgTable, serial, varchar, integer, text } from "drizzle-orm/pg-core";
export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }),
  email: varchar("email", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 10 }),
  address: varchar("address", { length: 255 }),
  membershipStatus: varchar("membershipStatus", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
});
export const booksTable = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  publisher: varchar("publisher", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 255 }).notNull(),
  pages: integer("pages").notNull(),
  totalCopies: integer("totalCopies").notNull(),
  availableCopies: integer("availableCopies").notNull(),
  price: integer("price"),
  imageUrl: varchar("imageUrl", { length: 255 }),
});
export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId")
    .notNull()
    .references(() => booksTable.id),
  bookTitle: varchar("bookTitle", { length: 255 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 13 }).notNull(),
  memberId: integer("memberId")
    .notNull()
    .references(() => membersTable.id),

  issueDate: varchar("issueDate", { length: 25 }),
  returnDate: varchar("returnDate", { length: 25 }),
  dueDate: varchar("dueDate", { length: 255 }),
  firstName: varchar("firstName", { length: 255 }),
  status: varchar("status", { length: 255 }),
});
export const professorsTable = pgTable("professors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  department: varchar("department", { length: 100 }),
  shortBio: text("shortBio"),
  calendlyLink: varchar("calendly_link", { length: 255 }).notNull(),
});
// export const requestsTable = mysqlTable("requests", {
//   id: int("id").primaryKey().autoincrement(),
//   memberId: int("memberId")
//     .notNull()
//     .references(() => membersTable.id),
//   bookId: int("bookId")
//     .notNull()
//     .references(() => booksTable.id),
//   bookTitle: varchar("bookTitle", { length: 255 }).notNull(),
//   isbnNo: varchar("isbnNo", { length: 13 }).notNull(),
//   status: varchar("status", { length: 255 }),
// });
