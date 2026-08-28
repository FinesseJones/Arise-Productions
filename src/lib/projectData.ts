"use client";

// Dynamic Hollywood Story & Character Generator for Arise Production Studio

export interface ProjectPlotProfile {
  title: string;
  logline: string;
  themes: string;
  storyTypes: string[];
  genres: string[];
  tone: string;
  audience: string;
}

export interface CharacterItem {
  id: string;
  name: string;
  role: 'Protagonist' | 'Mentor' | 'Antagonist' | 'Supporting';
  arcType: 'Positive Arc' | 'Flat Arc' | 'Disillusion Arc' | 'Spiral Arc' | 'Corruption Arc';
  personality: string;
  archetypes: string[];
}

export interface ActItem {
  teaser: string;
  act1: string;
  act2A: string;
  act2B: string;
  act3: string;
}

export interface BeatCard {
  id: string;
  act: string;
  title: string;
  description: string;
}

export function getProjectPlot(projectName: string): ProjectPlotProfile {
  const pLower = (projectName || '').toLowerCase();

  if (pLower.includes('vicious')) {
    return {
      title: projectName,
      logline: 'A relentless undercover detective breaks departmental protocol to dismantle a syndicate before his compromised identity is exposed across the city.',
      themes: 'Justice vs vengeance, corruption of institutional power, and moral compromise in the line of duty.',
      storyTypes: ['David Vs Goliath', 'Whodunit'],
      genres: ['Crime', 'Action', 'Thriller'],
      tone: 'Gritty, adrenaline-fueled, high-tension noir',
      audience: 'Adult (18+)',
    };
  }

  if (pLower.includes('echoes') || pLower.includes('past')) {
    return {
      title: projectName,
      logline: 'In a flooded coastal metropolis, a lone memory archivist uncovers a suppressed neural recording that reveals the catastrophe was intentionally engineered.',
      themes: 'Historical revisionism, preservation of human memory, and synthetic grief in a submerged world.',
      storyTypes: ["Hero's Journey", 'Voyage & Return'],
      genres: ['Sci-Fi', 'Mystery', 'Drama'],
      tone: 'Atmospheric, melancholic, cerebral wonder',
      audience: 'Teens & Adults (16+)',
    };
  }

  if (pLower.includes('shadow') || pLower.includes('protocol')) {
    return {
      title: projectName,
      logline: 'When an elite intelligence operative is disavowed by her own agency, she forms an uneasy alliance with rogue hacktivists to expose a global surveillance blacksite.',
      themes: 'Digital sovereignty, loyalty vs conscience, and the cost of anonymity in an omnipresent panopticon.',
      storyTypes: ['David Vs Goliath', 'Golden Fleece'],
      genres: ['Thriller', 'Action', 'Drama'],
      tone: 'Fast-paced, high-tech tactical realism',
      audience: 'General Theatrical (14+)',
    };
  }

  if (pLower.includes('fatherless')) {
    return {
      title: projectName,
      logline: 'In the East District urban community, a determined social worker and a passionate youth center director confront generational cycles of paternal absence, standing together to protect vulnerable families and preserve their community sanctuary from predatory redevelopment.',
      themes: 'Paternal absence, generational healing, community sanctuary, faith, and emotional resilience.',
      storyTypes: ['Rags to Riches', 'Rebirth'],
      genres: ['Drama', 'Family', 'Faith'],
      tone: 'Emotionally grounded, warm, poetic realism',
      audience: 'Four-Quadrant Theatrical (PG-13)',
    };
  }

  if (pLower.includes('armor')) {
    return {
      title: projectName,
      logline: 'Based on Ephesians 6:11 and Romans 1: An inner-city young man confronted with generational fatherlessness discovers the spiritual armor necessary to stand against principalities and powers.',
      themes: 'Spiritual protection, biblical manhood, righteous defense, and truth over deceit.',
      storyTypes: ['Overcoming The Monster', 'Rebirth'],
      genres: ['Drama', 'Faith', 'Spiritual Warfare'],
      tone: 'Cinematic, hard-hitting, scripture-anchored realism',
      audience: 'General Theatrical (PG-13)',
    };
  }

  if (pLower.includes('joseph')) {
    return {
      title: projectName,
      logline: 'From betrayal into Egyptian bondage to divine elevation and familial reconciliation: The definitive cinematic journey of Joseph.',
      themes: 'Providence, divine destiny, forgiveness, and generational preservation.',
      storyTypes: ['Rags to Riches', "Hero's Journey"],
      genres: ['Biblical Epic', 'Drama', 'Historical'],
      tone: 'Epic, emotionally soaring, sacred majesty',
      audience: 'All Audiences (PG)',
    };
  }

  if (pLower.includes('sabbath') || pLower.includes('uncut')) {
    return {
      title: projectName,
      logline: 'Precept upon precept, line upon line: An episodic docuseries unveiling the unadulterated scriptures, prophecies, and ancient covenants.',
      themes: 'Scripture fidelity, ancient heritage, divine law, and prophetic truth.',
      storyTypes: ['Voyage & Return', 'Whodunit'],
      genres: ['Docuseries', 'Episodic', 'Faith'],
      tone: 'Deeply revelatory, scholarly, profound authority',
      audience: 'General (PG)',
    };
  }

  if (pLower.includes('awakened') || pLower.includes('awakening')) {
    return {
      title: projectName,
      logline: 'A profound journey of spiritual awakening, identity, and standing firm in scripture against unseen worldly pressures.',
      themes: 'Spiritual identity, awakening from deception, covenant heritage, and courage.',
      storyTypes: ["Hero's Journey", 'Rebirth'],
      genres: ['Drama', 'Spiritual Thriller', 'Faith'],
      tone: 'Provocative, urgent, illuminating realism',
      audience: 'General Theatrical (PG-13)',
    };
  }

  // Dynamic Generator for any custom project
  return {
    title: projectName || 'New Studio Production',
    logline: `When unexpected forces disrupt the world of ${projectName}, the protagonist must venture beyond known boundaries to confront critical stakes and protect what matters most.`,
    themes: `Legacy, courage, resilience, and transformation through the high-stakes journey of ${projectName}.`,
    storyTypes: ["Hero's Journey", 'David Vs Goliath'],
    genres: ['Drama', 'Thriller'],
    tone: 'Cinematic, engaging, character-driven tension',
    audience: 'General Theatrical (PG-13)',
  };
}

