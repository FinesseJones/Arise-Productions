import { api } from "encore.dev/api";

export interface GenerateFormRequest {
  project_id: number;
  form_type: string;
  project_details?: Record<string, any>;
  custom_fields?: Array<{
    field_name: string;
    field_type: string;
    required: boolean;
  }>;
}

export interface GenerateFormResponse {
  form_content: string;
  form_metadata: {
    form_type: string;
    version: string;
    last_updated: Date;
    legal_compliance: string[];
  };
  instructions: string;
  related_forms: string[];
}

export interface GenerateFormPackageRequest {
  project_id: number;
  production_phase: 'development' | 'pre_production' | 'production' | 'post_production' | 'distribution';
  jurisdiction?: string;
  union_requirements?: boolean;
}

export interface GenerateFormPackageResponse {
  form_package: Array<{
    form_name: string;
    form_content: string;
    priority: 'critical' | 'important' | 'optional';
    deadline: string;
    instructions: string;
  }>;
  compliance_checklist: Array<{
    requirement: string;
    status: 'required' | 'recommended' | 'optional';
    forms_needed: string[];
  }>;
  submission_timeline: Array<{
    deadline: string;
    forms_due: string[];
    responsible_party: string;
  }>;
}

// Generates any standard film industry form with customization options.
export const generateForm = api<GenerateFormRequest, GenerateFormResponse>(
  { expose: true, method: "POST", path: "/ai/forms/generate" },
  async (req) => {
    const formContent = createFormContent(req);
    const metadata = generateFormMetadata(req.form_type);
    const instructions = generateFormInstructions(req.form_type);
    const relatedForms = findRelatedForms(req.form_type);
    
    return {
      form_content: formContent,
      form_metadata: metadata,
      instructions: instructions,
      related_forms: relatedForms
    };
  }
);

// Creates complete form packages for specific production phases.
export const generateFormPackage = api<GenerateFormPackageRequest, GenerateFormPackageResponse>(
  { expose: true, method: "POST", path: "/ai/forms/package" },
  async (req) => {
    const formPackage = createFormPackage(req);
    const complianceChecklist = generateComplianceChecklist(req);
    const submissionTimeline = createSubmissionTimeline(req);
    
    return {
      form_package: formPackage,
      compliance_checklist: complianceChecklist,
      submission_timeline: submissionTimeline
    };
  }
);

function createFormContent(req: GenerateFormRequest): string {
  const formTemplates = {
    talent_release: generateTalentRelease(),
    location_release: generateLocationRelease(),
    crew_deal_memo: generateCrewDealMemo(),
    call_sheet: generateCallSheetTemplate(),
    production_report: generateProductionReport(),
    continuity_log: generateContinuityLog(),
    equipment_checkout: generateEquipmentCheckout(),
    safety_report: generateSafetyReport(),
    budget_breakdown: generateBudgetBreakdown(),
    shot_log: generateShotLog(),
    music_cue_sheet: generateMusicCueSheet(),
    vfx_notes: generateVFXNotes(),
    color_notes: generateColorNotes(),
    delivery_checklist: generateDeliveryChecklist(),
    festival_submission: generateFestivalSubmission(),
    distribution_agreement: generateDistributionAgreement()
  };
  
  return formTemplates[req.form_type] || generateGenericForm(req.form_type);
}

function generateTalentRelease(): string {
  return `TALENT RELEASE FORM

PRODUCTION: ________________________________
PERFORMER: ________________________________
CHARACTER: ________________________________
DATE: _____________________________________

AGREEMENT:
I, the undersigned, hereby grant permission to [PRODUCTION COMPANY] to use my name, likeness, voice, and performance in connection with the production titled "[PROJECT TITLE]" and any related promotional materials.

COMPENSATION:
□ Paid performer - Rate: $_______ per day
□ Deferred payment - Amount: $_______
□ Copy/Credit/Meals only
□ Other: _________________________________

USAGE RIGHTS:
□ Worldwide distribution
□ All media (theatrical, television, streaming, internet)
□ Promotional and marketing use
□ Festival screenings

PERFORMER INFORMATION:
Name: ____________________________________
Address: _________________________________
Phone: ___________________________________
Email: ___________________________________
SSN/Tax ID: ______________________________

I acknowledge that I have read and understand this agreement.

Performer Signature: _______________________ Date: _________
Production Representative: _________________ Date: _________

WITNESS:
Name: ____________________________________
Signature: ________________________________ Date: _________`;
}

