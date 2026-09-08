from agents import urgency_agent  
import asyncio  
async def test():  
result = await urgency_agent.process('I have severe pain in my tooth', {'patient_context': {'name': 'Test', 'id': '1'}})  
print(f'Intent: {result.intent}')  
print(f'Level: {result.data.get(\"safety_result\", {}).get(\"level\")}')  
asyncio.run(test())  
