f=open('e:/DENTALAIAGENT/frontend/src/pages/dentist/DentistPatientDetailPage.tsx','a')
f.write("""          {alerts.length>0 && <Card className="border-red-200 bg-red-50"><div className="p-4 border-b border-red-200 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600"/><h2 className="font-semibold text-red-800">Alerts</h2></div>
            <div className="p-4 space-y-2">{alerts.map(a => <div key={a.id} className="p-2 bg-white rounded border border-red-100"><span className={'px-2 py-0.5 text-xs rounded '+(a.severity==='CRITICAL'?'bg-red-100 text-red-800':'bg-amber-100 text-amber-800')}>{a.severity}</span><p className="text-sm mt-1">{a.reason_codes?.join(', ')}</p></div>)}</div>
          </Card>}
        </div>

        <div className="lg:col-span-2 space-y-4">
          {activeTab==='overview' && <Card><div className="p-4 border-b"><h2 className="font-semibold">AI Summary</h2></div><div className="p-4">{aiSummary?<p className="text-sm text-neutral-600">{aiSummary}</p>:<div className="text-center"><Button onClick={generateAi} disabled={generating}>{generating?'Generating...':'Generate'}</Button></div>}</div></Card>}
          {activeTab==='appointments' && <Card><div className="p-4 border-b"><h2 className="font-semibold">Appointments</h2></div><div className="divide-y">{appointments.length===0?<div className="p-8 text-center text-neutral-500">No appointments</div>:appointments.map(a => <div key={a.id} className="p-4 flex justify-between"><div><p className="font-medium capitalize">{a.type}</p><p className="text-sm text-neutral-500">{new Date(a.date).toLocaleDateString()} at {a.start}</p></div><Badge variant={a.status==='completed'?'success':'warning'}>{a.status}</Badge></div>)}</div></Card>}
          {activeTab==='intake' && li && <Card><div className="p-4 border-b"><h2 className="font-semibold">Intake Form</h2></div><div className="p-4 space-y-3"><div><label className="text-sm text-neutral-500">Chief Complaint</label><p className="font-medium">{li.chief_complaint}</p></div><div className="grid grid-cols-2 gap-4"><div><label className="text-sm text-neutral-500">Location</label><p className="font-medium">{li.location}</p></div><div><label className="text-sm text-neutral-500">Duration</label><p className="font-medium">{li.duration}</p></div></div><div className="grid grid-cols-3 gap-4"><div><label className="text-sm text-neutral-500">Pain Level</label><p className="font-medium">{li.pain_level}/10</p></div><div><label className="text-sm text-neutral-500">Swelling</label><p className="font-medium">{li.swelling?'Yes':'No'}</p></div><div><label className="text-sm text-neutral-500">Sensitivity</label><p className="font-medium">{li.sensitivity?'Yes':'No'}</p></div></div></div></Card>}
          {activeTab==='notes' && <Card><div className="p-4 border-b"><h2 className="font-semibold">Notes</h2></div><div className="p-8 text-center text-neutral-500">No notes yet</div></Card>}
        </div>
      </div>
    </div>
  )
}
""")
f.close()
print('done')