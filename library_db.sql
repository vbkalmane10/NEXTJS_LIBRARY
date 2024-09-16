-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: lms_db:3306
-- Generation Time: Sep 16, 2024 at 09:10 AM
-- Server version: 9.0.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `publisher` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `isbnNo` varchar(255) NOT NULL,
  `pages` int NOT NULL,
  `totalCopies` int NOT NULL,
  `availableCopies` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `publisher`, `genre`, `isbnNo`, `pages`, `totalCopies`, `availableCopies`) VALUES
(17, 'Programming Fundamentals', 'Kenneth Leroy Busbee', 'No Starch', 'Computers', '9789888407491', 340, 5, 1),
(18, 'COMPUTER PROGRAMMING IN FORTRAN 77', 'V. RAJARAMAN', 'PHI Learning Pvt. Ltd.', 'Computers', '9788120311725', 212, 5, 3),
(19, 'Elements of Programming', 'Alexander A. Stepanov, Paul McJones', 'Addison-Wesley Professional', 'Computers', '9780321635372', 279, 4, 1),
(20, 'Programming in Lua', 'Roberto Ierusalimschy', 'Roberto Ierusalimschy', 'Computers', '9788590379829', 329, 10, 9),
(21, 'Programming Persistent Memory', 'Steve Scargall', 'Apress', 'Computers', '9781484249321', 384, 2, 1),
(22, 'Programming Problems', 'B. Green', 'Createspace Independent Pub', 'Computers', '9781475071962', 156, 9, 9),
(23, 'Expert Python Programming', 'Michał Jaworski, Tarek Ziadé', 'Packt Publishing Ltd', 'Computers', '9781801076197', 631, 4, 4),
(24, 'Practical Goal Programming', 'Dylan Jones, Mehrdad Tamiz', 'Springer Science & Business Media', 'Business & Economics', '9781441957719', 180, 9, 9),
(25, 'Fundamentals of Computer Programming with C#', 'Svetlin Nakov, Veselin Kolev', 'Faber Publishing', 'Computers', '9789544007737', 1132, 8, 8),
(26, 'Code', 'Charles Petzold', 'Microsoft Press', 'Computers', '9780137909292', 562, 11, 10),
(27, 'Programming in Python 3', 'Mark Summerfield', 'Pearson Education', 'Computers', '9780321606594', 552, 5, 5),
(28, 'Programming In C: A Practical Approach', 'Ajay Mittal', 'Pearson Education India', 'C (Computer program language)', '9788131729342', 768, 4, 4),
(29, 'The C++ Programming Language', 'Bjarne Stroustrup', 'Pearson Education India', 'C++ (Computer program language)', '9788131705216', 1034, 6, 6),
(30, 'Practical C++ Programming', 'Steve Oualline', '\"O\'Reilly Media, Inc.\"', 'Computers', '9781449367169', 576, 11, 11),
(31, 'Programming Erlang', 'Joe Armstrong', 'Pragmatic Bookshelf', 'Computers', '9781680504323', 755, 8, 7),
(32, 'Programming in Modula-3', 'Laszlo Böszörmenyi, Carsten Weich', 'Springer', 'Computers', '9783642646140', 571, 11, 11),
(33, 'The History Book', 'DK', 'Dorling Kindersley Ltd', 'History', '9780241282229', 354, 8, 8),
(34, 'The Lessons of History', 'Will Durant, Ariel Durant', 'Simon and Schuster', 'History', '9781439170199', 128, 3, 3),
(35, 'The History Book', 'Dorling Kindersley Publishing Staff', '', 'History', '9780241225929', 0, 3, 3),
(36, 'A Companion to the History of the Book', 'Simon Eliot, Jonathan Rose', 'John Wiley & Sons', 'Literary Criticism', '9781444356588', 617, 10, 10),
(37, 'The American College and University', 'Frederick Rudolph', 'University of Georgia Press', 'Education', '9780820312842', 592, 3, 3),
(38, 'That\'s Not in My American History Book', 'Thomas Ayres', 'Taylor Trade Publications', 'United States', '9781589791077', 257, 4, 4),
(39, 'An Introduction to Book History', 'David Finkelstein, Alistair McCleery', 'Routledge', 'Social Science', '9781134380060', 167, 10, 10),
(40, 'The Little Book of History', 'DK', 'Dorling Kindersley Ltd', 'History', '9780241547489', 503, 11, 11),
(41, 'End of History and the Last Man', 'Francis Fukuyama', 'Simon and Schuster', 'History', '9781416531784', 464, 5, 5),
(42, 'The Cambridge Companion to the History of the Book', 'Leslie Howsam', 'Cambridge University Press', 'Language Arts & Disciplines', '9781107023734', 301, 10, 10),
(43, 'A Little History of the World', 'E. H. Gombrich', 'Yale University Press', 'History', '9780300213973', 401, 5, 5),
(44, 'The History Book (Miles Kelly).', 'MAKE BELIEVE IDEAS LTD. MAKE BELIEVE IDEAS LTD, Simon Adams, Philip Steele, Stewart Ross, Richard Platt', '', 'World history', '9781805443407', 0, 11, 11),
(45, 'Encyclopedia of Local History', 'Carol Kammen, Amy H. Wilson', 'Rowman & Littlefield Publishers', 'United States', '9780759120488', 0, 4, 4),
(46, 'History at the Limit of World-History', 'Ranajit Guha', 'Columbia University Press', 'History', '9780231505093', 156, 2, 2),
(47, 'A World at Arms', 'Gerhard L. Weinberg', 'Cambridge University Press', 'History', '9780521618267', 1216, 9, 9),
(48, 'Quirky History', 'Mini Menon', 'Harper Collins', 'Juvenile Nonfiction', '9789353578800', 184, 4, 4),
(49, 'A History of Modern India, 1480-1950', 'Claude Markovits', 'Anthem Press', 'History', '9781843311522', 617, 9, 9),
(50, 'Rethinking History', 'Keith Jenkins', 'Routledge', 'History', '9781134408283', 116, 4, 4),
(51, 'A History of History', 'Alun Munslow', 'Routledge', 'History', '9780415677141', 236, 10, 10),
(52, 'A History of India', 'Hermann Kulke, Dietmar Rothermund', 'Psychology Press', 'India', '9780415154826', 406, 3, 3),
(53, 'An Introduction to Book History', 'David Finkelstein, Alistair McCleery', 'Routledge', 'Design', '9780415688055', 178, 9, 9),
(54, 'What Is History, Now?', 'Suzannah Lipscomb, Helen Carr', 'Hachette UK', 'History', '9781474622486', 285, 2, 2),
(55, 'The Oxford Illustrated History of the Book', 'James Raven', 'Oxford University Press', 'Crafts & Hobbies', '9780191007507', 468, 4, 4),
(56, 'A Textbook of Historiography, 500 B.C. to A.D. 2000', 'E. Sreedharan', 'Orient Blackswan', 'History', '9788125026570', 600, 6, 6),
(57, 'A Concise History of Greece', 'Richard Clogg', 'Cambridge University Press', 'History', '9780521004794', 316, 6, 6),
(58, 'Time and Power', 'Christopher Clark', 'Princeton University Press', 'History', '9780691217321', 310, 7, 7),
(59, 'International Law and the Politics of History', 'Anne Orford', 'Cambridge University Press', 'History', '9781108480949', 395, 9, 9),
(60, 'National Geographic History Book', 'Marcus Cowper', 'National Geographic Books', 'History', '9781426206795', 188, 6, 6),
(61, 'Search History', 'Eugene Lim', 'Coffee House Press', 'Fiction', '9781566896269', 162, 8, 8),
(62, 'A History of the Modern World', 'Ranjan Chakrabarti', 'Primus Books', 'History, Modern', '9789380607504', 0, 6, 6),
(63, 'Sapiens', 'Yuval Noah Harari', 'Random House', 'History', '9781448190690', 353, 5, 5),
(64, 'The Past Before Us', 'Romila Thapar', 'Harvard University Press', 'History', '9780674726529', 915, 3, 3),
(65, 'History Education and Conflict Transformation', 'Charis Psaltis, Mario Carretero, Sabina Čehajić-Clancy', 'Springer', 'Education', '9783319546810', 389, 6, 6),
(66, 'The Calling of History', 'Dipesh Chakrabarty', 'University of Chicago Press', 'Biography & Autobiography', '9780226100456', 315, 4, 4),
(67, 'What is the History of the Book?', 'James Raven', 'John Wiley & Sons', 'History', '9781509523214', 196, 11, 11),
(68, 'Wise & Otherwise', 'Sudha Murthy', 'Penguin UK', 'Literary Collections', '9788184759006', 232, 3, 3),
(69, 'The Tastiest Of All', 'Sudha Murthy', 'Penguin UK', 'Juvenile Fiction', '9789351183594', 12, 7, 7),
(70, 'Grandma\'s Bag of Stories', 'Sudha Murthy', 'Puffin', 'Children\'s stories', '9780143333623', 192, 9, 9),
(71, 'The Seed of Truth', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183563', 13, 3, 3),
(72, 'The Day I Stopped Drinking Milk', 'Sudha Murthy', 'Penguin UK', 'Literary Collections', '9789351180555', 14, 4, 4),
(73, 'The Call', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180715', 10, 11, 11),
(74, 'A Fair Deal', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183556', 13, 6, 6),
(75, 'Three Women, Three Ponds', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180593', 10, 7, 7),
(76, 'Helping the Dead', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180586', 0, 5, 5),
(77, 'Genes', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180579', 0, 9, 9),
(78, 'A Woman\'s Ritual', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180685', 10, 3, 3),
(79, 'The Gift of Sacrifice', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180630', 0, 7, 7),
(80, 'No Man’s Garden', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180609', 0, 8, 8),
(81, 'The Best Friend', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183693', 13, 2, 2),
(82, 'Hindu Mother, Muslim Son', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180531', 10, 10, 10),
(83, 'The Selfish Groom', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183860', 13, 11, 11),
(84, 'Uncle Sam', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180708', 0, 7, 7),
(85, 'The Wise King', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183662', 13, 2, 2),
(86, 'Lazy Portado', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180692', 0, 9, 9),
(87, 'Miserable Success', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180678', 0, 8, 8),
(88, 'Good Luck, Gopal', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183709', 14, 9, 9),
(89, 'Do You Remember?', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180739', 0, 3, 3),
(90, 'Teen Hazar Tanke', 'Sudha Murthy', '', 'Fiction', '9789352667437', 178, 3, 3),
(91, 'The Clever Brothers', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183761', 12, 10, 10),
(92, 'Sharing with a Ghost', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180654', 0, 2, 2),
(93, 'Sticky Bottoms', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180616', 0, 5, 5),
(94, 'Foot in the Mouth', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180661', 0, 10, 10),
(95, 'MANADA MATU', 'Smt. Sudha Murthy', 'Sapna Book House (P) Ltd.', 'Authors, Kannada', '9788128004353', 186, 10, 10),
(96, 'Apna Deepak Swayam Banen', 'Sudha Murty', 'Prabhat Prakashan', 'Self-Help', '9788173155000', 90, 2, 2),
(97, 'Dollar Bahoo', 'Sudha Murty', 'Prabhat Prakashan', 'Fiction', '9788173153501', 99, 8, 8),
(98, 'Common Yet Uncommon (Hindi)/Sadharan Phir Bhi Asadharan/साधारण फिर भी असाधारण', 'Sudha Murthy/सुधा मूर्ति', 'Penguin Random House India Private Limited', 'Fiction', '9789357088961', 181, 9, 9),
(99, 'KANNADA : SAMANYARALLI ASAMANYARU', 'Smt. Sudha Murthy', 'Sapna Book House (P) Ltd.', 'Short stories, Kannada', '9788128005039', 183, 4, 4),
(100, 'Magic in the Air', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183853', 14, 5, 5),
(101, 'Emperor of Alakavati', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183730', 17, 8, 8),
(102, 'The Last Laddoo', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183587', 13, 8, 8),
(103, 'The White Crow', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183631', 13, 5, 5),
(104, 'The Magic Drum', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183907', 14, 7, 7),
(105, 'Sita', 'Amish Tripathi', 'Harper Collins', 'Fiction', '9789356290945', 333, 9, 9),
(106, 'The Oath of the Vayuputras', 'Amish Tripathi', 'Hachette UK', 'Fiction', '9781780874104', 400, 2, 2),
(107, 'The Bachelor Dad', 'Tusshar Kapoor', 'Penguin Random House India Private Limited', 'Biography & Autobiography', '9789354924255', 192, 5, 5),
(108, 'Xx C. Top', 'Vytenis Rozukas', 'AuthorHouse', 'Fiction', '9781496976987', 295, 3, 3),
(109, 'The Nine-Chambered Heart', 'Janice Pariat', 'Harper Collins', 'Fiction', '9789352773800', 216, 11, 11),
(110, 'Ramayana Pack (4 Volumes)', 'Shubha Vilas', 'Jaico Publishing House', 'Self-Help', '9789386867650', 1303, 6, 6),
(111, 'The Secret Of The Nagas (Shiva Trilogy Book 2)', 'Amish Tripathi', 'Harper Collins', 'Fiction', '9789356290679', 337, 3, 3),
(112, 'Ancient Promises', 'Jaishree Misra', 'Penguin Books India', 'East Indians', '9780140293593', 324, 6, 6),
(113, 'Advances in Computer and Computational Sciences', 'Sanjiv K. Bhatia, Krishn K. Mishra, Shailesh Tiwari, Vivek Kumar Singh', 'Springer', 'Technology & Engineering', '9789811037733', 713, 4, 4),
(114, 'The Sialkot Saga', 'Ashwin Sanghi', 'Harper Collins', 'Fiction', '9789356292468', 546, 2, 2),
(115, 'Son of the Thundercloud', 'Easterine Kire', '', 'Fiction', '9789386338143', 152, 4, 4),
(116, 'Fluid', 'Ashish Jaiswal', '', 'Education', '9788183285278', 256, 7, 7),
(117, 'The Liberation of Sita', 'Volga', 'Harper Collins', 'Fiction', '9789352775026', 128, 6, 6),
(118, 'The Eternal World', 'Christopher Farnsworth', 'HarperCollins', 'Fiction', '9780062282934', 365, 9, 9),
(119, 'Keepers of the Kalachakra', 'Ashwin Sanghi', 'Harper Collins', 'Fiction', '9789356292482', 374, 3, 3),
(120, 'Digital Hinduism', 'Xenia Zeiler', 'Routledge', 'Religion', '9781351607322', 304, 8, 8),
(121, 'The Illuminated', 'Anindita Ghose', 'Harper Collins', 'Fiction', '9789354226182', 234, 4, 4),
(122, 'Boats on Land', 'Janice Pariat', 'Random House India', 'Fiction', '9788184003390', 200, 6, 6),
(123, 'Cuckold', 'Kiran Nagarkar', 'Harper Collins', 'Fiction', '9789351770107', 633, 10, 10),
(124, 'Stories We Never Tell', 'Savi Sharma', 'Harper Collins', 'Fiction', '9789356293304', 204, 7, 7),
(125, 'The Fisher Queen\'s Dynasty', 'Kavita Kané', 'Rupa Publ iCat Ions India', 'Fiction', '9789355208767', 0, 10, 10),
(126, 'Chander and Sudha', 'Dharamvir Bharati', 'Penguin UK', 'Fiction', '9788184750294', 360, 6, 6),
(127, 'Living with Merlin', 'Anita Bakshi', 'Partridge Publishing', 'Self-Help', '9781482840193', 233, 8, 8),
(128, 'Ramayana: The Game of Life – Book 2: Conquer Change', 'Shubha Vilas', 'Jaico Publishing House', 'Religion', '9789386348906', 404, 9, 9),
(129, 'Food Fights', 'Charles C. Ludington, Matthew Morse Booker', '', 'Cooking', '9781469652894', 304, 8, 8),
(130, 'The Shape of Design', 'Frank Chimero', '', 'Design', '9780985472207', 131, 6, 6),
(131, 'Everyone Has a Story', 'Savi Sharma', '', 'Friendship', '9789386036759', 0, 8, 8),
(132, 'Go Kiss the World', 'Subroto Bagchi', 'Penguin Books India', 'Executives', '9780670082308', 260, 8, 8),
(133, 'Scion of Ikshvaku', 'Amish, Amish Tripathi', 'Westland Publication Limited', 'Hindu mythology', '9789385152146', 0, 6, 6),
(134, 'The Sand Fish', 'Maha Gargash', 'Harper Collins', 'Fiction', '9780061959868', 0, 3, 3),
(135, '2 States: The Story of My Marriage (Movie Tie-In Edition)', 'Chetan Bhagat', 'Rupa Publications', 'Fiction', '9788129132543', 280, 10, 10),
(136, 'The Woman on the Orient Express', 'Lindsay Jayne Ashford', 'Charnwood', 'Female friendship', '9781444836714', 416, 7, 7),
(137, 'Let\'s Talk Money', 'Monika Halan', 'Harper Collins', 'Business & Economics', '9789352779406', 184, 8, 8),
(138, 'Blind Faith', 'Sagarika Ghose', 'Harper Collins', 'Fiction', '9789351367994', 188, 3, 3),
(139, 'Dysmorphic Kingdom', 'Colleen Chen', '', 'Fantasy fiction', '9781940233239', 320, 6, 6),
(140, 'Advice and Dissent', 'Y.V. Reddy', 'Harper Collins', 'Biography & Autobiography', '9789352643059', 496, 7, 7),
(141, 'Angels & Demons', 'Dan Brown', 'Simon and Schuster', 'Fiction', '9780743493468', 496, 11, 11),
(142, 'Angels and Demons', 'Dan Brown', 'Corgi Books', 'Fiction', '9780552160896', 0, 3, 3),
(143, 'Angels & Demons', 'Dan Brown', 'Simon and Schuster', 'Anti-Catholicism', '9781416528654', 8, 9, 9),
(144, 'Angels & Demons Special Illustrated Edition', 'Dan Brown', 'Simon and Schuster', 'Fiction', '9780743277716', 532, 10, 10),
(145, 'Angels and Demons', 'Dan Brown', 'Random House', 'Anti-Catholicism', '9780552173469', 642, 5, 5),
(146, 'Angels and Demons', 'Serge-Thomas Bonino', 'CUA Press', 'Religion', '9780813227993', 345, 10, 10),
(147, 'Angels and Demons', 'Peter Kreeft', 'Ignatius Press', 'Religion', '9781681490380', 164, 4, 4),
(148, 'Angels and Demons', 'Benny Hinn', 'Benny Hinn Ministries', 'Religion', '9781590244593', 208, 11, 11),
(149, 'Dan Brown’s Robert Langdon Series', 'Dan Brown', 'Random House', 'Fiction', '9781473543201', 2082, 6, 6),
(150, 'The Mammoth Book of Angels & Demons', 'Paula Guran', 'Hachette UK', 'Fiction', '9781780338002', 405, 8, 8),
(151, 'The Eight', 'Katherine Neville', 'Open Road Media', 'Fiction', '9781504013673', 523, 5, 5),
(152, 'Angels, Demons and the New World', 'Fernando Cervantes, Andrew Redden', 'Cambridge University Press', 'Body, Mind & Spirit', '9780521764582', 331, 9, 9),
(153, 'Angels and Demons', 'Ron Phillips', 'Charisma Media', 'Body, Mind & Spirit', '9781629980348', 289, 11, 11),
(154, 'Angels And Demons', 'Dan Brown', 'Random House', 'Fiction', '9781409083948', 663, 4, 4),
(155, 'Secrets of Angels and Demons', 'Daniel Burstein', '', 'Popes in literature', '9780752876931', 595, 5, 5),
(156, 'Angels, Demons & Gods of the New Millenium', 'Lon Milo Duquette', 'Weiser Books', 'Body, Mind & Spirit', '9781578630103', 196, 4, 4),
(157, 'Angels and Demons in Art', 'Rosa Giorgi', 'Getty Publications', 'Angels in art', '9780892368303', 384, 3, 3),
(158, 'Demon Angel', 'Meljean Brook', 'Penguin', 'Fiction', '9781101568026', 411, 4, 4),
(159, 'Angels & Demons Rome', 'Angela K. Nickerson', 'Roaring Forties Press', 'Travel', '9780984316557', 71, 2, 2),
(160, 'What Does the Bible Say About Angels and Demons?', 'John Gillman, Clifford M. Yeary', 'New City Press', 'Religion', '9781565483804', 93, 9, 9),
(161, 'The Sherlock Holmes Mysteries', 'Sir Arthur Conan Doyle', 'Penguin', 'Fiction', '9780698168237', 546, 4, 4),
(162, 'Demons & Angels', 'J.K. Norry', 'Sudden Insight Publishing', 'Fiction', '9780990728030', 278, 5, 5),
(163, 'A Brief History of Angels and Demons', 'Sarah Bartlett', 'Hachette UK', 'Body, Mind & Spirit', '9781849018289', 164, 5, 5),
(164, 'Demons, Angels, and Writing in Ancient Judaism', 'Annette Yoshiko Reed', 'Cambridge University Press', 'Religion', '9780521119436', 365, 11, 11),
(165, 'An Angel, a Demon, a Candle', 'Cordelia Faass', 'Xlibris Corporation', 'Fiction', '9781479746750', 99, 4, 4),
(166, 'Sense and Nonsense about Angels and Demons', 'Kenneth Boa, Robert M. Bowman Jr.', 'Zondervan', 'Religion', '9780310254294', 161, 4, 3),
(167, 'Origin', 'Dan Brown', 'Mizan Publishing', 'Fiction', '9786022914426', 575, 11, 11),
(168, 'Angels, Satan and Demons', 'Robert Paul Lightner', 'Thomas Nelson', 'Angels', '9780849913716', 0, 10, 10),
(169, 'The Truth About Angels and Demons', 'Tony Evans', 'Moody Publishers', 'Religion', '9781575677286', 64, 11, 11),
(170, 'Angelfall', 'Susan Ee', 'Hachette UK', 'Fiction', '9781444778526', 320, 10, 9),
(171, 'Deception Point', 'Dan Brown', 'Pocket Books', 'Fiction', '9781982122355', 752, 9, 9),
(172, 'The Magick of Angels and Demons', 'Henry Archer', 'Independently Published', 'Body, Mind & Spirit', '9781796703405', 230, 6, 6),
(173, 'Angels, Demons, and the Devil', 'F. Lagard Smith', 'Cotswold Publishing', 'Religion', '9780966006063', 254, 9, 9);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `address` varchar(255) NOT NULL,
  `membershipStatus` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `firstName`, `lastName`, `email`, `phoneNumber`, `address`, `membershipStatus`, `password`, `role`) VALUES
(296, 'admin', 'admin', 'admin@gmail.com', '8088927857', 'Mangaluru', 'active', '$2b$10$jyrvRVlxPt6FT0dRi5gfEeAWuUALFfS.z0/sSe4fcO9.9lcGmPENW', 'admin'),
(297, 'Virat', 'Kohli', 'virat@gmail.com', '9448075038', 'Mumbai', 'active', '$2b$10$TWQP5bwK9Pr3IqdbaMeP..dNC0d6TdYxewTC4dNtXzRbA8l/Qbd/2', 'user'),
(302, 'Vinayak', 'Kalmane', 'vinayakkalmane10@gmail.com', '9448045038', 'Mangaluru', 'active', '$2b$10$IXNrAW1b7imJr00P74G.Cek2ojK7AjH66QBJMZ9e7ZRCc7lvGem9i', 'user'),
(303, 'Test', 'Test', 'test@gmail.com', '8088927859', 'Mangaluru', 'expired', '$2b$10$e2CWFTNCML/NiGrLgrbSMeWgc.lLTTiKlwFTl0UNpUb8Z25i3iRQy', 'user'),
(305, 'A', 'A', 'A@GMAIL.COM', '9448047038', 'Mangaluru', 'active', '$2b$10$ThmdeTvtztH83DO8dxTYT.LSGoTQGEXw0VmMoIcrckj.V7Eh5RyDK', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--



-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `bookId` int NOT NULL,
  `bookTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `isbnNo` varchar(13) NOT NULL,
  `memberId` int NOT NULL,
  `issueDate` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `returnDate` varchar(25) DEFAULT NULL,
  `dueDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `firstName` varchar(255) NOT NULL,
  `status` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `bookId`, `bookTitle`, `isbnNo`, `memberId`, `issueDate`, `returnDate`, `dueDate`, `firstName`, `status`) VALUES
(49, 17, 'Programming Fundamentals', '9789888407491', 302, '2024-09-16', NULL, '2024-09-30', 'Vinayak Kalmane', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `__drizzle_migrations`
--

CREATE TABLE `__drizzle_migrations` (
  `id` bigint UNSIGNED NOT NULL,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `__drizzle_migrations`
--

INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES
(1, 'b5ed32eb5301b91d7fcb73b8f88332f2ed00cfd38dfa777f95ee85066b1d3a4b', 1721968016793),
(2, '89bd7bc48f17d0dc4d4a41b99bcf10f2236e91d1d2d8c0631c0958e7a0175b59', 1721974302275),
(3, '380c8a0f6abeb1c52ca26dc0259e9526e8fd3f9ef108f8bec46d0d4bbc0f0989', 1723445824294),
(4, 'eb744a55eb58d7034f193977a07347450ceec1e38d62d2a4ee6be0a3bdf1a221', 1723463054800),
(5, '8378d54e47dc5cd1d6b758187587dd34fe50f8fcd2aa3df13277a64b5cbcea55', 1723464556796),
(6, 'afc7f68ce3db83f14febd2576d21293f4c630e525aabddc883ceaaf97ddbd895', 1723608226209),
(7, '3b3dfd86cbe5284e3a2583ab87589a6679f999fb3503bf211d3cc3ed616c46d6', 1723609631164),
(8, '9c47c1f8e3b9fa1b0cf5ee4a2c27b6f3cc5f6d58f66693ae4b38aed24be56918', 1723609991066),
(9, '17b15964efb1d3e5391c172a1769361778737a50bf1164c5939fbed3078f17c2', 1724752189435),
(10, '8a64af800463f831fe031020eabb2649c9d745e55a629d914baf36eb0be079cf', 1724752447085),
(11, '588321ac1833f7ea2c04ea4f9289a0baf88ec4f1ff833fcdb1c96695a7717770', 1724766384973),
(12, 'd4ddb5f7251abd5cd4505eeaae847663a206d15af5b20dfcb30dcadd8595899f', 1724766543358),
(13, '4c04d185c3d636efbf3787d4e7cd4e014c10ca8faf12fcfbf5e0c651cf7673ec', 1724766615189),
(14, 'b5d1013e7fe13e05162f98552d937751c6f2a6abc07a4e7b740633d40e24f919', 1724767196000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `members_email_unique` (`email`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`),
  ADD KEY `bookId` (`bookId`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactions_bookId_books_id_fk` (`bookId`),
  ADD KEY `transactions_memberId_members_id_fk` (`memberId`);

--
-- Indexes for table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=219;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=306;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`),
  ADD CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`),
  ADD CONSTRAINT `transactions_memberId_members_id_fk` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
