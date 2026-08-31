import os
import json
import logging
import requests
from typing import Dict, Any, Optional, Tuple

from services.trust.schemas import AgentResult

logger = logging.getLogger(__name__)

class TrustAgent:
    @staticmethod
    def evaluate(
        inference_result: Dict[str, Any],
        metadata_result: Dict[str, Any],
        risk_score: int,
        risk_level: str
    ) -> AgentResult:
        """
        Invokes an LLM to reason over the structured output of the trust analysis.
        Strictly returns an AgentResult matching the schema.
        Falls back to UNAVAILABLE if any error occurs.
        """
        provider = os.getenv("TRUST_AGENT_PROVIDER", "gemini").lower()
        api_key = os.getenv("TRUST_AGENT_API_KEY", "")
        
        if not api_key:
            return AgentResult(status="UNAVAILABLE")
            
        system_prompt = """You are a highly constrained Trust Agent reasoning over media forensics data.
You will be provided with structural evidence output from a deterministic risk engine.
Your task is to analyze this evidence, identify conflicts or important signals, and return a strict JSON response.

CRITICAL RULES:
1. You MUST return ONLY valid JSON matching this schema exactly:
{
  "assessment": "String explaining the evidence signals, why the current risk level makes sense, and identifying any conflicts.",
  "key_factors": ["String", "String"],
  "recommended_action": "ALLOW" | "REQUIRE_VERIFICATION" | "ESCALATE" | "BLOCK",
  "human_review_required": true | false,
  "confidence": Float between 0.0 and 1.0
}
2. You MUST NOT invent evidence, metadata, or model results not present in the input.
3. You MUST NOT change the numerical risk score.
4. You MUST NOT claim financial loss or authorize payments.
5. You MUST NOT output any markdown blocks (e.g. ```json). Just the raw JSON string.
"""

        user_content = json.dumps({
            "inference_result": inference_result,
            "metadata_result": metadata_result,
            "risk_score": risk_score,
            "risk_level": risk_level
        }, default=str)
        
        try:
            if provider == "openai":
                response_text = TrustAgent._call_openai(api_key, system_prompt, user_content)
            else:
                response_text = TrustAgent._call_gemini(api_key, system_prompt, user_content)
                
            if not response_text:
                return AgentResult(status="UNAVAILABLE")
                
            # Attempt to parse the response
            # Clean up markdown if the LLM hallucinated it despite instructions
            response_text = response_text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            data = json.loads(response_text)
            
            # Ensure valid actions
            valid_actions = {"ALLOW", "REQUIRE_VERIFICATION", "ESCALATE", "BLOCK"}
            action = data.get("recommended_action")
            if action not in valid_actions:
                action = "REQUIRE_VERIFICATION" # safe fallback
                
            return AgentResult(
                status="AVAILABLE",
                assessment=str(data.get("assessment", "No assessment provided.")),
                key_factors=list(data.get("key_factors", [])),
                recommended_action=action,
                human_review_required=bool(data.get("human_review_required", True)),
                confidence=float(data.get("confidence", 0.0))
            )
            
        except Exception as e:
            logger.warning(f"Trust Agent evaluation failed: {e}")
            return AgentResult(status="UNAVAILABLE")

    @staticmethod
    def _call_gemini(api_key: str, system_prompt: str, user_content: str) -> Optional[str]:
        model = os.getenv("TRUST_AGENT_MODEL", "gemini-1.5-flash")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        
        payload = {
            "systemInstruction": {
                "parts": [{"text": system_prompt}]
            },
            "contents": [{
                "role": "user",
                "parts": [{"text": user_content}]
            }],
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json"
            }
        }
        
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        
        result = response.json()
        try:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            return None

    @staticmethod
    def _call_openai(api_key: str, system_prompt: str, user_content: str) -> Optional[str]:
        model = os.getenv("TRUST_AGENT_MODEL", "gpt-4o-mini")
        url = "https://api.openai.com/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"}
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        
        result = response.json()
        try:
            return result["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            return None
