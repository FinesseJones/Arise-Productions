import { api } from "encore.dev/api";

export interface GeneratePressKitRequest {
  project_id: number;
  film_title: string;
  genre: string;
  runtime: number;
  director: string;
  cast: Array<{
    name: string;
    character: string;
    bio?: string;
  }>;
  synopsis: string;
  production_notes?: string;
}

export interface GeneratePressKitResponse {
  press_kit: {
    one_line_synopsis: string;
    short_synopsis: string;
    long_synopsis: string;
    director_statement: string;
    cast_bios: Array<{
      name: string;
      character: string;
      biography: string;
    }>;
    production_notes: string;
    technical_specs: {
      format: string;
      aspect_ratio: string;
      sound: string;
      color: string;
      runtime: string;
    };
    festival_strategy: string[];
    target_audience: string;
    comparable_films: string[];
  };
  marketing_materials: {
    taglines: string[];
    poster_concepts: string[];
    trailer_notes: string;
    social_media_strategy: string[];
  };
}

export interface GenerateScreenerRequest {
  project_id: number;
  recipient_type: 'festival' | 'distributor' | 'press' | 'industry';
  security_level: 'standard' | 'high' | 'watermarked';
  expiration_date?: Date;
  custom_message?: string;
}

export interface GenerateScreenerResponse {
  screener_package: {
    video_specs: {
      resolution: string;
      format: string;
      bitrate: string;
      audio: string;
    };
    security_features: string[];
    access_method: string;
    viewing_instructions: string;
    expiration_info: string;
  };
  distribution_list: Array<{
    recipient_category: string;
    delivery_method: string;
    timeline: string;
  }>;
  tracking_info: {
    unique_id: string;
    analytics_enabled: boolean;
    view_reporting: boolean;
  };
}

export interface GenerateReleaseStrategyRequest {
  project_id: number;
  budget_tier: 'micro' | 'low' | 'medium' | 'high';
  target_platforms: Array<'theatrical' | 'streaming' | 'vod' | 'festival' | 'broadcast'>;
  genre: string;
  target_audience: string;
  international_sales: boolean;
}

export interface GenerateReleaseStrategyResponse {
  release_strategy: {
    primary_strategy: string;
    timeline: Array<{
      phase: string;
      duration: string;
      activities: string[];
      platforms: string[];
    }>;
    festival_circuit: Array<{
      festival_tier: string;
      recommended_festivals: string[];
      submission_deadlines: string[];
      strategy_notes: string;
    }>;
    distribution_windows: Array<{
      window: string;
      duration: string;
      platforms: string[];
      revenue_split: string;
    }>;
  };
  platform_requirements: Array<{
    platform: string;
    technical_specs: Record<string, string>;
    content_requirements: string[];
    submission_process: string[];
  }>;
  revenue_projections: {
    conservative: number;
    optimistic: number;
    breakdown_by_platform: Record<string, number>;
  };
}

// Generates comprehensive press kits with marketing materials.
export const generatePressKit = api<GeneratePressKitRequest, GeneratePressKitResponse>(
  { expose: true, method: "POST", path: "/ai/distribution/press-kit" },
  async (req) => {
    const pressKit = createPressKit(req);
    const marketingMaterials = generateMarketingMaterials(req);
    
    return {
      press_kit: pressKit,
      marketing_materials: marketingMaterials
    };
  }
);

// Creates secure screener packages for different recipient types.
export const generateScreener = api<GenerateScreenerRequest, GenerateScreenerResponse>(
  { expose: true, method: "POST", path: "/ai/distribution/screener" },
  async (req) => {
    const screenerPackage = createScreenerPackage(req);
    const distributionList = generateDistributionList(req.recipient_type);
    const trackingInfo = generateTrackingInfo();
    
    return {
      screener_package: screenerPackage,
      distribution_list: distributionList,
      tracking_info: trackingInfo
    };
  }
);

