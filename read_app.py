f=open('e:/DENTALAIAGENT/frontend/src/App.tsx')
lines=f.readlines()
f.close()
print(len(lines))
print('First 5 lines:')
for l in lines[:5]:
    print(l, end='')