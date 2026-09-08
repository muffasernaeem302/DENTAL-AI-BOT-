"""Base Agent class"""
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from .ai_service import ai_service

@dataclass
class AgentResponse:
    message: str
    agent: str
    intent: str
    data: dict | None = None

class BaseAgent(ABC):
    PROMPT_PATH = ""
    SCHEMA = {"type": "object", "properties": {"message": {"type": "string"}}, "required": ["message"]}
    
    def __init__(self, name: str):
        self.name = name
        self._load_prompt()
    
    def _load_prompt(self):
        try:
            path = os.path.join(os.path.dirname(__file__), "prompts", self.PROMPT_PATH)
            with open(path, "r") as f:
                self.prompt = f.read()
        except FileNotFoundError:
            self.prompt = f"You are the {self.name}."
    
    @abstractmethod
    async def process(self, msg: str, ctx: dict = None) -> AgentResponse:
        pass
    
    def _build_prompt(self, msg: str, ctx: dict = None) -> str:
        prompt = f"{self.prompt}\n\n## PATIENT MESSAGE:\n{msg}\n\n"
        if ctx:
            if ctx.get("conversation_history"):
                prompt += "## CONVERSATION:\n"
                for m in ctx["conversation_history"][-5:]:
                    prompt += f"- {m.get('role','user')}: {m.get('content','')}\n"
            if ctx.get("patient_context"):
                prompt += "## PATIENT CONTEXT:\n"
                for k, v in ctx["patient_context"].items():
                    prompt += f"- {k}: {v}\n"
        prompt += "\n## RESPONSE:\n"
        return prompt
  