function generateLocationRelease(): string {
  return `LOCATION RELEASE AGREEMENT

PRODUCTION: ________________________________
LOCATION: __________________________________
ADDRESS: ___________________________________
DATE(S) OF USE: ____________________________

PROPERTY OWNER/AUTHORIZED REPRESENTATIVE:
Name: _____________________________________
Title: ____________________________________
Phone: ____________________________________
Email: ____________________________________

FILMING DETAILS:
Shooting dates: ____________________________
Hours: ____________________________________
Crew size: ________________________________
Equipment: ________________________________
Special requirements: ______________________

COMPENSATION:
Location fee: $____________________________
Security deposit: $_________________________
Additional costs: __________________________

PERMISSIONS GRANTED:
□ Interior filming
□ Exterior filming  
□ Parking for crew vehicles
□ Equipment staging area
□ Power access
□ Catering setup area

RESTRICTIONS:
□ No smoking
□ No alcohol
□ Noise limitations: _______________________
□ Access limitations: ______________________
□ Other: __________________________________

INSURANCE:
Production company carries $_______ liability insurance.
Certificate of insurance attached: □ Yes □ No

INDEMNIFICATION:
Production company agrees to indemnify and hold harmless the property owner from any claims arising from the use of the location.

Property Owner Signature: __________________ Date: _________
Production Representative: _________________ Date: _________`;
}

function generateCrewDealMemo(): string {
  return `CREW DEAL MEMORANDUM

PRODUCTION: ________________________________
CREW MEMBER: _______________________________
POSITION: __________________________________
DEPARTMENT: ________________________________

EMPLOYMENT TERMS:
Start date: _______________________________
End date: _________________________________
Rate: $___________________________________
Payment schedule: _________________________
Overtime rate: ____________________________

RESPONSIBILITIES:
_________________________________________
_________________________________________
_________________________________________

EQUIPMENT PROVIDED:
□ Camera equipment
□ Sound equipment
□ Lighting equipment
□ Transportation
□ Other: _________________________________

CREW MEMBER PROVIDES:
□ Own equipment (list): ___________________
□ Own transportation
□ Own tools
□ Other: _________________________________

WORKING CONDITIONS:
Standard hours: ___________________________
Meal provisions: __________________________
Accommodation: ____________________________
Travel arrangements: ______________________

CREDITS:
On-screen credit: _________________________
Credit position: __________________________

ADDITIONAL TERMS:
_________________________________________
_________________________________________

Crew Member Signature: ____________________ Date: _________
Production Representative: ________________ Date: _________`;
}

function generateCallSheetTemplate(): string {
  return `CALL SHEET

PRODUCTION: ________________________________
DATE: _____________________________________
WEATHER: __________________________________
SUNRISE: _____________ SUNSET: _____________

GENERAL CALL: _____________________________

LOCATIONS:
Location 1: _______________________________
Address: __________________________________
Call time: ________________________________
Parking: __________________________________
Contact: __________________________________

CAST SCHEDULE:
Name          Character      Makeup    Set Call    Pickup
____________  _____________  ________  __________  __________
____________  _____________  ________  __________  __________
____________  _____________  ________  __________  __________

CREW CALL: ________________________________

SCENES SHOOTING:
Scene #    Description                    Location
_______    ________________________      ____________
_______    ________________________      ____________
_______    ________________________      ____________

SPECIAL REQUIREMENTS:
□ Rain cover available
□ Generator on location
□ Craft services
□ First aid kit
□ Security
□ Other: _________________________________

EMERGENCY CONTACTS:
Producer: _________________________________
Director: _________________________________
1st AD: ___________________________________
Location Manager: _________________________
Medical: __________________________________

ADVANCE SCHEDULE:
Tomorrow: _________________________________
Day after: _______________________________

NOTES:
_________________________________________
_________________________________________`;
}

