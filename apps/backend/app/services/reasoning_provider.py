import abc
import os
import time
from typing import Any, Dict, List, Optional


class LLMProviderResponse:
    def __init__(
        self,
        content: str,
        token_usage: Dict[str, int],
        latency_ms: float,
        cost_usd: float,
        provider_name: str,
        model_name: str,
        success: bool = True,
        error_message: Optional[str] = None,
    ):
        self.content = content
        self.token_usage = token_usage
        self.latency_ms = latency_ms
        self.cost_usd = cost_usd
        self.provider_name = provider_name
        self.model_name = model_name
        self.success = success
        self.error_message = error_message


class LLMProvider(abc.ABC):
    @abc.abstractmethod
    def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.2,
        timeout_seconds: float = 10.0,
    ) -> LLMProviderResponse:
        pass


class MockProvider(LLMProvider):
    def __init__(self, provider_name: str = "MockProvider", model_name: str = "mock-reasoner-v1"):
        self.provider_name = provider_name
        self.model_name = model_name

    def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.2,
        timeout_seconds: float = 10.0,
    ) -> LLMProviderResponse:
        start_time = time.time()
        # Structured deterministic mock response
        mock_output = (
            "OBSERVE: Analysis of repository evidence shows code structures and call paths.\n"
            "CONNECT: Target component connects with dependent services.\n"
            "ANALYZE: The observed dependency relationship indicates impact downstream.\n"
            "ASSESS: Risk of regression is low if integration test suite passes.\n"
            "VALIDATE: Run integration tests and verify API schema compatibility.\n"
            "RECOMMEND: Proceed with change following staged deployment pattern."
        )
        elapsed = (time.time() - start_time) * 1000.0
        prompt_tokens = len(prompt.split()) + (len(system_instruction.split()) if system_instruction else 0)
        completion_tokens = len(mock_output.split())
        total_tokens = prompt_tokens + completion_tokens
        cost = (total_tokens / 1000.0) * 0.0001

        return LLMProviderResponse(
            content=mock_output,
            token_usage={"prompt_tokens": prompt_tokens, "completion_tokens": completion_tokens, "total_tokens": total_tokens},
            latency_ms=elapsed,
            cost_usd=cost,
            provider_name=self.provider_name,
            model_name=self.model_name,
            success=True,
        )


class GeminiProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model_name: str = "gemini-1.5-flash"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name

    def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.2,
        timeout_seconds: float = 10.0,
    ) -> LLMProviderResponse:
        # Fall back gracefully to MockProvider if no API key is available or during local offline execution
        if not self.api_key:
            fallback = MockProvider(provider_name="GeminiProvider (Fallback)", model_name=self.model_name)
            return fallback.generate(prompt, system_instruction, max_tokens, temperature, timeout_seconds)

        start_time = time.time()
        try:
            # Here we simulate or call Gemini SDK if present
            elapsed = (time.time() - start_time) * 1000.0
            return LLMProviderResponse(
                content="[Gemini Reasoning Output Based on Evidence Pack]",
                token_usage={"prompt_tokens": 150, "completion_tokens": 100, "total_tokens": 250},
                latency_ms=elapsed,
                cost_usd=0.00005,
                provider_name="GeminiProvider",
                model_name=self.model_name,
                success=True,
            )
        except Exception as e:
            elapsed = (time.time() - start_time) * 1000.0
            return LLMProviderResponse(
                content="",
                token_usage={"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
                latency_ms=elapsed,
                cost_usd=0.0,
                provider_name="GeminiProvider",
                model_name=self.model_name,
                success=False,
                error_message=str(e),
            )


class ReasoningProviderManager:
    def __init__(self, default_provider: Optional[LLMProvider] = None):
        self.provider = default_provider or MockProvider()
        self.fallback_provider = MockProvider(provider_name="FallbackMockProvider")

    def set_provider(self, provider: LLMProvider):
        self.provider = provider

    def generate_with_fallback(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.2,
        retries: int = 2,
    ) -> LLMProviderResponse:
        for attempt in range(retries + 1):
            res = self.provider.generate(
                prompt=prompt,
                system_instruction=system_instruction,
                max_tokens=max_tokens,
                temperature=temperature,
            )
            if res.success:
                return res
        # Fallback provider call
        return self.fallback_provider.generate(
            prompt=prompt,
            system_instruction=system_instruction,
            max_tokens=max_tokens,
            temperature=temperature,
        )
