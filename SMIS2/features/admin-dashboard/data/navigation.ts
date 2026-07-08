import {
  BarChart3,
  BookOpenCheck,
  Building2,
  CircleDollarSign,
  ClipboardList,
  Home,
  LifeBuoy,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminNavigationItem = {
  active?: boolean;
  href: string;
  icon: LucideIcon;
  label: string;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    active: true,
    href: "/",
    icon: BarChart3,
    label: "Dashboard",
  },
  {
    href: "/academics",
    icon: BookOpenCheck,
    label: "Academics",
  },
  {
    href: "/admissions",
    icon: UserRoundPlus,
    label: "Admissions",
  },
  {
    href: "/admissions/enrollment",
    icon: UserRoundPlus,
    label: "Admissions Enrollment",
  },
  {
    href: "/admissions/clearance",
    icon: ClipboardList,
    label: "Clearance",
  },
  {
    href: "/complaints",
    icon: ClipboardList,
    label: "Complaints",
  },
  {
    href: "/course-management",
    icon: BookOpenCheck,
    label: "Course Management",
  },
  {
    href: "/departments",
    icon: Building2,
    label: "Departments",
  },
  {
    href: "/fees",
    icon: CircleDollarSign,
    label: "Fees",
  },
  {
    href: "/admissions/hostel",
    icon: Home,
    label: "Hostel Booking",
  },
  {
    href: "/roles",
    icon: ShieldCheck,
    label: "Roles",
  },
  {
    href: "/schools",
    icon: Building2,
    label: "Schools",
  },
  {
    href: "/staff",
    icon: UsersRound,
    label: "Staff",
  },
  {
    href: "/students",
    icon: UsersRound,
    label: "Students",
  },
  {
    href: "/support",
    icon: LifeBuoy,
    label: "Support",
  },
  {
    href: "/library",
    icon: BookOpenCheck,
    label: "Library",
  },
];








