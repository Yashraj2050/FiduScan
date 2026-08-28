from typing import Dict, Any, Tuple, List

class DeterministicRiskEngine:
    @staticmethod
    def calculate_risk(inference_result: Dict[str, Any], metadata_result: Dict[str, Any]) -> Tuple[int, str, List[str]]:
        """
        Calculate a deterministic risk score based on inference and metadata signals.
        Returns:
            Tuple[score (0-100), risk_level, list of reasons]
        """
        reasons = []
        
        # Base risk from model inference
        # If authenticity is 1.0, base risk is 0. If authenticity is 0.0, base risk is 100.
        authenticity = inference_result.get("authenticity_score", 1.0)
        base_risk = (1.0 - authenticity) * 100
        
        if authenticity < 0.4:
            reasons.append("Model detected strong indicators of synthetic content")
        elif authenticity < 0.7:
            reasons.append("Model detected possible synthetic indicators")
            
        # Analyze metadata flags
        flags = metadata_result.get("forensic_flags", [])
        metadata_penalty = 0
        
        has_no_exif = any("NO_EXIF" in f for f in flags)
        if has_no_exif:
            metadata_penalty += 15
            reasons.append("Metadata anomaly: Missing EXIF data (common in AI generations)")
            
        has_ai_software = any("AI_SOFTWARE_DETECTED" in f for f in flags)
        if has_ai_software:
            metadata_penalty += 50
            reasons.append("Metadata anomaly: AI generation software signature detected")
            
        has_round_dims = any("ROUND_DIMENSIONS" in f for f in flags)
        if has_round_dims:
            metadata_penalty += 10
            reasons.append("Metadata anomaly: Image dimensions match common AI generator outputs")
            
        total_score = int(base_risk + metadata_penalty)
        total_score = min(total_score, 100)
        total_score = max(total_score, 0)
        
        if total_score <= 30:
            level = "LOW"
        elif total_score <= 60:
            level = "MEDIUM"
        elif total_score <= 85:
            level = "HIGH"
        else:
            level = "CRITICAL"
            
        # Ensure we have at least one reason if risk is not LOW
        if level != "LOW" and not reasons:
            reasons.append(f"Cumulative risk score reached {total_score}/100")
            
        return total_score, level, reasons
