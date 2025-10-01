import { api } from "encore.dev/api";

export interface OptimizePlatformRequest {
  project_id: number;
  platform: 'netflix' | 'youtube' | 'theatrical' | 'streaming' | 'mobile' | 'vr' | 'broadcast';
  content_type: 'feature' | 'series' | 'short' | 'documentary' | 'commercial';
  target_audience: string;
  content_rating?: string;
}

export interface OptimizePlatformResponse {
  optimization_settings: {
    video_specs: {
      resolution: string;
      frame_rate: string;
      bitrate: string;
      codec: string;
      hdr: boolean;
    };
    audio_specs: {
      channels: string;
      sample_rate: string;
      bitrate: string;
      format: string;
    };
    subtitle_requirements: string[];
    thumbnail_specs: {
      dimensions: string;
      format: string;
      count: number;
    };
  };
  content_guidelines: {
    duration_limits: string;
    content_restrictions: string[];
    metadata_requirements: string[];
    accessibility_features: string[];
  };
  delivery_package: {
    required_files: string[];
    naming_conventions: string[];
    folder_structure: string[];
  };
  marketing_optimization: {
    title_suggestions: string[];
    description_templates: string[];
    tag_recommendations: string[];
    thumbnail_concepts: string[];
  };
}

export interface ExportPlatformPackageRequest {
  project_id: number;
  platform: string;
  optimization_id: string;
  include_marketing: boolean;
}

export interface ExportPlatformPackageResponse {
  export_id: string;
  download_url: string;
  package_contents: string[];
  estimated_size: string;
}

// Optimizes content for specific platforms with detailed specifications.
export const optimizeForPlatform = api<OptimizePlatformRequest, OptimizePlatformResponse>(
  { expose: true, method: "POST", path: "/ai/platform/optimize" },
  async (req) => {
    const optimizationSettings = generateOptimizationSettings(req.platform);
    const contentGuidelines = generateContentGuidelines(req.platform, req.content_type);
    const deliveryPackage = generateDeliveryPackage(req.platform);
    const marketingOptimization = generateMarketingOptimization(req.platform, req.target_audience);
    
    return {
      optimization_settings: optimizationSettings,
      content_guidelines: contentGuidelines,
      delivery_package: deliveryPackage,
      marketing_optimization: marketingOptimization
    };
  }
);

// Exports optimized package for platform delivery.
export const exportPlatformPackage = api<ExportPlatformPackageRequest, ExportPlatformPackageResponse>(
  { expose: true, method: "POST", path: "/ai/platform/export" },
  async (req) => {
    const exportId = `EXP_${Date.now()}_${req.project_id}`;
    const downloadUrl = `https://export.finessejones.studio/${exportId}`;
    
    const packageContents = [
      "Master_Video_File.mp4",
      "Audio_Stems.zip",
      "Subtitles_Package.zip",
      "Metadata.json",
      "Thumbnails.zip"
    ];
    
    if (req.include_marketing) {
      packageContents.push("Marketing_Assets.zip", "Press_Kit.pdf");
    }
    
    return {
      export_id: exportId,
      download_url: downloadUrl,
      package_contents: packageContents,
      estimated_size: "2.4 GB"
    };
  }
);

function generateOptimizationSettings(platform: string) {
  const platformSpecs: Record<string, any> = {
    netflix: {
      video_specs: {
        resolution: "4K (3840x2160)",
        frame_rate: "23.976 fps",
        bitrate: "15-25 Mbps",
        codec: "H.264/H.265",
        hdr: true
      },
      audio_specs: {
        channels: "5.1 Surround",
        sample_rate: "48 kHz",
        bitrate: "640 kbps",
        format: "Dolby Digital Plus"
      },
      subtitle_requirements: ["Multiple languages", "SDH", "Forced narratives"],
      thumbnail_specs: {
        dimensions: "1920x1080",
        format: "JPEG",
        count: 10
      }
    },
    youtube: {
      video_specs: {
        resolution: "1080p (1920x1080)",
        frame_rate: "30 fps",
        bitrate: "8-12 Mbps",
        codec: "H.264",
        hdr: false
      },
      audio_specs: {
        channels: "Stereo",
        sample_rate: "48 kHz",
        bitrate: "320 kbps",
        format: "AAC"
      },
      subtitle_requirements: ["Auto-generated", "Manual upload", "Multiple languages"],
      thumbnail_specs: {
        dimensions: "1280x720",
        format: "JPEG/PNG",
        count: 3
      }
    },
    theatrical: {
      video_specs: {
        resolution: "2K/4K DCP",
        frame_rate: "24 fps",
        bitrate: "250 Mbps",
        codec: "JPEG 2000",
        hdr: true
      },
      audio_specs: {
        channels: "7.1 Surround",
        sample_rate: "48 kHz",
        bitrate: "Uncompressed",
        format: "PCM"
      },
      subtitle_requirements: ["Open captions", "Closed captions", "Multiple languages"],
      thumbnail_specs: {
        dimensions: "2048x1080",
        format: "TIFF",
        count: 1
      }
    }
  };

  return platformSpecs[platform] || platformSpecs.youtube;
}