function generateProductionReport(): string {
  return `DAILY PRODUCTION REPORT

PRODUCTION: ________________________________
DATE: _____________________________________
SHOOT DAY: ________________________________
WEATHER: __________________________________

SCHEDULE:
First shot: _______________________________
Lunch: ____________________________________
Wrap: ____________________________________
Total hours: ______________________________

SCENES COMPLETED:
Scene #    Description                    Takes    Status
_______    ________________________      _____    __________
_______    ________________________      _____    __________
_______    ________________________      _____    __________

FOOTAGE SHOT:
Total footage: ____________________________
Good takes: _______________________________
Print takes: ______________________________

CAST PRESENT:
Name                    Call Time    Wrap Time
____________________    _________    __________
____________________    _________    __________
____________________    _________    __________

CREW PRESENT: _____________________________

EQUIPMENT ISSUES:
_________________________________________
_________________________________________

DELAYS/PROBLEMS:
_________________________________________
_________________________________________

TOMORROW'S SCHEDULE:
_________________________________________
_________________________________________

1st AD Signature: _________________________ Date: _________`;
}

function generateContinuityLog(): string {
  return `CONTINUITY LOG

PRODUCTION: ________________________________
DATE: _____________________________________
SCENE: ____________________________________

SCRIPT NOTES:
Page: _____________________________________
Scene description: ________________________
_________________________________________

WARDROBE:
Character: ________________________________
Costume details: __________________________
_________________________________________
Continuity notes: _________________________
_________________________________________

PROPS:
Props used: _______________________________
_________________________________________
Prop positions: ___________________________
_________________________________________

MAKEUP/HAIR:
Character: ________________________________
Makeup notes: _____________________________
Hair notes: _______________________________
Continuity concerns: ______________________

CAMERA NOTES:
Lens used: ________________________________
Camera position: __________________________
Lighting setup: ___________________________

ACTION NOTES:
Character movements: _______________________
_________________________________________
Dialogue changes: _________________________
_________________________________________

MATCHING REQUIREMENTS:
Previous scene connections: _______________
_________________________________________
Next scene requirements: __________________
_________________________________________

Script Supervisor: _______________________ Date: _________`;
}

function generateEquipmentCheckout(): string {
  return `EQUIPMENT CHECKOUT FORM

PRODUCTION: ________________________________
DATE OUT: __________________________________
DATE RETURN: _______________________________
RESPONSIBLE PARTY: _________________________

CAMERA EQUIPMENT:
□ Camera body: ____________________________
□ Lenses: _________________________________
□ Tripod: _________________________________
□ Batteries: ______________________________
□ Memory cards: ___________________________
□ Other: __________________________________

SOUND EQUIPMENT:
□ Recorder: _______________________________
□ Microphones: ____________________________
□ Boom pole: ______________________________
□ Headphones: _____________________________
□ Cables: _________________________________
□ Other: __________________________________

LIGHTING EQUIPMENT:
□ Light kit: ______________________________
□ Stands: _________________________________
□ Modifiers: ______________________________
□ Extension cords: ________________________
□ Other: __________________________________

CONDITION NOTES:
_________________________________________
_________________________________________

CHECKOUT:
Equipment Manager: ________________________ Date: _________
Recipient: _______________________________ Date: _________

RETURN:
Equipment Manager: ________________________ Date: _________
Condition upon return: ____________________
_________________________________________`;
}

function generateSafetyReport(): string {
  return `SAFETY REPORT

PRODUCTION: ________________________________
DATE: _____________________________________
LOCATION: __________________________________
REPORTING PARTY: ___________________________

INCIDENT TYPE:
□ Injury
□ Near miss
□ Equipment malfunction
□ Safety violation
□ Other: __________________________________

INCIDENT DETAILS:
Time of incident: _________________________
Weather conditions: _______________________
Description: ______________________________
_________________________________________
_________________________________________

PERSONS INVOLVED:
Name: ____________________________________
Position: ________________________________
Injury description: _______________________
_________________________________________

WITNESSES:
Name: ____________________________________
Contact: _________________________________

IMMEDIATE ACTION TAKEN:
_________________________________________
_________________________________________

MEDICAL ATTENTION:
□ First aid administered
□ Medical professional consulted
□ Hospital visit required
□ No medical attention needed

FOLLOW-UP REQUIRED:
□ Equipment inspection
□ Safety briefing
□ Procedure review
□ Other: __________________________________

Safety Officer: ___________________________ Date: _________`;
}

