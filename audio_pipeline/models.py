"""
FiduScan Audio Models
=====================
Defines the baseline models for Audio Deepfake Detection MVP.
"""
import torch
import torch.nn as nn
from torchvision import models

class AudioCNN(nn.Module):
    """Model A: Simple CNN Spectrogram Classifier."""
    def __init__(self, num_classes=2):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 16, kernel_size=3, stride=1, padding=1)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1)
        
        self.global_pool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(32, num_classes)

    def forward(self, x):
        # x is (B, 1, Mels, Time)
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = self.global_pool(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return x

class AudioEfficientNet(nn.Module):
    """Model B: EfficientNet adapted for 1-channel spectrograms."""
    def __init__(self, num_classes=2):
        super().__init__()
        self.backbone = models.efficientnet_b0(weights=None)
        
        # Modify first layer to accept 1 channel instead of 3
        old_conv = self.backbone.features[0][0]
        self.backbone.features[0][0] = nn.Conv2d(
            1, old_conv.out_channels, 
            kernel_size=old_conv.kernel_size, 
            stride=old_conv.stride, 
            padding=old_conv.padding, 
            bias=False
        )
        
        # Replace classifier
        in_features = self.backbone.classifier[1].in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(in_features, num_classes),
        )

    def forward(self, x):
        return self.backbone(x)

class AudioWav2VecProxy(nn.Module):
    """Model C: 1D Convolutional Network acting as a fast waveform proxy."""
    def __init__(self, num_classes=2):
        super().__init__()
        # Input shape: (B, 1, TimeSteps)
        self.conv1 = nn.Conv1d(1, 64, kernel_size=10, stride=5)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool1d(4)
        self.conv2 = nn.Conv1d(64, 128, kernel_size=3, stride=2)
        self.global_pool = nn.AdaptiveAvgPool1d(1)
        self.fc = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = self.global_pool(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return x

def get_audio_model(name: str, num_classes: int = 2) -> nn.Module:
    if name == "cnn_spectrogram":
        return AudioCNN(num_classes)
    elif name == "efficientnet_spectrogram":
        return AudioEfficientNet(num_classes)
    elif name == "wav2vec_proxy":
        return AudioWav2VecProxy(num_classes)
    else:
        raise ValueError(f"Unknown audio model: {name}")
