"""
Grad-CAM Explainability — generates visual attention heatmaps for inference decisions.
Phase 1: Implementation complete. Activation via training/inference pipeline in Phase 2.
"""
import io
import numpy as np
import torch
import torch.nn as nn
import cv2
from PIL import Image
from torchvision import transforms


class GradCAM:
    """
    Gradient-weighted Class Activation Mapping for EfficientNet-B0.

    Usage:
        cam = GradCAM(model, target_layer=model.features[-1])
        heatmap_pil = cam.generate(image_tensor, class_idx=1)  # 1 = AI_GENERATED
    """

    def __init__(self, model: nn.Module, target_layer: nn.Module):
        self.model = model
        self.target_layer = target_layer
        self._gradients: torch.Tensor | None = None
        self._activations: torch.Tensor | None = None
        self._register_hooks()

    def _register_hooks(self):
        def forward_hook(module, input, output):
            self._activations = output.detach()

        def backward_hook(module, grad_input, grad_output):
            self._gradients = grad_output[0].detach()

        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_full_backward_hook(backward_hook)

    def generate(
        self,
        image_tensor: torch.Tensor,
        class_idx: int | None = None,
        original_image: Image.Image | None = None,
    ) -> Image.Image:
        """
        Generate a Grad-CAM heatmap overlaid on the original image.

        Args:
            image_tensor: Preprocessed tensor (1, 3, 224, 224).
            class_idx: Class to visualize. If None, uses predicted class.
            original_image: PIL Image to overlay heatmap on. If None, uses tensor.

        Returns:
            PIL Image of heatmap overlay.
        """
        self.model.eval()
        image_tensor.requires_grad_(True)

        # Forward pass
        logits = self.model(image_tensor)

        if class_idx is None:
            class_idx = logits.argmax(dim=1).item()

        # Backward pass for target class
        self.model.zero_grad()
        loss = logits[0, class_idx]
        loss.backward()

        # Compute Grad-CAM
        gradients = self._gradients          # (1, C, H, W)
        activations = self._activations      # (1, C, H, W)

        weights = gradients.mean(dim=(2, 3), keepdim=True)   # (1, C, 1, 1)
        cam = (weights * activations).sum(dim=1, keepdim=True)  # (1, 1, H, W)
        cam = torch.relu(cam)
        cam = cam.squeeze().cpu().numpy()

        # Normalize
        if cam.max() > 0:
            cam = cam / cam.max()

        # Resize to image dimensions
        cam_resized = cv2.resize(cam, (224, 224))
        heatmap = cv2.applyColorMap(np.uint8(255 * cam_resized), cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

        # Overlay on original image
        if original_image is not None:
            orig = np.array(original_image.resize((224, 224))).astype(np.float32)
        else:
            orig = (
                image_tensor.squeeze().permute(1, 2, 0).detach().cpu().numpy()
                * np.array([0.229, 0.224, 0.225])
                + np.array([0.485, 0.456, 0.406])
            ) * 255

        overlay = (0.5 * orig + 0.5 * heatmap).clip(0, 255).astype(np.uint8)
        return Image.fromarray(overlay)


def get_target_layer(model: nn.Module) -> nn.Module:
    """Returns the final convolutional block of EfficientNet-B0 for Grad-CAM."""
    # EfficientNet-B0: features[-1] is the last MBConv block
    return model.features[-1]