function generateBudgetBreakdown(): string {
  return `BUDGET BREAKDOWN

PRODUCTION: ________________________________
PREPARED BY: _______________________________
DATE: _____________________________________

ABOVE THE LINE:
Producer fee: $_____________________________
Director fee: $_____________________________
Writer fee: $_______________________________
Cast: $____________________________________
Total Above the Line: $____________________

BELOW THE LINE:
Crew: $____________________________________
Equipment: $________________________________
Locations: $________________________________
Transportation: $___________________________
Catering: $_________________________________
Wardrobe: $_________________________________
Makeup: $__________________________________
Props: $___________________________________
Set decoration: $___________________________
Post-production: $__________________________
Music: $___________________________________
Sound: $___________________________________
Insurance: $________________________________
Legal: $___________________________________
Miscellaneous: $____________________________
Total Below the Line: $____________________

CONTINGENCY (10%): $________________________

TOTAL BUDGET: $_____________________________

FUNDING SOURCES:
Source 1: $_______________________________
Source 2: $_______________________________
Source 3: $_______________________________
Total funding: $___________________________

Producer: _________________________________ Date: _________`;
}

function generateShotLog(): string {
  return `SHOT LOG

PRODUCTION: ________________________________
DATE: _____________________________________
CAMERA: ___________________________________
OPERATOR: _________________________________

SCENE: ____________________________________
SETUP: ____________________________________

Shot #  Take  Lens   F-stop  Focus   Notes              Good/NG
______  ____  _____  ______  ______  ________________  _______
______  ____  _____  ______  ______  ________________  _______
______  ____  _____  ______  ______  ________________  _______
______  ____  _____  ______  ______  ________________  _______
______  ____  _____  ______  ______  ________________  _______
______  ____  _____  ______  ______  ________________  _______
______  ____  _____  ______  ______  ________________  _______
______  ____  _____  ______  ______  ________________  _______

CAMERA SETTINGS:
ISO: ______________________________________
Shutter speed: ____________________________
White balance: ____________________________
Picture profile: __________________________

NOTES:
_________________________________________
_________________________________________
_________________________________________

Camera Operator: __________________________ Date: _________`;
}

function generateMusicCueSheet(): string {
  return `MUSIC CUE SHEET

PRODUCTION: ________________________________
TOTAL RUNTIME: _____________________________
PREPARED BY: _______________________________

Cue #  Title              Composer        Publisher       Usage    Duration
_____  ________________  ______________  ______________  _______  ________
_____  ________________  ______________  ______________  _______  ________
_____  ________________  ______________  ______________  _______  ________
_____  ________________  ______________  ______________  _______  ________
_____  ________________  ______________  ______________  _______  ________

USAGE CODES:
BI - Background Instrumental
BV - Background Vocal
FI - Feature Instrumental
FV - Feature Vocal
TH - Theme
JI - Jingle

RIGHTS INFORMATION:
□ All music cleared for use
□ Synchronization rights secured
□ Master recording rights secured
□ Performance rights notification sent

CONTACT INFORMATION:
Music Supervisor: _________________________
Phone: ___________________________________
Email: ___________________________________

Music Editor: _____________________________
Phone: ___________________________________
Email: ___________________________________

Prepared by: ______________________________ Date: _________`;
}

