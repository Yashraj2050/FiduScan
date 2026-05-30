// FiduScan API types

export type Prediction = 'AI_GENERATED' | 'AUTHENTIC';

export interface DetectionResult {
  request_id: string;
  filename: string;
  prediction: Prediction;
  confidence: number;
  ai_probability: number;
  authentic_probability: number;
  metadata: ImageMetadata;
  heatmap_available: boolean;
  heatmap_b64: string | null;
  inference_time_ms: number;
  model_version: string;
}

export interface AudioDetectionResult {
  request_id: string;
  filename: string;
  prediction: Prediction;
  confidence: number;
  ai_probability: number;
  authentic_probability: number;
  explanation_metadata: Record<string, string>;
  inference_time_ms: number;
  model_version: string;
}

export interface VideoDetectionResult {
  request_id: string;
  filename: string;
  prediction: Prediction;
  confidence: number;
  ai_probability: number;
  authentic_probability: number;
  video_score: number;
  frame_score: number;
  audio_score: number;
  metadata_score: number;
  temporal_score: number;
  explanation: string;
  inference_time_ms: number;
  model_version: string;
}

export interface ImageMetadata {
  filename?: string;
  file_size_bytes?: number;
  format?: string;
  mode?: string;
  width?: number;
  height?: number;
  megapixels?: number;
  has_gps?: boolean;
  software?: string | null;
  camera_make?: string | null;
  camera_model?: string | null;
  date_time?: string | null;
  exif?: Record<string, string>;
  forensic_flags?: string[];
  error?: string;
}

export interface HealthStatus {
  status: string;
  version: string;
  device: string;
  model_loaded: boolean;
  platform: string;
}
