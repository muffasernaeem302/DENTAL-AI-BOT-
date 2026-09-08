"use client";

import { useState } from "react";
import { mockPatients } from "@/lib/data";
import { Patient } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { User, Phone, Mail, Search, Plus, Calendar, Shield } from "lucide-react";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredPatients = mockPatients.filter(
    (p) => searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage patient records</p>
        </div>
        <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Add Patient</Button>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} hover onClick={() => { setSelectedPatient(patient); setShowDetail(true); }}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-primary-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{patient.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      <span>{patient.phone}</span>
                    </div>
                  </div>
                  {patient.insuranceProvider && (
                    <div className="mt-2">
                      <Badge variant="default" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        {patient.insuranceProvider}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showDetail} onClose={() => setShowDetail(false)} title="Patient Details" className="max-w-lg">
        {selectedPatient && <PatientDetailView patient={selectedPatient} onClose={() => setShowDetail(false)} />}
      </Dialog>
    </div>
  );
}

function PatientDetailView({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
          <User className="h-8 w-8 text-primary-700" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
          <p className="text-sm text-gray-500">DOB: {patient.dateOfBirth}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div><p className="text-xs text-gray-500">Email</p><p className="text-sm text-gray-900">{patient.email}</p></div>
        <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm text-gray-900">{patient.phone}</p></div>
        <div className="col-span-2"><p className="text-xs text-gray-500">Address</p><p className="text-sm text-gray-900">{patient.address}</p></div>
        {patient.insuranceProvider && (
          <>
            <div><p className="text-xs text-gray-500">Insurance</p><p className="text-sm text-gray-900">{patient.insuranceProvider}</p></div>
            <div><p className="text-xs text-gray-500">Policy</p><p className="text-sm text-gray-900">{patient.insurancePolicyNumber}</p></div>
          </>
        )}
      </div>
      {patient.notes && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Notes</p>
          <p className="text-sm text-gray-700 bg-warning-50 p-3 rounded-lg">{patient.notes}</p>
        </div>
      )}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button variant="primary"><Calendar className="h-4 w-4 mr-2" />Schedule</Button>
      </div>
    </div>
  );
}