function generateVFXNotes(): string {
  return `VFX NOTES

PRODUCTION: ________________________________
SCENE: ____________________________________
SHOT: _____________________________________
VFX SUPERVISOR: ____________________________

SHOT DESCRIPTION:
_________________________________________
_________________________________________

VFX REQUIREMENTS:
□ Green screen removal
□ Object removal/addition
□ Digital environments
□ Character enhancement
□ Particle effects
□ Compositing
□ Other: __________________________________

TECHNICAL SPECIFICATIONS:
Resolution: _______________________________
Frame rate: _______________________________
Color space: ______________________________
Codec: ____________________________________

REFERENCE MATERIALS:
□ Concept art attached
□ Reference footage
□ Camera tracking data
□ Lighting reference
□ HDR environment

DELIVERY REQUIREMENTS:
Format: ___________________________________
Resolution: _______________________________
Deadline: _________________________________

NOTES:
_________________________________________
_________________________________________
_________________________________________

VFX Supervisor: ___________________________ Date: _________`;
}

function generateColorNotes(): string {
  return `COLOR CORRECTION NOTES

PRODUCTION: ________________________________
SCENE: ____________________________________
COLORIST: _________________________________

SCENE DESCRIPTION:
_________________________________________
_________________________________________

COLOR DIRECTION:
Overall mood: _____________________________
Color temperature: ________________________
Contrast level: ___________________________
Saturation: _______________________________

SPECIFIC ADJUSTMENTS:
Highlights: _______________________________
Shadows: __________________________________
Midtones: _________________________________
Skin tones: _______________________________

REFERENCE IMAGES:
_________________________________________
_________________________________________

TECHNICAL NOTES:
Source format: ____________________________
Delivery format: __________________________
Color space: ______________________________
Gamma: ____________________________________

APPROVAL:
□ Director approved
□ DP approved
□ Producer approved
□ Client approved

NOTES:
_________________________________________
_________________________________________

Colorist: ________________________________ Date: _________`;
}

function generateDeliveryChecklist(): string {
  return `DELIVERY CHECKLIST

PRODUCTION: ________________________________
DELIVERY DATE: _____________________________
RECIPIENT: ________________________________

VIDEO DELIVERABLES:
□ Master file (4K ProRes 4444)
□ HD version (1080p H.264)
□ SD version (720p H.264)
□ Streaming version (multiple bitrates)
□ DCP for theatrical
□ Broadcast version (as specified)

AUDIO DELIVERABLES:
□ 5.1 surround mix
□ Stereo mix
□ Dialogue stems
□ Music stems
□ Effects stems
□ M&E (Music & Effects) mix

SUBTITLE/CAPTION FILES:
□ English subtitles (.srt)
□ Closed captions
□ Foreign language subtitles
□ SDH (Subtitles for Deaf/Hard of hearing)

DOCUMENTATION:
□ Final script
□ Music cue sheet
□ Credit list
□ Technical specifications
□ Chain of title documents
□ E&O insurance certificate

ARTWORK:
□ Key art (poster)
□ Title treatment
□ Background artwork
□ Character artwork
□ Logo files

METADATA:
□ Synopsis (multiple lengths)
□ Cast and crew information
□ Technical specifications
□ Rating information
□ Genre classification

Post Supervisor: __________________________ Date: _________`;
}

function generateFestivalSubmission(): string {
  return `FESTIVAL SUBMISSION FORM

FILM TITLE: _______________________________
DIRECTOR: _________________________________
PRODUCER: ________________________________
RUNTIME: __________________________________
COMPLETION DATE: ___________________________

FESTIVAL INFORMATION:
Festival name: ____________________________
Submission deadline: ______________________
Entry fee: $______________________________
Category: _________________________________

TECHNICAL SPECIFICATIONS:
Format: ___________________________________
Resolution: _______________________________
Aspect ratio: _____________________________
Sound: ____________________________________
Subtitles: _______________________________

SUBMISSION MATERIALS:
□ Screener (online link or physical)
□ Trailer
□ Still photographs (minimum 5)
□ Director's statement
□ Producer's statement
□ Synopsis (25, 50, 100 words)
□ Cast and crew list
□ Production notes

CONTACT INFORMATION:
Submitter: _______________________________
Title: ___________________________________
Company: _________________________________
Address: _________________________________
Phone: ___________________________________
Email: ___________________________________

PREMIERE STATUS:
□ World premiere
□ International premiere
□ North American premiere
□ Regional premiere
□ Not a premiere

ADDITIONAL INFORMATION:
_________________________________________
_________________________________________

Submitted by: _____________________________ Date: _________`;
}