// Develops comprehensive release strategies for different platforms.
export const generateReleaseStrategy = api<GenerateReleaseStrategyRequest, GenerateReleaseStrategyResponse>(
  { expose: true, method: "POST", path: "/ai/distribution/release-strategy" },
  async (req) => {
    const releaseStrategy = createReleaseStrategy(req);
    const platformRequirements = generatePlatformRequirements(req.target_platforms);
    const revenueProjections = calculateRevenueProjections(req);
    
    return {
      release_strategy: releaseStrategy,
      platform_requirements: platformRequirements,
      revenue_projections: revenueProjections
    };
  }
);

function createPressKit(req: GeneratePressKitRequest) {
  return {
    one_line_synopsis: generateOneLiner(req.synopsis, req.genre),
    short_synopsis: req.synopsis.substring(0, 200) + "...",
    long_synopsis: expandSynopsis(req.synopsis),
    director_statement: generateDirectorStatement(req.director, req.film_title),
    cast_bios: req.cast.map(actor => ({
      name: actor.name,
      character: actor.character,
      biography: actor.bio || generateActorBio(actor.name)
    })),
    production_notes: req.production_notes || generateProductionNotes(req),
    technical_specs: {
      format: "Digital",
      aspect_ratio: "2.39:1",
      sound: "5.1 Surround Sound",
      color: "Color",
      runtime: `${req.runtime} minutes`
    },
    festival_strategy: generateFestivalStrategy(req.genre),
    target_audience: identifyTargetAudience(req.genre, req.synopsis),
    comparable_films: findComparableFilms(req.genre)
  };
}

function generateMarketingMaterials(req: GeneratePressKitRequest) {
  return {
    taglines: generateTaglines(req.film_title, req.genre),
    poster_concepts: generatePosterConcepts(req.genre),
    trailer_notes: generateTrailerNotes(req.synopsis, req.genre),
    social_media_strategy: generateSocialMediaStrategy(req.genre)
  };
}

function generateOneLiner(synopsis: string, genre: string): string {
  // AI-powered one-liner generation
  return `A ${genre} that explores the depths of human nature through an unforgettable journey.`;
}

function expandSynopsis(synopsis: string): string {
  return synopsis + "\n\nThis compelling narrative weaves together themes of identity, purpose, and transformation, creating a cinematic experience that resonates long after the credits roll.";
}

function generateDirectorStatement(director: string, title: string): string {
  return `"${title} represents a deeply personal exploration of themes that have fascinated me throughout my career. Working with this incredible cast and crew, we've created something that I believe will connect with audiences on multiple levels." - ${director}`;
}

function generateActorBio(name: string): string {
  return `${name} is a versatile performer known for bringing depth and authenticity to every role. With a background in both theater and film, ${name} continues to choose projects that challenge and inspire.`;
}

function generateProductionNotes(req: GeneratePressKitRequest): string {
  return `${req.film_title} was filmed over ${Math.ceil(req.runtime / 10)} weeks, utilizing cutting-edge technology and innovative storytelling techniques. The production team was committed to creating an authentic and immersive experience that honors the story's core themes.`;
}

function generateFestivalStrategy(genre: string): string[] {
  const strategies = {
    drama: ["Sundance Film Festival", "Toronto International Film Festival", "Cannes Film Festival"],
    thriller: ["Fantastic Fest", "Sitges Film Festival", "Midnight Madness at TIFF"],
    scifi: ["SXSW", "Fantasia International Film Festival", "Comic-Con Film Festival"]
  };
  
  return strategies[genre] || strategies.drama;
}

function identifyTargetAudience(genre: string, synopsis: string): string {
  return `Primary: Adults 25-54 interested in ${genre} films. Secondary: Film enthusiasts and festival audiences seeking original storytelling.`;
}

function findComparableFilms(genre: string): string[] {
  const comparables = {
    drama: ["Manchester by the Sea", "Moonlight", "Lady Bird"],
    thriller: ["Gone Girl", "Zodiac", "Prisoners"],
    scifi: ["Ex Machina", "Arrival", "Her"]
  };
  
  return comparables[genre] || comparables.drama;
}

