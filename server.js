// Simple Express server for Unified 3D Production Studio
// This replaces Encore.dev for local development

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// CASTING ROOM ENDPOINTS
// ============================================

// POST /casting/analyze - Generate casting analysis
app.post('/casting/analyze', (req, res) => {
  const { character_name, project_type, budget_range, analysis_type } = req.body;

  const mockResults = {
    casting: {
      character_name: character_name || "Hero Protagonist",
      age_range: "28-35",
      physical_description: "Athletic build, 5'8\"-6'2\", expressive eyes",
      personality_traits: ["Determined", "Intelligent", "Resourceful", "Charismatic"],
      key_scenes: ["Opening monologue", "Confrontation scene", "Final resolution"],
      suggested_actors: [
        "Actor A (TV experience)",
        "Actor B (Theater background)",
        "Actor C (Film veteran)",
      ],
      casting_notes: "Look for someone with strong improvisational skills and combat training background.",
    },
    budget: {
      total_estimated_cost: calculateBudget(budget_range),
      breakdown: {
        cast: "35%",
        crew: "26%",
        equipment: "17%",
        post_production: "15%",
        miscellaneous: "7%",
      },
      savings_opportunities: [
        "Use local talent for supporting roles",
        "Leverage existing equipment partnerships",
        "Consider tax incentives in filming locations",
      ],
      risk_factors: [
        "Weather-dependent outdoor scenes",
        "Celebrity availability conflicts",
        "Equipment rental market volatility",
      ],
    },
    schedule: {
      total_production_days: calculateProductionDays(project_type),
      pre_production: "8 weeks",
      principal_photography: "6 weeks",
      post_production: "12 weeks",
      key_milestones: [
        "Script lock: Week 2",
        "Cast finalization: Week 4",
        "Location scouting: Week 6",
        "First day of principal photography: Week 10",
      ],
      critical_path: [
        "Lead actor availability",
        "VFX shot completion",
        "Music composition and scoring",
        "Final color grading",
      ],
    },
  };

  res.json({
    success: true,
    data: mockResults[analysis_type],
    ai_powered: false,
  });
});

// POST /casting/profiles - Save casting profile
app.post('/casting/profiles', (req, res) => {
  const { profile } = req.body;

  res.json({
    success: true,
    data: {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      profile,
    },
  });
});