function generateDistributionAgreement(): string {
  return `DISTRIBUTION AGREEMENT TEMPLATE

PARTIES:
Licensor (Producer): ______________________
Licensee (Distributor): __________________

FILM INFORMATION:
Title: ___________________________________
Runtime: _________________________________
Rating: __________________________________
Completion date: __________________________

TERRITORY:
□ Worldwide
□ North America
□ Specific territories: ___________________

DISTRIBUTION RIGHTS:
□ Theatrical
□ Home video/DVD
□ Video on demand
□ Streaming platforms
□ Television broadcast
□ Educational
□ Non-theatrical

TERM:
Start date: _______________________________
Duration: _________________________________
Options for extension: ____________________

FINANCIAL TERMS:
Advance: $_________________________________
Revenue split: ____________________________
Recoupable expenses: _______________________
Accounting frequency: _____________________

DELIVERY REQUIREMENTS:
□ Master materials
□ Artwork
□ Trailer
□ Publicity materials
□ Music cue sheets
□ Chain of title documents

MARKETING OBLIGATIONS:
Minimum marketing spend: $__________________
Approval rights: __________________________
Consultation requirements: _________________

This is a template only. Consult with entertainment attorney before execution.

Licensor: ________________________________ Date: _________
Licensee: _______________________________ Date: _________`;
}

function generateGenericForm(formType: string): string {
  return `${formType.toUpperCase().replace('_', ' ')} FORM

PRODUCTION: ________________________________
DATE: _____________________________________
PREPARED BY: _______________________________

[This is a generic template for ${formType}. Please customize as needed for your specific requirements.]

DETAILS:
_________________________________________
_________________________________________
_________________________________________
_________________________________________

ADDITIONAL INFORMATION:
_________________________________________
_________________________________________
_________________________________________

SIGNATURES:
Prepared by: ______________________________ Date: _________
Approved by: _____________________________ Date: _________`;
}

function generateFormMetadata(formType: string) {
  return {
    form_type: formType,
    version: "1.0",
    last_updated: new Date(),
    legal_compliance: [
      "Industry standard format",
      "Legal review recommended",
      "State law compliance required"
    ]
  };
}

function generateFormInstructions(formType: string): string {
  const instructions = {
    talent_release: "Complete all fields before filming. Ensure performer understands usage rights. Keep original with production files.",
    location_release: "Obtain signatures before filming begins. Verify property owner authority. Include insurance certificate.",
    crew_deal_memo: "Finalize terms before crew member starts work. Include all equipment and expense details.",
    call_sheet: "Distribute 24 hours before shoot day. Confirm all contact information. Include weather backup plans.",
    production_report: "Complete daily by 1st AD. Submit to production office within 24 hours.",
    continuity_log: "Maintain detailed notes for each scene. Include photos when possible. Critical for post-production.",
    equipment_checkout: "Inspect all equipment before checkout. Note any existing damage. Verify return date.",
    safety_report: "Complete immediately after any incident. Include witness statements. Submit to production insurance.",
    budget_breakdown: "Update regularly throughout production. Track actual vs. estimated costs. Include all receipts.",
    shot_log: "Maintain accurate records for each take. Note technical settings. Critical for post-production workflow."
  };
  
  return instructions[formType] || "Complete all required fields. Obtain necessary signatures. Keep copies for production records.";
}

function findRelatedForms(formType: string): string[] {
  const relatedForms = {
    talent_release: ["crew_deal_memo", "call_sheet", "production_report"],
    location_release: ["call_sheet", "safety_report", "equipment_checkout"],
    crew_deal_memo: ["talent_release", "equipment_checkout", "production_report"],
    call_sheet: ["talent_release", "location_release", "production_report"],
    production_report: ["call_sheet", "continuity_log", "shot_log"],
    continuity_log: ["production_report", "shot_log", "vfx_notes"],
    equipment_checkout: ["crew_deal_memo", "safety_report", "production_report"],
    safety_report: ["location_release", "equipment_checkout", "production_report"],
    budget_breakdown: ["crew_deal_memo", "location_release", "equipment_checkout"],
    shot_log: ["production_report", "continuity_log", "vfx_notes"]
  };
  
  return relatedForms[formType] || [];
}