export function getProjectCharacters(projectName: string): CharacterItem[] {
  const pLower = (projectName || '').toLowerCase();

  if (pLower.includes('vicious')) {
    return [
      {
        id: 'c1',
        name: 'Detective Jax Rivera',
        role: 'Protagonist',
        arcType: 'Positive Arc',
        personality: 'Street-hardened, relentless detective haunted by past mistakes. Driven by a deep code of honor that conflicts with institutional corruption.',
        archetypes: ['Hero', 'Outlaw', 'Seeker'],
      },
      {
        id: 'c2',
        name: 'Captain Vance Sterling',
        role: 'Mentor',
        arcType: 'Flat Arc',
        personality: 'Veteran precinct chief balancing political survival with deep loyalty to his detectives. Pragmatic and observant.',
        archetypes: ['Ruler', 'Sage'],
      },
      {
        id: 'c3',
        name: 'Hector Cruz',
        role: 'Antagonist',
        arcType: 'Corruption Arc',
        personality: 'Charismatic syndicate boss with tentacles in municipal politics. Ruthless, patient, and surgically intelligent.',
        archetypes: ['Shadow', 'Ruler'],
      },
      {
        id: 'c4',
        name: 'Elena Ramos',
        role: 'Supporting',
        arcType: 'Disillusion Arc',
        personality: 'Investigative reporter unravelling financial shell companies. Fearless in the face of violent intimidation.',
        archetypes: ['Explorer', 'Seeker'],
      },
    ];
  }

  if (pLower.includes('echoes') || pLower.includes('past')) {
    return [
      {
        id: 'c1',
        name: 'Ronald Cole',
        role: 'Protagonist',
        arcType: 'Positive Arc',
        personality: 'Introverted neural archivist obsessed with analog recordings in a digitized post-flood world. Compassionate and detail-oriented.',
        archetypes: ['Creator', 'Sage', 'Seeker'],
      },
      {
        id: 'c2',
        name: 'Dr. Aris Thorne',
        role: 'Mentor',
        arcType: 'Flat Arc',
        personality: 'Pioneering cyber-archaeologist who preserved pre-submersion history. Philosophical and protective.',
        archetypes: ['Sage', 'Caregiver'],
      },
      {
        id: 'c3',
        name: 'Director Vane',
        role: 'Antagonist',
        arcType: 'Corruption Arc',
        personality: 'Head of the Reconstruction Bureau who believes total historical redaction is necessary for societal stability.',
        archetypes: ['Ruler', 'Destroyer'],
      },
      {
        id: 'c4',
        name: 'Kira Vance',
        role: 'Supporting',
        arcType: 'Disillusion Arc',
        personality: 'Deep-submersible pilot who navigates submerged districts with daring technical skill.',
        archetypes: ['Explorer', 'Hero'],
      },
    ];
  }

  if (pLower.includes('shadow') || pLower.includes('protocol')) {
    return [
      {
        id: 'c1',
        name: 'Agent Maya Lin',
        role: 'Protagonist',
        arcType: 'Positive Arc',
        personality: 'Ex-intelligence tactical operator skilled in counter-surveillance and close-quarters extraction. Methodical and loyal.',
        archetypes: ['Hero', 'Warrior', 'Seeker'],
      },
      {
        id: 'c2',
        name: 'Director Sterling',
        role: 'Mentor',
        arcType: 'Flat Arc',
        personality: 'Veteran handler working from the shadows to protect assets from rogue factions.',
        archetypes: ['Sage', 'Ruler'],
      },
      {
        id: 'c3',
        name: 'Cipher / Thomas Ross',
        role: 'Antagonist',
        arcType: 'Corruption Arc',
        personality: 'Former operative turned private intelligence contractor weaponizing algorithmic deepfakes.',
        archetypes: ['Shadow', 'Magician'],
      },
      {
        id: 'c4',
        name: 'Noah Patel',
        role: 'Supporting',
        arcType: 'Disillusion Arc',
        personality: 'Brilliant cryptographer who can bypass optical security grids under extreme pressure.',
        archetypes: ['Creator', 'Jester'],
      },
    ];
  }

  if (pLower.includes('fatherless')) {
    return [
      {
        id: 'c1',
        name: 'Ayanna Jackson',
        role: 'Protagonist',
        arcType: 'Positive Arc',
        personality: '25-year-old social worker and case manager at East District Family Services. Caring, fiercely determined, independent, but emotionally guarded. Struggles to trust men in authority due to childhood paternal abandonment.',
        archetypes: ['Hero', 'Caregiver', 'Seeker'],
      },
      {
        id: 'c2',
        name: 'Malachi Davis',
        role: 'Protagonist',
        arcType: 'Positive Arc',
        personality: '27-year-old community organizer and director of the East District Youth Center. Charismatic, confident, fiercely loyal, and protective of fatherless youth.',
        archetypes: ['Hero', 'Sage', 'Warrior'],
      },
      {
        id: 'c3',
        name: 'Leila Jackson',
        role: 'Mentor',
        arcType: 'Flat Arc',
        personality: '52-year-old mother of Ayanna. Resilient, faith-anchored matriarch who worked double shifts to provide stability.',
        archetypes: ['Sage', 'Caregiver'],
      },
      {
        id: 'c4',
        name: 'Nia Davis',
        role: 'Supporting',
        arcType: 'Flat Arc',
        personality: '50-year-old mother of Malachi. Independent, sharp-witted local business pillar.',
        archetypes: ['Ruler', 'Caregiver'],
      },
      {
        id: 'c5',
        name: 'Tanesha Lee',
        role: 'Supporting',
        arcType: 'Flat Arc',
        personality: '25-year-old youth counselor and Ayanna\'s closest friend since childhood. Loyal, humorous, and candid.',
        archetypes: ['Jester', 'Caregiver'],
      },
      {
        id: 'c6',
        name: 'Tyler Brown',
        role: 'Supporting',
        arcType: 'Flat Arc',
        personality: '27-year-old youth coach and Malachi\'s right-hand brother defending the youth center.',
        archetypes: ['Warrior', 'Creator'],
      },
    ];
  }

  // Bespoke dynamic cast for any custom production
  const baseTitle = projectName || 'Story';
  return [
    {
      id: 'c1',
      name: `Lead Protagonist (${baseTitle})`,
      role: 'Protagonist',
      arcType: 'Positive Arc',
      personality: `The central driving force of ${baseTitle}. Determined, multifaceted, and forced to overcome internal hesitation when external stakes peak.`,
      archetypes: ['Hero', 'Creator', 'Seeker'],
    },
    {
      id: 'c2',
      name: 'The Mentor / Guide',
      role: 'Mentor',
      arcType: 'Flat Arc',
      personality: `Experienced advisor providing wisdom, training, and ethical grounding during ${baseTitle}'s pivotal crossroads.`,
      archetypes: ['Sage', 'Caregiver'],
    },
    {
      id: 'c3',
      name: 'Primary Antagonist',
      role: 'Antagonist',
      arcType: 'Corruption Arc',
      personality: `Formidable opposition who presents a direct ideological and physical challenge to the protagonist in ${baseTitle}.`,
      archetypes: ['Ruler', 'Shadow'],
    },
    {
      id: 'c4',
      name: 'Key Ally / Companion',
      role: 'Supporting',
      arcType: 'Disillusion Arc',
      personality: `Essential specialist and emotional confidant who brings critical skills to the ensemble.`,
      archetypes: ['Explorer', 'Jester'],
    },
  ];
}