// GET /casting/profiles - Get all profiles
app.get('/casting/profiles', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

// ============================================
// SCRIPT BREAKDOWN ENDPOINTS
// ============================================

app.post('/script/analyze', (req, res) => {
  const { script_text, project_type } = req.body;

  res.json({
    success: true,
    data: {
      overview: {
        total_scenes: 24,
        total_pages: 98,
        estimated_runtime: "102 minutes",
        tone: "Dramatic thriller with action sequences",
        setting: "Contemporary urban setting",
      },
      scenes: [
        {
          scene_number: 1,
          location: "Downtown Office - Day",
          description: "Opening scene establishing protagonist at work",
          characters: ["Sarah", "Boss", "Coworker"],
          estimated_duration: "3 minutes",
          props: ["Laptop", "Coffee cup", "Files"],
          notes: "Natural lighting preferred",
        },
        {
          scene_number: 2,
          location: "City Street - Night",
          description: "Chase sequence through downtown",
          characters: ["Sarah", "Pursuer"],
          estimated_duration: "8 minutes",
          props: ["Car", "Phone"],
          notes: "Requires stunt coordinator",
        },
      ],
      characters: [
        {
          name: "Sarah Chen",
          role: "Lead",
          scenes: 18,
          description: "Detective investigating corruption case",
          requirements: "Strong dramatic and action skills",
        },
        {
          name: "Marcus Rodriguez",
          role: "Supporting",
          scenes: 12,
          description: "Partner and confidant",
          requirements: "Good chemistry with lead",
        },
      ],
      locations: [
        {
          name: "Downtown Office",
          type: "Interior",
          scenes: 5,
          requirements: "Modern corporate setting",
        },
        {
          name: "City Streets",
          type: "Exterior",
          scenes: 8,
          requirements: "Night shooting permit required",
        },
      ],
    },
  });
});

// ============================================
// LOCATION SCOUT ENDPOINTS
// ============================================

app.post('/locations/search', (req, res) => {
  const { location_type, description, budget_range } = req.body;

  res.json({
    success: true,
    data: [
      {
        id: "loc_001",
        name: "Modern Downtown Loft",
        type: "Interior",
        address: "245 Market Street, San Francisco, CA",
        suitability_score: 92,
        photos: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          "https://images.unsplash.com/photo-1560185127-6a5ffa8c8bd5?w=800",
        ],
        cost_per_day: "$3,500",
        availability: "Mon-Fri, 9 AM - 6 PM",
        features: [
          "Natural lighting",
          "Open floor plan",
          "City views",
          "Nearby parking",
        ],
        logistics: {
          power: "Available",
          parking: "Street parking + garage",
          restrooms: "2 available",
          catering_space: "Kitchen available",
        },
        contact: {
          name: "Sarah Johnson",
          phone: "(415) 555-0123",
          email: "sarah@locations.com",
        },
      },
      {
        id: "loc_002",
        name: "Industrial Warehouse",
        type: "Interior/Exterior",
        address: "1890 Bay Street, Oakland, CA",
        suitability_score: 88,
        photos: [
          "https://images.unsplash.com/photo-1565193298-6a2f90e1a9ef?w=800",
          "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800",
        ],
        cost_per_day: "$2,800",
        availability: "24/7",
        features: [
          "Large open space",
          "High ceilings",
          "Loading dock",
          "Flexible layout",
        ],
        logistics: {
          power: "Industrial grade",
          parking: "Large lot",
          restrooms: "3 available",
          catering_space: "Office area",
        },
        contact: {
          name: "Mike Chen",
          phone: "(510) 555-0456",
          email: "mike@industrialspaces.com",
        },
      },
      {
        id: "loc_003",
        name: "Coastal Overlook",
        type: "Exterior",
        address: "Pacific Coast Highway, Marin County, CA",
        suitability_score: 85,
        photos: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        ],
        cost_per_day: "$1,500",
        availability: "Dawn to dusk",
        features: [
          "Ocean views",
          "Golden hour magic",
          "Dramatic cliffs",
          "Weather dependent",
        ],
        logistics: {
          power: "Generator required",
          parking: "Roadside",
          restrooms: "Portable required",
          catering_space: "Tent setup needed",
        },
        contact: {
          name: "County Film Office",
          phone: "(415) 555-0789",
          email: "permits@marincounty.gov",
        },
      },
    ],
  });
});

// ============================================
// STORYBOARD ENDPOINTS
// ============================================

app.post('/storyboard/generate', (req, res) => {
  const { scene_description, shot_count } = req.body;

  const shots = Array.from({ length: shot_count || 6 }, (_, i) => ({
    shot_number: i + 1,
    type: ["Wide", "Medium", "Close-up", "Over-shoulder"][i % 4],
    camera_angle: ["Eye level", "High angle", "Low angle"][i % 3],
    movement: ["Static", "Pan", "Dolly", "Handheld"][i % 4],
    duration: `${Math.floor(Math.random() * 10) + 3} seconds`,
    description: `Shot ${i + 1} description based on scene`,
    notes: "Camera and lighting notes",
  }));

  res.json({
    success: true,
    data: {
      scene_title: "Scene Analysis",
      total_shots: shot_count || 6,
      estimated_duration: "45 seconds",
      shots,
    },
  });
});

// ============================================
// CALL SHEET ENDPOINTS
// ============================================