function createFormPackage(req: GenerateFormPackageRequest) {
  const phasePackages = {
    development: [
      { form_name: "Budget Breakdown", priority: "critical" as const, deadline: "Before pre-production" },
      { form_name: "Crew Deal Memos", priority: "important" as const, deadline: "Before crew start dates" },
      { form_name: "Location Releases", priority: "critical" as const, deadline: "Before location use" }
    ],
    pre_production: [
      { form_name: "Talent Releases", priority: "critical" as const, deadline: "Before filming" },
      { form_name: "Equipment Checkout", priority: "important" as const, deadline: "Equipment pickup" },
      { form_name: "Call Sheets", priority: "critical" as const, deadline: "24 hours before shoot" },
      { form_name: "Safety Reports", priority: "important" as const, deadline: "As needed" }
    ],
    production: [
      { form_name: "Daily Production Reports", priority: "critical" as const, deadline: "Daily" },
      { form_name: "Continuity Logs", priority: "critical" as const, deadline: "Per scene" },
      { form_name: "Shot Logs", priority: "important" as const, deadline: "Per setup" },
      { form_name: "Safety Reports", priority: "critical" as const, deadline: "As needed" }
    ],
    post_production: [
      { form_name: "VFX Notes", priority: "important" as const, deadline: "VFX handoff" },
      { form_name: "Color Notes", priority: "important" as const, deadline: "Color session" },
      { form_name: "Music Cue Sheet", priority: "critical" as const, deadline: "Final mix" },
      { form_name: "Delivery Checklist", priority: "critical" as const, deadline: "Final delivery" }
    ],
    distribution: [
      { form_name: "Festival Submission", priority: "important" as const, deadline: "Submission deadlines" },
      { form_name: "Distribution Agreement", priority: "critical" as const, deadline: "Deal negotiation" },
      { form_name: "Delivery Checklist", priority: "critical" as const, deadline: "Distribution delivery" }
    ]
  };
  
  const forms = phasePackages[req.production_phase] || [];
  
  return forms.map(form => ({
    form_name: form.form_name,
    form_content: createFormContent({ 
      project_id: req.project_id, 
      form_type: form.form_name.toLowerCase().replace(' ', '_') 
    }),
    priority: form.priority,
    deadline: form.deadline,
    instructions: generateFormInstructions(form.form_name.toLowerCase().replace(' ', '_'))
  }));
}

function generateComplianceChecklist(req: GenerateFormPackageRequest) {
  return [
    {
      requirement: "Talent agreements",
      status: "required" as const,
      forms_needed: ["talent_release", "crew_deal_memo"]
    },
    {
      requirement: "Location permissions",
      status: "required" as const,
      forms_needed: ["location_release"]
    },
    {
      requirement: "Safety documentation",
      status: "required" as const,
      forms_needed: ["safety_report"]
    },
    {
      requirement: "Production tracking",
      status: "recommended" as const,
      forms_needed: ["production_report", "continuity_log"]
    }
  ];
}

function createSubmissionTimeline(req: GenerateFormPackageRequest) {
  return [
    {
      deadline: "Pre-production start",
      forms_due: ["Budget Breakdown", "Crew Deal Memos"],
      responsible_party: "Producer"
    },
    {
      deadline: "First day of filming",
      forms_due: ["Talent Releases", "Location Releases", "Call Sheets"],
      responsible_party: "1st AD"
    },
    {
      deadline: "Daily during production",
      forms_due: ["Production Reports", "Continuity Logs"],
      responsible_party: "Script Supervisor"
    },
    {
      deadline: "Post-production delivery",
      forms_due: ["Delivery Checklist", "Music Cue Sheet"],
      responsible_party: "Post Supervisor"
    }
  ];
}
