// Demo Data - Safe Fictional Information Only
import { Patient } from "./types";

export const mockPatients: Patient[] = [
  { id: "p1", name: "Alexandra Mitchell", email: "alexandra.m@demo.email", phone: "(555) 111-2233", dateOfBirth: "1988-06-12", address: "123 Demo Street, Sample City, ST 12345", emergencyContact: "James Mitchell (Spouse) - (555) 111-2234", insuranceProvider: "SmileCare Dental", insurancePolicyNumber: "SCD-111222333", notes: "Prefers afternoon appointments." },
  { id: "p2", name: "Benjamin Foster", email: "ben.foster@demo.email", phone: "(555) 222-3344", dateOfBirth: "1975-11-28", address: "456 Test Avenue, Sample City, ST 12345", emergencyContact: "Catherine Foster (Wife) - (555) 222-3345", insuranceProvider: "DentalPlus", insurancePolicyNumber: "DP-444555666", notes: "Prefers morning appointments." },
  { id: "p3", name: "Priya Sharma", email: "priya.sharma@demo.email", phone: "(555) 333-4455", dateOfBirth: "1992-03-15", address: "789 Mock Boulevard, Sample City, ST 12345", emergencyContact: "Raj Sharma (Brother) - (555) 333-4456", insuranceProvider: "CareFirst Dental", insurancePolicyNumber: "CFD-777888999", notes: "Allergic to latex - use nitrile only." },
  { id: "p4", name: "Marcus Johnson", email: "marcus.j@demo.email", phone: "(555) 444-5566", dateOfBirth: "1962-08-20", address: "321 Sample Lane, Sample City, ST 12345", emergencyContact: "Diane Johnson (Spouse) - (555) 444-5567", insuranceProvider: "Premium Dental", insurancePolicyNumber: "PD-121314151", notes: "Blood pressure monitored before procedures." },
  { id: "p5", name: "Sofia Rodriguez", email: "sofia.r@demo.email", phone: "(555) 555-6677", dateOfBirth: "1998-12-03", address: "654 Practice Road, Sample City, ST 12345", emergencyContact: "Maria Rodriguez (Mother) - (555) 555-6678", insuranceProvider: "SmileCare Dental", insurancePolicyNumber: "SCD-161718192", notes: "First-time patient. Interested in whitening." },
  { id: "p6", name: "David Kim", email: "david.kim@demo.email", phone: "(555) 666-7788", dateOfBirth: "1980-05-14", address: "987 Demo Court, Sample City, ST 12345", emergencyContact: "Jennifer Kim (Wife) - (555) 666-7789", insuranceProvider: "DentalPlus", insurancePolicyNumber: "DP-202122232", notes: "Regular patient since 2018. Night guard recommended for bruxism." },
];

// Demo conversation examples (fictional)
export const demoConversations = [
  { id: "conv1", patientId: "p1", messages: [
    { role: "patient" as const, content: "Hi, I'd like to schedule a checkup", timestamp: new Date(Date.now() - 86400000) },
    { role: "assistant" as const, content: "Of course! What day works for you?", timestamp: new Date(Date.now() - 86400000) },
    { role: "patient" as const, content: "Any morning slot next week", timestamp: new Date(Date.now() - 86400000) },
    { role: "assistant" as const, content: "I have Tuesday 10 AM available. Should I book it?", timestamp: new Date(Date.now() - 86400000) },
  ]},
  { id: "conv2", patientId: "p3", messages: [
    { role: "patient" as const, content: "I have pain in my back molar", timestamp: new Date(Date.now() - 172800000) },
    { role: "assistant" as const, content: "I'm sorry. Rate your pain 1-10?", timestamp: new Date(Date.now() - 172800000) },
    { role: "patient" as const, content: "About a 6, hurts when chewing", timestamp: new Date(Date.now() - 172800000) },
    { role: "assistant" as const, content: "Let's schedule an evaluation soon. Tomorrow works?", timestamp: new Date(Date.now() - 172800000) },
  ]},
];

// Example intake forms
export const demoIntakes = [
  { id: "intake1", patientId: "p1", patientConcern: "Routine checkup", duration: "N/A", painLevel: 0, symptoms: ["No symptoms"], medicalHistory: ["No conditions"], medications: ["Multivitamin"], allergies: [], aiGeneratedSummary: "Routine preventive care. Good oral hygiene maintained.", timestamp: new Date() },
  { id: "intake2", patientId: "p3", patientConcern: "Tooth pain", duration: "3-4 days", painLevel: 6, symptoms: ["Pain when chewing", "Cold sensitivity"], medicalHistory: ["Annual checkups"], medications: [], allergies: ["Latex"], aiGeneratedSummary: "Moderate pain (6/10) in molar. Recommend examination with X-ray.", timestamp: new Date() },
];

// Available appointment slots
export const availableSlots = [
  { date: new Date(Date.now() + 86400000), time: "09:00", available: true },
  { date: new Date(Date.now() + 86400000), time: "10:00", available: true },
  { date: new Date(Date.now() + 86400000), time: "14:00", available: true },
  { date: new Date(Date.now() + 172800000), time: "09:30", available: true },
  { date: new Date(Date.now() + 172800000), time: "14:00", available: false },
];
 
