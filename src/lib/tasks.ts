import { FollowUpTask } from "./types";
import { mockPatients } from "./data";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

export const mockFollowUpTasks: FollowUpTask[] = [
  {
    id: "task1",
    patientId: "p2",
    patient: mockPatients[1],
    title: "Review X-ray Results",
    description: "Review and interpret panoramic X-ray for tooth pain diagnosis.",
    dueDate: new Date(new Date().setHours(17, 0, 0, 0)),
    status: "in-progress",
    priority: "high",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "task2",
    patientId: "p3",
    patient: mockPatients[2],
    title: "Prepare Root Canal Kit",
    description: "Prepare all instruments and materials for root canal procedure.",
    dueDate: new Date(tomorrow.setHours(8, 0, 0, 0)),
    status: "pending",
    priority: "high",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "task3",
    patientId: "p4",
    patient: mockPatients[3],
    title: "Send Crown Options Email",
    description: "Email James Williams with crown material options and pricing.",
    dueDate: new Date(tomorrow.setHours(12, 0, 0, 0)),
    status: "pending",
    priority: "medium",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "task4",
    patientId: "p5",
    patient: mockPatients[4],
    title: "Schedule Whitening Session",
    description: "Schedule in-office whitening session after consultation approval.",
    dueDate: new Date(nextWeek.setHours(17, 0, 0, 0)),
    status: "pending",
    priority: "low",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "task5",
    patientId: "p6",
    patient: mockPatients[5],
    title: "Process Insurance Claim",
    description: "Submit emergency visit claim to Aetna Dental.",
    dueDate: new Date(new Date().setHours(17, 0, 0, 0)),
    status: "in-progress",
    priority: "medium",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];
