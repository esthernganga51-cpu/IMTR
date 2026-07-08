

import type { CourseRecord, StudentEnrollmentRecord } from "@/features/course- management/courses.types";
import type { StaffRecord } from "@/features/staff-management/types/staff";

export type { CourseRecord, StudentEnrollmentRecord };

type RoomStatus = "available" | "occupied" | "maintenance" | "reserved";

export interface SectionRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  budget?: number;
  headId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface StudentRecord {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  studentType: "KENYAN" | "INTERNATIONAL";
  nationalIdNumber: string | null;
  passportNumber: string | null;
  nationality: string | null;
  course: string;

  level: string;
  intake: string;
  department: string;
  status: "active" | "inactive" | "graduated" | "suspended";
  enrollmentDate: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HostelRoomRecord {
  id: string;
  roomNumber: string;
  floor: number;
  block: string;
  capacity: number;
  type: "single" | "double" | "triple";
  gender: "male" | "female" | "co-ed";
  status?: RoomStatus;
  amenities: string;
  updatedAt: Date;
}

export interface RoomBookingRecord {
  id: string;
  roomId: string;
  studentId: string;
  semester: string;
  occupantCount: number;
  status: string;
  bookedAt: Date;
  releasedAt?: Date;
}

export interface StudentClearanceRecord {
  studentId: string;
  studentName: string;
  applicationId: string;
  updatedAt: Date;
}

export interface DepartmentClearanceRecord {
  studentId: string;
  departmentId: string;
  status: string;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  updatedAt?: Date;
}

export type DepartmentRecord = SectionRecord;


export interface BookCategoryRecord {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthorRecord {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PublisherRecord {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookStatus = "available" | "borrowed" | "reserved" | "lost" | "damaged";

export interface BookRecord {
  id: string;
  isbn: string;
  title: string;
  barcode?: string;
  authorId: string;
  publisherId: string;
  categoryId: string;
  edition?: string;
  yearPublished?: number;
  shelfLocation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookCopyRecord {
  id: string;
  bookId: string;
  copyNumber: string;
  status: BookStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BorrowTransactionRecord {
  id: string;
  borrowerType: "student" | "staff";
  borrowerId: string;
  bookCopyId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  expectedReturnDate?: Date;
  librarianProcessing?: string;
  remarks?: string;
  returnedAt?: Date;
  returnCondition?: BookStatus;
}

export interface ReservationRecord {
  id: string;
  borrowerType: "student" | "staff";
  borrowerId: string;
  bookId: string;
  reservedAt: Date;
  expiryDate: Date;
  position: number;
  cancelledAt?: Date;
}

export interface FineRecord {
  id: string;
  transactionId: string;
  borrowerType: "student" | "staff";
  borrowerId: string;
  daysOverdue: number;
  amount: number;
  status: "unpaid" | "paid" | "waived";
  receiptNumber?: string;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LibrarySettingsRecord {
  id: string;
  maximumBooksPerStudent: number;
  maximumBooksPerStaff: number;
  borrowingPeriodDays: number;
  finePerDay: number;
  libraryOpeningHours?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DatabaseState {

  initialized: boolean;
  students: StudentRecord[];
  staff: StaffRecord[];
  departments: DepartmentRecord[];



  hostelRooms: HostelRoomRecord[];
  roomBookings: RoomBookingRecord[];
  studentClearances: StudentClearanceRecord[];
  departmentClearances: DepartmentClearanceRecord[];
  courses: CourseRecord[];
  enrollments: StudentEnrollmentRecord[];

  // Library module
  book_categories: BookCategoryRecord[];
  authors: AuthorRecord[];
  publishers: PublisherRecord[];
  books: BookRecord[];
  book_copies: BookCopyRecord[];
  borrow_transactions: BorrowTransactionRecord[];
  reservations: ReservationRecord[];
  fines: FineRecord[];
  library_settings: LibrarySettingsRecord[];
}




const database: DatabaseState = {
  initialized: false,
  students: [],
  staff: [],
  departments: [],
  hostelRooms: [],
  roomBookings: [],
  studentClearances: [],
  departmentClearances: [],
  courses: [],
  enrollments: [],

  book_categories: [],
  authors: [],
  publishers: [],
  books: [],
  book_copies: [],
  borrow_transactions: [],
  reservations: [],
  fines: [],
  library_settings: [],
};


function ensureInitialized() {
  if (database.initialized) {
    return;
  }

  database.initialized = true;
  // Seed empty collections or sample data if needed.
  database.departments = [];
  database.students = [];
  database.staff = [];
  database.hostelRooms = [];
  database.roomBookings = [];
  database.studentClearances = [];
  database.departmentClearances = [];
  database.courses = [];
  database.enrollments = [];

  database.book_categories = [];
  database.authors = [];
  database.publishers = [];
  database.books = [];
  database.book_copies = [];
  database.borrow_transactions = [];
  database.reservations = [];
  database.fines = [];
  database.library_settings = [];
}


function findById<T extends { id: string }>(collection: T[], id: string): T | null {
  return collection.find((item) => item?.id === id) || null;
}

function updateRecord<T extends { id: string }>(
  collection: T[],
  id: string,
  updates: Partial<T>
): T | null {
  const record = findById(collection, id);
  if (!record) return null;
  Object.assign(record, updates);
  return record;
}

function deleteRecord<T extends { id: string }>(collection: T[], id: string): boolean {
  const index = collection.findIndex((item) => item?.id === id);
  if (index === -1) return false;
  collection.splice(index, 1);
  return true;
}

export function initializeDatabase() {
  ensureInitialized();
}

export const db = {
  getAllStudents: () => database.students,
  getStudent: (id: string) => findById(database.students, id),
  getStudentByAdmissionNumber: (admissionNumber: string) =>
    database.students.find((student) => student?.admissionNumber === admissionNumber) || null,
  getStudentsByDepartment: (department: string) =>
    database.students.filter((student) => student?.department === department),
  getStudentsByStatus: (status: string) =>
    database.students.filter((student) => student?.status === status),
  insertStudent: (student: StudentRecord) => {
    database.students.push(student);
    return student;
  },
  updateStudent: (id: string, updates: Partial<StudentRecord>) =>
    updateRecord(database.students, id, updates),
  deleteStudent: (id: string) => deleteRecord(database.students, id),

  getAllStaff: () => database.staff,
  getStaff: (id: string) => findById(database.staff, id),
  getStaffByEmployeeId: (employeeId: string) =>
    database.staff.find((staff) => staff?.employeeId === employeeId) || null,
  getStaffByDepartment: (department: string) =>
    database.staff.filter((staff) => staff?.department === department),
  insertStaff: (staff: StaffRecord) => {
    database.staff.push(staff);
    return staff;
  },
  updateStaff: (id: string, updates: Partial<StaffRecord>) =>
    updateRecord(database.staff, id, updates),
  deleteStaff: (id: string) => deleteRecord(database.staff, id),

  getAllDepartments: () => database.departments,
  getDepartmentByCode: (code: string) =>
    database.departments.find((dept) => dept?.code === code) || null,
  getDepartmentById: (id: string) => findById(database.departments, id),
  insertDepartment: (department: DepartmentRecord) => {
    database.departments.push(department);
    return department;
  },
  updateDepartment: (id: string, updates: Partial<DepartmentRecord>) =>
    updateRecord(database.departments, id, updates),
  deleteDepartment: (id: string) => deleteRecord(database.departments, id),

  getAllCourses: () => database.courses,
  getCourseById: (id: string) => findById(database.courses, id),
  getCourseByCode: (code: string) =>
    database.courses.find((course) => course?.code === code) || null,
  getCoursesByDepartment: (department: string) =>
    database.courses.filter((course) => course?.department === department || course?.departmentId === department),
  insertCourse: (course: CourseRecord) => {
    database.courses.push(course);
    return course;
  },
  updateCourse: (id: string, updates: Partial<CourseRecord>) =>
    updateRecord(database.courses, id, updates),
  deleteCourse: (id: string) => deleteRecord(database.courses, id),

  getAllEnrollments: () => database.enrollments,
  getEnrollmentsByCourseId: (courseId: string) =>
    database.enrollments.filter((enrollment) => enrollment?.courseId === courseId),
  getEnrollmentsByStudentId: (studentId: string) =>
    database.enrollments.filter((enrollment) => enrollment?.studentId === studentId),
  getEnrollmentByStudentAndCourse: (studentId: string, courseId: string) =>
    database.enrollments.find(
      (enrollment) => enrollment?.studentId === studentId && enrollment?.courseId === courseId
    ) || null,
  insertEnrollment: (enrollment: StudentEnrollmentRecord) => {
    database.enrollments.push(enrollment);
    return enrollment;
  },
  getEnrollmentById: (id: string) => findById(database.enrollments, id),
  updateEnrollment: (id: string, updates: Partial<StudentEnrollmentRecord>) =>
    updateRecord(database.enrollments, id, updates),
  deleteEnrollment: (id: string) => deleteRecord(database.enrollments, id),

  getAllHostelRooms: () => database.hostelRooms,
  getHostelRoom: (id: string) => findById(database.hostelRooms, id),
  getHostelRoomsByBlock: (block: string) =>
    database.hostelRooms.filter((room) => room?.block === block),
  getActiveBookingsForRoom: (roomId: string) =>
    database.roomBookings.filter(
      (booking) => booking?.roomId === roomId && booking?.status === 'active'
    ),
  getRoomBookingsByStudent: (studentId: string) =>
    database.roomBookings.filter(
      (booking) => booking?.studentId === studentId
    ),
  insertRoomBooking: (booking: RoomBookingRecord) => {
    database.roomBookings.push(booking);
    return booking;
  },
  updateRoomBooking: (id: string, updates: Partial<RoomBookingRecord>) =>
    updateRecord(database.roomBookings, id, updates),
  updateHostelRoom: (id: string, updates: Partial<HostelRoomRecord>) =>
    updateRecord(database.hostelRooms, id, updates),

  getAllStudentClearances: () => database.studentClearances,
  getStudentClearance: (studentId: string) =>
    database.studentClearances.find((clearance) => clearance?.studentId === studentId) || null,
  getStudentDepartmentClearances: (studentId: string) =>
    database.departmentClearances.filter((record) => record?.studentId === studentId),
  getDepartmentClearance: (studentId: string, departmentId: string) =>
    database.departmentClearances.find(
      (record) => record?.studentId === studentId && record?.departmentId === departmentId
    ) || null,
  getStudentClearanceSummary: (studentId: string) => {
    const clearances = database.departmentClearances.filter(
      (record) => record?.studentId === studentId
    );
    if (clearances.length === 0) {
      return { allClear: false, percentage: 0 };
    }

    const approvedCount = clearances.filter(
      (record) => record?.status === 'approved' || record?.status === 'exempt'
    ).length;
    const percentage = Math.round((approvedCount / clearances.length) * 100);
    return {
      allClear: approvedCount === clearances.length,
      percentage,
    };
  },
  updateDepartmentClearance: (
    studentId: string,
    departmentId: string,
    updates: Pick<DepartmentClearanceRecord, "status"> & Partial<DepartmentClearanceRecord>
  ) => {
    let record = database.departmentClearances.find(
      (item) => item?.studentId === studentId && item?.departmentId === departmentId
    );
    if (record) {
      Object.assign(record, updates);
      return record;
    }
    record = { studentId, departmentId, ...updates };
    database.departmentClearances.push(record);
    return record;
  },
};

export const recordTypes = {
  courses: 'CourseRecord',
  staff: 'StaffRecord',
  departments: 'DepartmentRecord',
  fees: 'FeesRecord',
  examCards: 'ExamCardRecord',
  complaints: 'ComplaintsRecord',
  schools: 'SchoolRecord',
  roles: 'RolesRecord',
  supportManagement: 'SupportManagementRecord',
  admissions: 'AdmissionsRecord',
};
