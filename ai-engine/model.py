"""
FiduScan AI Engine — EfficientNet-B0 Binary Classifier
Detects: AI-Generated (1) vs. Authentic (0)
"""
import torch
import torch.nn as nn
from torchvision import models
from torchvision.models import EfficientNet_B0_Weights


def build_model(num_classes: int = 2, pretrained: bool = True) -> nn.Module:
    """
    Constructs an EfficientNet-B0 model adapted for binary forensic classification.

    Architecture:
        - Backbone: EfficientNet-B0 (ImageNet pretrained)
        - Classifier head: replaced with a forensics-tuned 2-class head
          [1280 → Dropout(0.4) → Linear(512) → GELU → Dropout(0.2) → Linear(num_classes)]

    Args:
        num_classes: Number of output classes (default: 2 — Authentic, AI_Generated).
        pretrained: Load ImageNet weights for backbone (default: True).

    Returns:
        nn.Module: Modified EfficientNet-B0 model.
    """
    weights = EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
    model = models.efficientnet_b0(weights=weights)

    # Replace the classification head
    in_features = model.classifier[1].in_features  # 1280 for EfficientNet-B0
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.4, inplace=True),
        nn.Linear(in_features, 512),
        nn.GELU(),
        nn.Dropout(p=0.2),
        nn.Linear(512, num_classes),
    )

    return model


def build_resnet50(num_classes: int = 2, pretrained: bool = True) -> nn.Module:
    """
    Secondary candidate: ResNet-50 classifier for evaluation comparison.
    """
    from torchvision.models import ResNet50_Weights
    weights = ResNet50_Weights.IMAGENET1K_V1 if pretrained else None
    model = models.resnet50(weights=weights)
    in_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.Linear(256, num_classes),
    )
    return model


def build_vit(num_classes: int = 2, pretrained: bool = True) -> nn.Module:
    """
    Secondary candidate: Vision Transformer (ViT-B/16) for multimodal evaluation.
    """
    from torchvision.models import ViT_B_16_Weights
    weights = ViT_B_16_Weights.IMAGENET1K_V1 if pretrained else None
    model = models.vit_b_16(weights=weights)
    in_features = model.heads.head.in_features
    model.heads.head = nn.Linear(in_features, num_classes)
    return model


MODEL_REGISTRY = {
    "efficientnet_b0": build_model,
    "resnet50": build_resnet50,
    "vit_b16": build_vit,
}


def get_model(name: str, num_classes: int = 2, pretrained: bool = True) -> nn.Module:
    """Factory function: retrieve model by registry name."""
    if name not in MODEL_REGISTRY:
        raise ValueError(f"Unknown model '{name}'. Available: {list(MODEL_REGISTRY.keys())}")
    return MODEL_REGISTRY[name](num_classes=num_classes, pretrained=pretrained)


if __name__ == "__main__":
    # Quick sanity test — single forward pass
    model = build_model()
    model.eval()
    dummy = torch.randn(2, 3, 224, 224)
    out = model(dummy)
    print(f"✅ EfficientNet-B0 output shape: {out.shape}")  # Expected: (2, 2)