function generateContentGuidelines(platform: string, contentType: string) {
  const guidelines: Record<string, any> = {
    netflix: {
      duration_limits: "No strict limits for features, 20-60 min for series episodes",
      content_restrictions: ["Age rating required", "Content warnings", "Regional compliance"],
      metadata_requirements: ["Synopsis (multiple lengths)", "Cast/crew info", "Genre classification"],
      accessibility_features: ["Audio descriptions", "Closed captions", "SDH subtitles"]
    },
    youtube: {
      duration_limits: "No limits, but 10-15 min optimal for engagement",
      content_restrictions: ["Community guidelines", "Copyright compliance", "Monetization policies"],
      metadata_requirements: ["Title (100 chars)", "Description (5000 chars)", "Tags", "Thumbnail"],
      accessibility_features: ["Auto-captions", "Manual subtitles", "Audio descriptions"]
    },
    theatrical: {
      duration_limits: "90-180 minutes typical for features",
      content_restrictions: ["MPAA rating", "Regional censorship", "Technical standards"],
      metadata_requirements: ["DCP metadata", "Rating certificates", "Technical specs"],
      accessibility_features: ["Open captions", "Audio descriptions", "Assistive listening"]
    }
  };

  return guidelines[platform] || guidelines.youtube;
}

function generateDeliveryPackage(platform: string) {
  const packages: Record<string, any> = {
    netflix: {
      required_files: [
        "Master_4K_ProRes.mov",
        "Audio_5.1_Stems.wav",
        "Subtitles_All_Languages.zip",
        "Metadata_Netflix_Format.xml",
        "Thumbnails_1920x1080.zip",
        "Chapter_Markers.txt"
      ],
      naming_conventions: [
        "ProjectTitle_Master_4K_Date",
        "ProjectTitle_Audio_5.1_Date",
        "ProjectTitle_Subs_Language_Date"
      ],
      folder_structure: [
        "/Video/Master/",
        "/Audio/Stems/",
        "/Subtitles/Languages/",
        "/Metadata/",
        "/Artwork/"
      ]
    },
    youtube: {
      required_files: [
        "Video_1080p_H264.mp4",
        "Thumbnail_1280x720.jpg",
        "Subtitles_SRT.zip",
        "Metadata.txt"
      ],
      naming_conventions: [
        "Title_1080p_Final",
        "Title_Thumbnail_v1",
        "Title_Subtitles_EN"
      ],
      folder_structure: [
        "/Video/",
        "/Thumbnails/",
        "/Subtitles/",
        "/Metadata/"
      ]
    }
  };

  return packages[platform] || packages.youtube;
}

function generateMarketingOptimization(platform: string, targetAudience: string) {
  return {
    title_suggestions: [
      "Optimized for platform algorithm",
      "Keyword-rich for discoverability",
      "Audience-targeted phrasing",
      "Genre-appropriate tone",
      "Length optimized for platform"
    ],
    description_templates: [
      "Hook-driven opening line",
      "Key plot points without spoilers",
      "Cast and crew highlights",
      "Genre and tone indicators",
      "Call-to-action ending"
    ],
    tag_recommendations: [
      "Primary genre tags",
      "Secondary genre tags",
      "Mood/tone tags",
      "Target audience tags",
      "Platform-specific tags"
    ],
    thumbnail_concepts: [
      "Character-focused composition",
      "Action/drama moment capture",
      "Title treatment overlay",
      "Color palette optimization",
      "Platform-specific dimensions"
    ]
  };
}
