"""
Centralized AI/LLM Service for DentalAI
"""
import os
import json
import logging
from typing import Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class AIConfig:
    api_key: str
    model: str = "gpt-4o-mini"
    temperature: float = 0.3
    max_tokens: int = 1000
    timeout: int = 60

class AIServiceError(Exception):
    pass

class AIService:
    _instance: Optional['AIService'] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        self.config = AIConfig(api_key=os.getenv("OPENAI_API_KEY", ""), model=os.getenv("AI_MODEL", "gpt-4o-mini"), temperature=float(os.getenv("AI_TEMPERATURE", "0.3")), max_tokens=int(os.getenv("AI_MAX_TOKENS", "1000")), timeout=int(os.getenv("AI_TIMEOUT", "60")))
        if self.config.api_key:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(api_key=self.config.api_key, timeout=self.config.timeout)
        else:
            self.client = None
            logger.warning("OPENAI_API_KEY not set - AI service will return mock responses")
        self._initialized = True
    
    @property
    def is_available(self) -> bool:
        return self.client is not None
    
    def _log_request(self, prompt: str, model: str) -> None:
        logger.info(f"AI Request: model={model}, prompt_length={len(prompt)}")
    
    def _log_response(self, response: str, success: bool) -> None:
        logger.info(f"AI Response: success={success}, response_length={len(response)}")
    
    async def complete(self, prompt: str, system_prompt: Optional[str] = None, temperature: Optional[float] = None, max_tokens: Optional[int] = None) -> str:
        if not self.is_available:
            return '{"intent": "UNKNOWN", "target_agent": null, "reason": "AI service not configured"}'
        self._log_request(prompt, self.config.model)
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        try:
            from tenacity import retry, stop_after_attempt, wait_exponential
            @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10), reraise=True)
            async def _call():
                return await self.client.chat.completions.create(model=self.config.model, messages=messages, temperature=temperature or self.config.temperature, max_tokens=max_tokens or self.config.max_tokens, response_format={"type": "json_object"})
            response = await _call()
            result = response.choices[0].message.content
            self._log_response(result, True)
            return result
        except Exception as e:
            logger.error(f"AI error: {str(e)}")
            self._log_response(str(e), False)
            raise AIServiceError(f"AI service error: {str(e)}")
    
    async def complete_structured(self, prompt: str, system_prompt: str, response_schema: dict) -> dict:
        if not self.is_available:
            mock = {}
            for key, definition in response_schema.get("properties", {}).items():
                types = definition.get("type", [])
                if isinstance(types, str):
                    types = [types]
                if key == "message":
                    mock[key] = "I can help with general dental information and appointments. Please contact the clinic for specific care advice."
                elif "object" in types:
                    mock[key] = {}
                elif "array" in types:
                    mock[key] = []
                elif "boolean" in types:
                    mock[key] = False
                elif "string" in types:
                    mock[key] = ""
                else:
                    mock[key] = None
            return mock
        full_system = f"{system_prompt}\n\nYou must respond with valid JSON matching this schema:\n{json.dumps(response_schema, indent=2)}\n\nDo not include any text outside the JSON object."
        try:
            response = await self.complete(prompt, full_system)
            return json.loads(response)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {str(e)}")
            raise AIServiceError(f"Failed to parse AI response as JSON: {str(e)}")

ai_service = AIService()
