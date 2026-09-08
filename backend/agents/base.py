"""
Base agent class for DentalAI.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel


class AgentMessage(BaseModel):
    """Message structure for agent communication."""
    role: str
    content: str
    metadata: Optional[Dict[str, Any]] = None


class BaseAgent(ABC):
    """
    Base class for all AI agents in DentalAI.
    
    Agents are designed to assist with administrative tasks,
    NOT to provide medical diagnoses or treatment recommendations.
    """
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.tools: List[Any] = []
    
    @abstractmethod
    async def process(self, message: AgentMessage) -> AgentMessage:
        """
        Process an incoming message and return a response.
        """
        pass
    
    def add_tool(self, tool: Any) -> None:
        """Add a tool to the agent's toolkit."""
        self.tools.append(tool)
    
    async def call_tool(self, tool_name: str, **kwargs) -> Any:
        """
        Call a specific tool by name.
        """
        for tool in self.tools:
            if tool.name == tool_name:
                return await tool.execute(**kwargs)
        raise ValueError(f"Tool '{tool_name}' not found")
