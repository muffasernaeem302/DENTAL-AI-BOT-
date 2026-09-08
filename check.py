import os
for f in os.listdir('e:/DENTALAIAGENT/frontend/src/pages/dentist'):
    fp = 'e:/DENTALAIAGENT/frontend/src/pages/dentist/' + f
    print(f, os.path.getsize(fp))