function generateTaglines(title: string, genre: string): string[] {
  return [
    "Some stories change everything",
    "The truth is just the beginning",
    "Every choice has consequences",
    "What would you sacrifice for the truth?",
    "The future starts now"
  ];
}

function generatePosterConcepts(genre: string): string[] {
  return [
    "Minimalist character portrait with dramatic lighting",
    "Symbolic imagery representing the core theme",
    "Dynamic action composition with bold typography",
    "Atmospheric mood piece with subtle title treatment"
  ];
}

function generateTrailerNotes(synopsis: string, genre: string): string {
  return `Trailer should open with atmospheric establishment, build tension through character moments, showcase key dramatic beats without spoilers, and end with a compelling hook. Target runtime: 2:30. Music should complement the ${genre} tone while remaining accessible.`;
}

function generateSocialMediaStrategy(genre: string): string[] {
  return [
    "Behind-the-scenes content during production",
    "Character introduction posts",
    "Director and cast interviews",
    "Film festival coverage and updates",
    "Audience engagement through Q&As",
    "Visual content highlighting cinematography",
    "Countdown campaigns for release dates"
  ];
}

function createScreenerPackage(req: GenerateScreenerRequest) {
  const securityFeatures = {
    standard: ["Password protection", "Limited downloads"],
    high: ["Watermarking", "IP restrictions", "Time-limited access"],
    watermarked: ["Visible watermarks", "Forensic watermarking", "Screenshot protection"]
  };
  
  return {
    video_specs: {
      resolution: req.recipient_type === 'festival' ? "1080p" : "720p",
      format: "H.264 MP4",
      bitrate: "5 Mbps",
      audio: "Stereo AAC"
    },
    security_features: securityFeatures[req.security_level],
    access_method: "Secure streaming link",
    viewing_instructions: "Click link, enter provided password, stream directly in browser",
    expiration_info: req.expiration_date ? 
      `Access expires ${req.expiration_date.toDateString()}` : 
      "Access expires in 30 days"
  };
}

function generateDistributionList(recipientType: string) {
  const lists = {
    festival: [
      { recipient_category: "Festival Programmers", delivery_method: "Secure link", timeline: "2 weeks before deadline" },
      { recipient_category: "Selection Committees", delivery_method: "Password protected", timeline: "1 week before deadline" }
    ],
    distributor: [
      { recipient_category: "Acquisition Executives", delivery_method: "Private screening", timeline: "Immediate" },
      { recipient_category: "Sales Agents", delivery_method: "Secure download", timeline: "Within 48 hours" }
    ],
    press: [
      { recipient_category: "Film Critics", delivery_method: "Streaming link", timeline: "2 weeks before release" },
      { recipient_category: "Entertainment Journalists", delivery_method: "Press screening", timeline: "1 week before release" }
    ]
  };
  
  return lists[recipientType] || lists.festival;
}

function generateTrackingInfo() {
  return {
    unique_id: `SCR_${Date.now()}`,
    analytics_enabled: true,
    view_reporting: true
  };
}

function createReleaseStrategy(req: GenerateReleaseStrategyRequest) {
  return {
    primary_strategy: determinePrimaryStrategy(req),
    timeline: generateReleaseTimeline(req),
    festival_circuit: generateFestivalCircuit(req.genre, req.budget_tier),
    distribution_windows: generateDistributionWindows(req.target_platforms)
  };
}

function determinePrimaryStrategy(req: GenerateReleaseStrategyRequest): string {
  if (req.target_platforms.includes('festival')) {
    return "Festival-first strategy with platform rollout";
  } else if (req.target_platforms.includes('theatrical')) {
    return "Theatrical release with streaming follow-up";
  } else {
    return "Direct-to-platform digital release";
  }
}