export function getProjectActs(projectName: string): ActItem {
  const pLower = (projectName || '').toLowerCase();

  if (pLower.includes('vicious')) {
    return {
      teaser: 'Midnight rain drenches a neon-lit alleyway. Detective Jax Rivera monitors a clandestine cartel exchange from inside an unmarked vehicle, his recording wire crackling with static.',
      act1: 'Jax discovers a corrupted precinct file showing evidence has been doctored. Captain Vance orders him off the case, but Jax secretly commits to following the money trail.',
      act2A: 'Jax goes undercover into the underworld network, dodging security sweeps while securing encrypted ledger keys alongside reporter Elena Ramos.',
      act2B: 'Hector Cruz ambushes Jax\'s safehouse. The wiretap is compromised, Jax\'s identity is burned, and Vance is placed under department investigation in a dark night crisis.',
      act3: 'Jax infiltrates the high-rise summit where Cruz is finalizing the municipal contract. In a tense confrontation, Jax broadcasts the authentic recordings to the city press.',
    };
  }

  if (pLower.includes('echoes') || pLower.includes('past')) {
    return {
      teaser: 'Sub-aquatic dawn over submerged towers. Ronald Cole steers his recovery drone through a sunken archival vault, optical laser cutting open an airlocked data cylinder.',
      act1: 'Ronald reconstructs a damaged neural memory slate, discovering an unredacted pre-flood recording from Dr. Thorne detailing suppressed warning models.',
      act2A: 'Ronald teams with deep-submersible pilot Kira to explore the restricted Central Basin, recovering physical film reels that prove the submersion was calculated.',
      act2B: 'Reconstruction Bureau enforcers raid the floating lab. Kira\'s sub is captured, and Ronald must choose between destroying the evidence or drowning in the rising surge.',
      act3: 'Ronald transmits the uncorrupted holographic timeline across the city\'s oceanic broadcasts, sparking a public awakening as dawn breaks over the waters.',
    };
  }

  if (pLower.includes('shadow') || pLower.includes('protocol')) {
    return {
      teaser: 'A strobe-lit server farm in Geneva. Agent Maya Lin downloads an encrypted quantum key seconds before automated lockdown sentries open fire.',
      act1: 'Maya is disavowed by her agency and framed for treason. She contacts Patel, a rogue cryptography specialist, to decrypt the master surveillance ledger.',
      act2A: 'Maya and Patel track Cipher to an offshore data haven, executing high-speed tactical evasions through narrow European streets.',
      act2B: 'Cipher retaliates with an AI-generated deepfake smear campaign that paralyzes Maya\'s operational allies and traps her in an airport transit zone.',
      act3: 'Maya executes a high-altitude HALO jump onto Cipher\'s airborne command jet, overriding the global surveillance uplink and restoring digital truth.',
    };
  }

  if (pLower.includes('fatherless')) {
    return {
      teaser: 'A quiet autumn dawn over a weathered front porch. Devon (19) stares at a faded photograph of her father, holding her breath as the neighborhood awakens in golden 3200K mist.',
      act1: 'Devon unearths a wooden chest in the foundry attic containing vintage 16mm reels and structural blueprints. Vale Holdings serves a 30-day condemnation notice.',
      act2A: 'Devon records oral histories of community elders, discovering her father placed a permanent preservation covenant on the land before disappearing.',
      act2B: 'A flash storm and sabotage threaten the archival reels. Cassie reveals Vale has bribed the zoning board, triggering an emotional crisis of faith.',
      act3: 'Marcus presents Devon with her father\'s restored master lens. Devon rallies the community in the preserved hall, winning the legal injunction at dawn.',
    };
  }

  // Bespoke Acts for custom production
  return {
    teaser: `The opening prologue for "${projectName}" establishes the status quo and introduces the catalyst that shatters the ordinary world.`,
    act1: `The protagonist in "${projectName}" confronts the initial threshold, refusing the call until a definitive inciting incident forces commitment.`,
    act2A: `Exploration of the expanded world in "${projectName}", as rising action and early victories introduce key allies and escalate the stakes.`,
    act2B: `The high-stakes midpoint shift and all-is-lost reversal, testing the protagonist's core vulnerabilities and deepest doubts in "${projectName}".`,
    act3: `The climactic showdown and transformed resolution of "${projectName}", demonstrating permanent character growth and story closure.`,
  };
}

