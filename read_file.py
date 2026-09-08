f=open('e:/DENTALAIAGENT/frontend/src/pages/dentist/DentistDashboardPage.tsx')
lines=f.readlines()
f.close()
print(len(lines))
for l in lines[-5:]:
    print(l, end='')