app.post('/callsheet/generate', (req, res) => {
  const { production_name, shoot_date } = req.body;

  res.json({
    success: true,
    data: {
      production_name: production_name || "Untitled Production",
      shoot_date: shoot_date || new Date().toISOString().split('T')[0],
      call_time: "6:00 AM",
      location: "Downtown Loft - 245 Market St",
      crew_call: [
        { role: "Director", name: "Jane Smith", call_time: "6:00 AM" },
        { role: "DP", name: "Alex Johnson", call_time: "6:00 AM" },
        { role: "1st AD", name: "Mike Davis", call_time: "5:45 AM" },
        { role: "Gaffer", name: "Sarah Lee", call_time: "6:30 AM" },
      ],
      cast_call: [
        { role: "Lead", actor: "TBD", call_time: "7:00 AM", scenes: "1, 3, 5" },
        { role: "Supporting", actor: "TBD", call_time: "8:00 AM", scenes: "3, 4" },
      ],
      scenes_scheduled: [
        { number: 1, location: "INT. LOFT", pages: "2 1/8" },
        { number: 3, location: "INT. LOFT", pages: "3 2/8" },
      ],
      notes: [
        "Breakfast at 7:00 AM",
        "Lunch at 12:00 PM",
        "Martini shot at 6:00 PM",
      ],
    },
  });
});

// ============================================
// EQUIPMENT ENDPOINTS
// ============================================

app.get('/equipment/inventory', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "eq_001",
        name: "ARRI Alexa Mini LF",
        category: "Camera",
        status: "Available",
        location: "Warehouse A",
        daily_rate: "$1,200",
        weekly_rate: "$5,000",
        specs: {
          sensor: "Large Format",
          resolution: "4.5K",
          frame_rates: "1-60 fps",
        },
      },
      {
        id: "eq_002",
        name: "ARRI SkyPanel S60-C",
        category: "Lighting",
        status: "Booked",
        location: "Stage 2",
        daily_rate: "$150",
        weekly_rate: "$600",
        specs: {
          type: "LED",
          color_temp: "2,800-10,000K",
          power: "120W",
        },
      },
      {
        id: "eq_003",
        name: "DJI Ronin 2",
        category: "Stabilization",
        status: "Available",
        location: "Equipment Room",
        daily_rate: "$250",
        weekly_rate: "$1,000",
        specs: {
          payload: "30 lbs",
          modes: "3-axis",
          battery: "4 hours",
        },
      },
    ],
  });
});

app.post('/equipment/book', (req, res) => {
  const { equipment_id, start_date, end_date } = req.body;

  res.json({
    success: true,
    data: {
      booking_id: `book_${Date.now()}`,
      equipment_id,
      start_date,
      end_date,
      status: "Confirmed",
      total_cost: "$3,500",
    },
  });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculateBudget(range) {
  const budgets = {
    low: "$350K",
    medium: "$2.3M",
    high: "$18M",
    blockbuster: "$85M",
  };
  return budgets[range] || "$2.3M";
}

function calculateProductionDays(type) {
  const days = {
    feature: 45,
    series: 120,
    commercial: 5,
    short: 10,
    documentary: 60,
  };
  return days[type] || 45;
}

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🎬 Unified 3D Production Studio - Backend Server    ║
║                                                       ║
║  ✅ Server running on: http://localhost:${PORT}        ║
║  ✅ CORS enabled for frontend                        ║
║  ✅ All endpoints active                             ║
║                                                       ║
║  Available Endpoints:                                ║
║  • POST /casting/analyze                             ║
║  • POST /casting/profiles                            ║
║  • GET  /casting/profiles                            ║
║  • POST /script/analyze                              ║
║  • POST /locations/search                            ║
║  • POST /storyboard/generate                         ║
║  • POST /callsheet/generate                          ║
║  • GET  /equipment/inventory                         ║
║  • POST /equipment/book                              ║
║                                                       ║
║  Frontend: http://localhost:5002                     ║
╚═══════════════════════════════════════════════════════╝
  `);
});
