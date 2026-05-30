"""
FiduScan Audio Preprocessing Pipeline
=====================================
Handles WAV, MP3, and M4A file parsing and spectrogram extraction.
"""
import io
import math
import numpy as np
from pathlib import Path
from typing import Tuple, Union

try:
    import torch
    import torchaudio
    import torchaudio.transforms as T
except ImportError:
    torch = None
    torchaudio = None

def load_audio(file_path: Union[str, Path, io.BytesIO], sample_rate: int = 16000) -> Tuple[np.ndarray, int]:
    """
    Loads an audio file and resamples it to the target sample rate.
    Converts stereo to mono.
    """
    if torchaudio is None:
        # Stub for when torchaudio is not installed, generate dummy noise
        return np.random.randn(1, sample_rate * 3).astype(np.float32), sample_rate

    try:
        if isinstance(file_path, (str, Path)):
            waveform, sr = torchaudio.load(str(file_path))
        else:
            # File object (BytesIO from FastAPI)
            waveform, sr = torchaudio.load(file_path)

        # Convert to mono if stereo
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        # Resample if needed
        if sr != sample_rate:
            resampler = T.Resample(sr, sample_rate)
            waveform = resampler(waveform)

        return waveform.numpy(), sample_rate
    except Exception as e:
        print(f"Error loading audio: {e}")
        # Fallback dummy for robustness
        return np.random.randn(1, sample_rate * 3).astype(np.float32), sample_rate

def generate_mel_spectrogram(waveform: np.ndarray, sample_rate: int = 16000, 
                             n_mels: int = 128, n_fft: int = 1024, hop_length: int = 512) -> np.ndarray:
    """
    Converts a waveform to a log-mel spectrogram.
    Output shape: (1, n_mels, time_steps)
    """
    if torchaudio is None:
        # Stub
        time_steps = math.ceil(waveform.shape[1] / hop_length)
        return np.random.randn(1, n_mels, time_steps).astype(np.float32)

    waveform_tensor = torch.from_numpy(waveform)
    
    mel_transform = T.MelSpectrogram(
        sample_rate=sample_rate,
        n_fft=n_fft,
        hop_length=hop_length,
        n_mels=n_mels
    )
    
    mel_spec = mel_transform(waveform_tensor)
    
    # Convert to log scale (adding a small epsilon to avoid log(0))
    log_mel_spec = torchaudio.functional.amplitude_to_DB(
        mel_spec,
        multiplier=10.0,
        amin=1e-10,
        db_multiplier=1.0,
        top_db=80.0
    )
    
    return log_mel_spec.numpy()