export function getProjectBeats(projectName: string): BeatCard[] {
  const pLower = (projectName || '').toLowerCase();

  if (pLower.includes('vicious')) {
    return [
      { id: 'b1', act: 'Act 1', title: '1. Opening Image', description: 'Rain-swept neon streets; Jax sits in an unmarked car listening to static on a wire.' },
      { id: 'b2', act: 'Act 1', title: '2. Theme Stated', description: 'Vance tells Jax that crossing the line makes you no better than what you hunt.' },
      { id: 'b3', act: 'Act 1', title: '3. Set-Up & Catalyst', description: 'A key informant is executed before handing over the master ledger.' },
      { id: 'b4', act: 'Act 1', title: '4. Debate & Threshold', description: 'Jax ignores suspension orders and takes his badge off to pursue the lead alone.' },
      { id: 'b5', act: 'Act 2A', title: '5. Break into Two', description: 'Jax enters the underground gambling den to make contact with Elena Ramos.' },
      { id: 'b6', act: 'Act 2A', title: '6. B Story & Subplot', description: 'Elena and Jax establish an uneasy pact based on shared trauma.' },
      { id: 'b7', act: 'Act 2B', title: '7. Midpoint Reversal', description: 'Cruz recognizes Jax and reveals the police department itself funded the cartel.' },
      { id: 'b8', act: 'Act 2B', title: '8. All Is Lost Moment', description: 'Safehouse raided, Elena captured, and Jax left bleeding in an industrial alley.' },
      { id: 'b9', act: 'Act 3', title: '9. Climax & Showdown', description: 'Jax breaches the penthouse gala to broadcast the ledger directly to media.' },
      { id: 'b10', act: 'Act 3', title: '10. Final Image', description: 'Dawn over the skyline as sirens arrive, Jax standing in the light with clean conscience.' },
    ];
  }

  if (pLower.includes('echoes') || pLower.includes('past')) {
    return [
      { id: 'b1', act: 'Act 1', title: '1. Opening Image', description: 'Ronald Cole piloting an underwater ROV through flooded skyscrapers.' },
      { id: 'b2', act: 'Act 1', title: '2. Theme Stated', description: 'Dr. Thorne whispers that a civilization without memory is doomed to drown twice.' },
      { id: 'b3', act: 'Act 1', title: '3. Set-Up & Catalyst', description: 'An uncorrupted quantum crystal is extracted from the lowest vault level.' },
      { id: 'b4', act: 'Act 1', title: '4. Debate & Threshold', description: 'Ronald hesitates to decode the crystal, knowing unauthorized decryption carries exile.' },
      { id: 'b5', act: 'Act 2A', title: '5. Break into Two', description: 'Ronald recruits Kira for deep-water transport to the oceanic relay array.' },
      { id: 'b6', act: 'Act 2A', title: '6. B Story & Subplot', description: 'Kira shows Ronald the bioluminescent life reclaiming the submerged city.' },
      { id: 'b7', act: 'Act 2B', title: '7. Midpoint Reversal', description: 'The crystal projection reveals the flood barrier was deliberately deactivated.' },
      { id: 'b8', act: 'Act 2B', title: '8. All Is Lost Moment', description: 'Bureau enforcers torpedo the underwater habitat, destroying the primary lab.' },
      { id: 'b9', act: 'Act 3', title: '9. Climax & Showdown', description: 'Ronald manually patches into the beacon tower to project the memories into the sky.' },
      { id: 'b10', act: 'Act 3', title: '10. Final Image', description: 'Golden sun reflecting on calm open water as holographic history illuminates the ocean.' },
    ];
  }

  if (pLower.includes('shadow') || pLower.includes('protocol')) {
    return [
      { id: 'b1', act: 'Act 1', title: '1. Opening Image', description: 'Agent Maya Lin hanging suspended above a glass ceiling server facility.' },
      { id: 'b2', act: 'Act 1', title: '2. Theme Stated', description: 'Sterling tells Maya that the only true weapon left is absolute transparency.' },
      { id: 'b3', act: 'Act 1', title: '3. Set-Up & Catalyst', description: 'The master key begins self-erasing unless connected to an external nodal network.' },
      { id: 'b4', act: 'Act 1', title: '4. Debate & Threshold', description: 'Maya cuts her subcutaneous tracker and goes fully dark.' },
      { id: 'b5', act: 'Act 2A', title: '5. Break into Two', description: 'Maya connects with Patel in a subterranean cyber café in Berlin.' },
      { id: 'b6', act: 'Act 2A', title: '6. B Story & Subplot', description: 'Patel reveals why Cipher turned rogue after the blacksite experiments.' },
      { id: 'b7', act: 'Act 2B', title: '7. Midpoint Reversal', description: 'Cipher hacks the city power grid, plunging three districts into darkness.' },
      { id: 'b8', act: 'Act 2B', title: '8. All Is Lost Moment', description: 'Patel\'s terminal is burned, and Maya\'s location is triangulated by drones.' },
      { id: 'b9', act: 'Act 3', title: '9. Climax & Showdown', description: 'High-altitude interception of Cipher\'s command jet over the Alps.' },
      { id: 'b10', act: 'Act 3', title: '10. Final Image', description: 'Maya walks into a bustling crowd without surveillance tags, truly free.' },
    ];
  }

  if (pLower.includes('fatherless')) {
    return [
      { id: 'b1', act: 'Act 1', title: '1. Opening Image', description: 'Devon (19) stands on the porch holding the weathered photograph in morning fog.' },
      { id: 'b2', act: 'Act 1', title: '2. Theme Stated', description: 'Marcus tells Devon that branches find their own light when roots run deep.' },
      { id: 'b3', act: 'Act 1', title: '3. Set-Up & Catalyst', description: 'Devon discovers her father\'s vintage 16mm camera in the foundry attic.' },
      { id: 'b4', act: 'Act 1', title: '4. Debate & Threshold', description: 'Devon wrestles with whether uncovering the past will bring peace or pain.' },
      { id: 'b5', act: 'Act 2A', title: '5. Break into Two', description: 'Devon begins filming community elders and recording oral histories.' },
      { id: 'b6', act: 'Act 2A', title: '6. B Story & Mentor', description: 'Marcus teaches Devon camera operation and woodworking restoration.' },
      { id: 'b7', act: 'Act 2B', title: '7. Midpoint Reversal', description: 'Devon discovers her father designed the neighborhood community hall.' },
      { id: 'b8', act: 'Act 2B', title: '8. All Is Lost Moment', description: 'A torrential storm leaks onto the workshop, threatening the film reels.' },
      { id: 'b9', act: 'Act 3', title: '9. Climax & Premiere', description: 'The community packs the hall for the premiere; Devon shares her truth.' },
      { id: 'b10', act: 'Act 3', title: '10. Final Image', description: 'Devon stands on the porch, looking forward at the waking city skyline.' },
    ];
  }

  // Bespoke dynamic 10-beat sequence for any custom title
  const base = projectName || 'Story';
  return [
    { id: 'b1', act: 'Act 1', title: '1. Opening Image', description: `A visual snapshot of ${base} that establishes the tone and protagonist's ordinary world.` },
    { id: 'b2', act: 'Act 1', title: '2. Theme Stated', description: `An early dialogue or event that poses the central question of ${base}.` },
    { id: 'b3', act: 'Act 1', title: '3. Set-Up & Catalyst', description: `The inciting incident that disrupts the status quo in ${base}.` },
    { id: 'b4', act: 'Act 1', title: '4. Debate & Threshold', description: `The protagonist grapples with the stakes before making an irreversible choice.` },
    { id: 'b5', act: 'Act 2A', title: '5. Break into Two', description: `Entering the unfamiliar world with new rules and challenges in ${base}.` },
    { id: 'b6', act: 'Act 2A', title: '6. B Story & Allies', description: `Introduction of key relationships that support the emotional core of ${base}.` },
    { id: 'b7', act: 'Act 2B', title: '7. Midpoint Reversal', description: `The stakes double as false victory or major revelation flips the narrative.` },
    { id: 'b8', act: 'Act 2B', title: '8. All Is Lost Crisis', description: `The lowest point where external defeat forces internal reckoning in ${base}.` },
    { id: 'b9', act: 'Act 3', title: '9. Climax & Test', description: `The ultimate confrontation where new lessons are synthesized to overcome the odds.` },
    { id: 'b10', act: 'Act 3', title: '10. Transformed Image', description: `The closing mirror image showing the permanent transformation wrought by ${base}.` },
  ];
}

