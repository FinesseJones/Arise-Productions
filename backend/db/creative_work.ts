// Database schema for tracking creative work ownership and copyright

export interface CreativeWork {
  id: string;
  type: 'script' | 'storyboard' | 'shot_list' | 'casting_profile' | 'treatment' | 'screenplay';
  content: string;

  // Copyright info
  author: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  copyrightYear: number;

  // Proof of creation (immutable)
  originalHash: string; // SHA-256 hash of content
  contentHash: string; // Current hash (changes with edits)
  ipAddress: string;
  userAgent: string;

  // Ownership
  studioId: string;
  projectId: string;
  clientId?: string;

  // License
  license: 'all-rights-reserved' | 'work-for-hire' | 'shared' | 'client-owned';
  licenseTerms?: string;

  // Collaboration
  collaborators: Array<{
    userId: string;
    email: string;
    role: 'writer' | 'editor' | 'reviewer' | 'director';
    contribution: string;
    addedAt: Date;
  }>;

  // Version control
  version: number;
  previousVersionId?: string;

  // Metadata
  title?: string;
  description?: string;
  tags: string[];

  // Legal
  termsAccepted: boolean;
  termsVersion: string;
  ndaSigned: boolean;
}

export interface CopyrightProof {
  id: string;
  creativeWorkId: string;
  contentHash: string;
  author: string;
  authorEmail: string;
  timestamp: number;
  proof: string;

  // Blockchain-like chain
  previousProofHash?: string;
  blockHash: string; // Hash of entire proof record

  // Verification
  emailSent: boolean;
  emailSentAt?: Date;
  verified: boolean;

  // Metadata
  ipAddress: string;
  userAgent: string;
  platform: string;
}

export interface TermsAcceptance {
  id: string;
  userId: string;
  userEmail: string;
  termsVersion: string;
  acceptedAt: Date;
  ipAddress: string;
  userAgent: string;

  // Signature simulation
  signatureData: string; // User's typed name or digital signature
}

export interface NDAAcceptance {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  ndaVersion: string;
  signedAt: Date;
  ipAddress: string;
  userAgent: string;

  // Digital signature
  signature: string;
  witnessEmail?: string;

  // Status
  active: boolean;
  revokedAt?: Date;
  revokedReason?: string;
}