function generateReleaseTimeline(req: GenerateReleaseStrategyRequest) {
  return [
    {
      phase: "Festival Circuit",
      duration: "6-12 months",
      activities: ["Festival submissions", "Premiere strategy", "Awards campaigns"],
      platforms: ["Film festivals"]
    },
    {
      phase: "Theatrical Release",
      duration: "4-8 weeks",
      activities: ["Limited release", "Press coverage", "Audience building"],
      platforms: ["Theaters"]
    },
    {
      phase: "Digital Release",
      duration: "Ongoing",
      activities: ["Platform launches", "Marketing campaigns", "International sales"],
      platforms: req.target_platforms.filter(p => p !== 'theatrical')
    }
  ];
}

function generateFestivalCircuit(genre: string, budgetTier: string) {
  return [
    {
      festival_tier: "A-List",
      recommended_festivals: ["Sundance", "Cannes", "Toronto", "Venice"],
      submission_deadlines: ["Early Bird: May", "Regular: July", "Late: September"],
      strategy_notes: "Target for world premiere and maximum industry exposure"
    },
    {
      festival_tier: "Regional",
      recommended_festivals: ["SXSW", "Tribeca", "Los Angeles Film Festival"],
      submission_deadlines: ["Various throughout year"],
      strategy_notes: "Build momentum and audience awareness"
    }
  ];
}

function generateDistributionWindows(platforms: string[]) {
  return [
    {
      window: "Theatrical",
      duration: "45-90 days",
      platforms: ["Theaters"],
      revenue_split: "50/50 with exhibitors"
    },
    {
      window: "Premium VOD",
      duration: "30-45 days",
      platforms: ["iTunes", "Amazon Prime"],
      revenue_split: "70/30 platform split"
    },
    {
      window: "Streaming",
      duration: "Ongoing",
      platforms: ["Netflix", "Hulu", "HBO Max"],
      revenue_split: "Licensing deals vary"
    }
  ];
}

function generatePlatformRequirements(platforms: string[]) {
  const requirements = {
    streaming: {
      platform: "Netflix/Hulu/HBO Max",
      technical_specs: {
        "Video": "4K HDR, H.264/H.265",
        "Audio": "5.1 Surround, Dolby Atmos",
        "Subtitles": "Multiple languages, SDH",
        "Closed Captions": "Required for accessibility"
      },
      content_requirements: [
        "Content rating certification",
        "Metadata in required format",
        "Artwork in specified dimensions",
        "Trailer and promotional materials"
      ],
      submission_process: [
        "Technical review and QC",
        "Content review and approval",
        "Metadata submission",
        "Final delivery and ingestion"
      ]
    },
    vod: {
      platform: "iTunes/Amazon/Google Play",
      technical_specs: {
        "Video": "1080p minimum, 4K preferred",
        "Audio": "Stereo minimum, 5.1 preferred",
        "Format": "ProRes or H.264",
        "Aspect Ratio": "16:9 or 2.39:1"
      },
      content_requirements: [
        "Age rating certification",
        "Poster artwork (2000x3000px)",
        "Background artwork (1920x1080px)",
        "Synopsis and metadata"
      ],
      submission_process: [
        "Account setup with aggregator",
        "Asset upload and review",
        "Metadata entry and verification",
        "Release date scheduling"
      ]
    }
  };
  
  return platforms.map(platform => 
    requirements[platform] || requirements.streaming
  );
}

function calculateRevenueProjections(req: GenerateReleaseStrategyRequest) {
  const baseBudgets = {
    micro: { conservative: 5000, optimistic: 25000 },
    low: { conservative: 25000, optimistic: 100000 },
    medium: { conservative: 100000, optimistic: 500000 },
    high: { conservative: 500000, optimistic: 2000000 }
  };
  
  const projections = baseBudgets[req.budget_tier];
  
  return {
    conservative: projections.conservative,
    optimistic: projections.optimistic,
    breakdown_by_platform: {
      "Theatrical": projections.conservative * 0.3,
      "Streaming": projections.conservative * 0.4,
      "VOD": projections.conservative * 0.2,
      "International": projections.conservative * 0.1
    }
  };
}
