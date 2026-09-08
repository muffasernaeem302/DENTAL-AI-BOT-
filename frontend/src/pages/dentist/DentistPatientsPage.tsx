import { Link } from 'react-router-dom'
import { Avatar, Badge, Button, EmptyState } from '@/components/ui'
import { Search, UserPlus } from 'lucide-react'
import { useState } from 'react'

const mockPatients = [
  { id: 'p1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com', phone: '+1 (555) 123-4567', lastVisit: '2026-09-03', nextVisit: '2026-09-10', status: 'active' },
  { id: 'p2', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@email.com', phone: '+1 (555) 234-5678', lastVisit: '2026-08-28', nextVisit: '2026-09-12', status: 'active' },
  { id: 'p3', firstName: 'Jennifer', lastName: 'Davis', email: 'jennifer.davis@email.com', phone: '+1 (555) 345-6789', lastVisit: '2026-09-01', nextVisit: '2026-09-15', status: 'active' },
  { id: 'p4', firstName: 'Robert', lastName: 'Wilson', email: 'robert.wilson@email.com', phone: '+1 (555) 456-7890', lastVisit: '2026-08-15', nextVisit: '2026-09-04', status: 'active' },
  { id: 'p5', firstName: 'Emma', lastName: 'Thompson', email: 'emma.thompson@email.com', phone: '+1 (555) 567-8901', lastVisit: '2026-07-20', nextVisit: 'None scheduled', status: 'inactive' },
]

export function DentistPatientsPage() {
  const [search, setSearch] = useState('')

  const filtered = mockPatients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-2xl font-bold">Patients</h1><p className="text-neutral-600">{mockPatients.length} total patients</p></div>
        <Button><UserPlus className="w-4 h-4 mr-2" /> Add Patient</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input type="text" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Search className="w-12 h-12" />} title="No patients found" description="Try adjusting your search terms." />
      ) : (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Next Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((patient) => (
                <tr key={patient.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link to={`/dentist/patients/${patient.id}`} className="flex items-center gap-3">
                      <Avatar firstName={patient.firstName} lastName={patient.lastName} size="md" />
                      <div>
                        <p className="font-medium text-neutral-900">{patient.firstName} {patient.lastName}</p>
                        <p className="text-sm text-neutral-500">{patient.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{patient.phone}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{patient.lastVisit}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{patient.nextVisit}</td>
                  <td className="px-6 py-4"><Badge variant={patient.status === 'active' ? 'success' : 'neutral'}>{patient.status}</Badge></td>
                  <td className="px-6 py-4 text-right"><Link to={`/dentist/patients/${patient.id}`}><Button variant="ghost" size="sm">View</Button></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