export function generateDynamicScript(projectName: string, shotNumber: number, shotTitle?: string): string {
  const pLower = (projectName || '').toLowerCase();

  if (pLower.includes('vicious')) {
    return `EXT. RAIN-SLICKED DOWNTOWN ALLEYWAY - NIGHT

Neon reflections shimmer across wet asphalt. Heavy rain drums against the hood of an unmarked sedan.

DETECTIVE JAX RIVERA (30s, leather jacket soaked, eyes fixed on the warehouse across the street) holds a miniature receiver to his ear. Static hums.

JAX
(into radio, low murmur)
"Target vehicle is in position. Two armed spotters on the catwalk."

CAPTAIN VANCE (over radio, filtered)
"Hold your position, Jax. Tactical backup is still five minutes out."

JAX
"Five minutes and they vanish with the ledger. I\'m moving in."

Jax clicks off the radio, racks the slide of his sidearm, and steps into the torrential rain.

CUT TO:

INT. WAREHOUSE LOADING DOCK - CONTINUOUS

Stacked shipping crates tower into the shadows.`;
  }

  if (pLower.includes('echoes') || pLower.includes('past')) {
    return `INT. SUBMERGED ARCHIVAL VAULT - DEEP WATER (DAWN)

Murky blue light refracts through reinforced acrylic observation ports. Schools of bioluminescent fish dart past sunken mainframe columns.

RONALD COLE (20s, in thermal wetsuit with holographic scanner visor) guides a fiber-optic probe into an airlocked data cylinder.

RONALD
(to himself, voice echoing inside the dry chamber)
"Seventy years under seventy fathoms of water. Let\'s see what you were hiding."

The laser sparks. An ethereal blue holographic timeline flickers to life in the water-mist.

DR. THORNE\'S HOLOGRAM (from the past, urgent)
"If you are watching this, the breach was not an accident. They knew the sea was coming."

Ronald freezes, his heart pounding in the deep silence.

CUT TO:`;
  }

  if (pLower.includes('shadow') || pLower.includes('protocol')) {
    return `INT. QUANTUM SERVER MATRIX - NIGHT (0300 HOURS)

Blue lasers sweep across rows of liquid-nitrogen cooled server cabinets. Total silence except for the low hum of quantum processing units.

AGENT MAYA LIN (20s, dressed in carbon-fiber tactical stealth gear) hangs suspended by a magnetic rappel cable two inches above the optical pressure floor.

MAYA
(whispering into throat-mic)
"I\'m at the master node. Deploying the override patch now."

PATEL (over encrypted earpiece)
"Be careful, Maya. If the watchdog AI detects the signature, you have eight seconds before the automated sentries lock down the sector."

Maya inserts the encrypted data drive. A progress bar ticks rapidly: 42%... 78%... 100%.

RED EMERGENCY LIGHTS STROBE SUDDENLY.

CUT TO:`;
  }

  if (pLower.includes('armor')) {
    return `EXT. URBAN FOUNDRY PORCH - MORNING (EPISODE 1)

Sunlight cuts through amber industrial haze. DEVON (19, resolute, wearing work boots and a weathered coat) tightens his toolbelt.

MARCUS (40s, foundry mentor, holding a worn Bible opened to Ephesians 6)
(calm, commanding authority)
"Finally, my brethren, be strong in the Lord, and in the power of his might. Put on the whole armor of God, that ye may be able to stand against the wiles of the devil."

DEVON
(looking out across the city skyline)
"They tore down my father's shop. They think without a foundation, we fall."

MARCUS
(placing a steady hand on Devon's shoulder)
"For we wrestle not against flesh and blood, Devon, but against principalities, against powers, against the rulers of the darkness of this world. Stand therefore, having your loins girt about with truth."

DEVON
"And the breastplate of righteousness."

DEVON takes a deep breath, grips his scriptural notebook, and steps into the city.

CUT TO:`;
  }

  if (pLower.includes('joseph')) {
    return `EXT. CANAANITE WILDERNESS - DAY

Golden desert heat shimmers across the plains. JOSEPH (17, dressed in a tunic of many vibrant colors) stands beside his father ISRAEL.

ISRAEL
"Thy brethren feed the flock in Shechem: come, and I will send thee unto them."

JOSEPH
"Here am I, my father."

JOSEPH journeys across the rugged valley toward the hills of Dothan. In the distance, his brothers watch his approach, their faces darkened with envy.

JUDAH
(watching the silhouette on the horizon)
"Behold, this dreamer cometh."

JOSEPH approaches with open arms, unaware of the pit awaiting him.

CUT TO:`;
  }

  if (pLower.includes('sabbath') || pLower.includes('uncut')) {
    return `INT. TACF BIBLE STUDY HALL - EVENING

A large oak conference table covered with Hebrew and Greek lexicons, ancient maps of the Levant, and canonical scripture scrolls.

THE TEACHER (authoritative, pointing to Isaiah 28:10 on the board)
"For precept must be upon precept, precept upon precept; line upon line, line upon line; here a little, and there a little."

STUDENTS take notes as historical manuscripts illuminate on the holographic projection wall.

THE TEACHER
"We do not teach the traditions of men. We open the sacred records from Genesis to Revelation, letting the Word interpret the Word."

A spotlight illuminates the ancient Torah parchment.

CUT TO:`;
  }

  // Bespoke dynamic script for any custom project
  const title = projectName || 'Studio Production';
  return `EXT. ${title.toUpperCase()} - SCENE ${shotNumber} - DAY

The environment awakens with cinematic atmosphere and crisp morning light.

PROTAGONIST (determined, looking forward)
"We've reached the point of no return with ${title}. Everything we've prepared for happens today."

COMPANION (checking equipment)
"Then we do this together. No looking back."

A subtle sonic cue swells as they step toward their objective.

CUT TO:

INT. ${title.toUpperCase()} MAIN WORKSPACE - CONTINUOUS`;
}
