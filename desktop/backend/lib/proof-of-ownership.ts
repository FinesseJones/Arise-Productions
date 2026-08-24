import crypto from 'crypto';
import { LEGAL_INFO } from '../../frontend/src/config/legal';

export interface ProofOfOwnership {
  content_hash: string;
  author: string;
  authorEmail: string;
  timestamp: number;
  proof: string;
  blockHash: string;
  previousProofHash?: string;
}

/**
 * Create blockchain-like proof of ownership for creative work
 * Uses SHA-256 hashing to create immutable timestamp proof
 */
export async function createProofOfOwnership(
  content: string,
  author: string,
  authorEmail: string,
  metadata: {
    workType: string;
    projectId: string;
    ipAddress: string;
    userAgent: string;
  }
): Promise<ProofOfOwnership> {
  const timestamp = Date.now();

  // Hash the content
  const contentHash = crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');

  // Create proof statement
  const proof = `This work was created by ${author} (${authorEmail}) on ${new Date(timestamp).toISOString()} using ${LEGAL_INFO.product.name_with_tm}. Content hash: ${contentHash}`;

  // Get previous proof hash for blockchain-like chain
  const previousProofHash = await getLatestProofHash(authorEmail);

  // Create block hash (hash of entire proof record)
  const blockData = JSON.stringify({
    contentHash,
    author,
    authorEmail,
    timestamp,
    proof,
    previousProofHash,
    metadata,
  });

  const blockHash = crypto
    .createHash('sha256')
    .update(blockData)
    .digest('hex');

  const proofRecord: ProofOfOwnership = {
    content_hash: contentHash,
    author,
    authorEmail,
    timestamp,
    proof,
    blockHash,
    previousProofHash,
  };

  // Save to database
  // await db.copyrightProof.create({ data: proofRecord });

  // Send proof email to author
  await sendProofEmail(proofRecord, metadata);

  return proofRecord;
}

/**
 * Verify proof of ownership
 */
export function verifyProof(
  content: string,
  proof: ProofOfOwnership
): boolean {
  // Recalculate content hash
  const contentHash = crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');

  // Verify hash matches
  if (contentHash !== proof.content_hash) {
    return false;
  }

  // Recalculate block hash
  const blockData = JSON.stringify({
    contentHash: proof.content_hash,
    author: proof.author,
    authorEmail: proof.authorEmail,
    timestamp: proof.timestamp,
    proof: proof.proof,
    previousProofHash: proof.previousProofHash,
  });

  const calculatedBlockHash = crypto
    .createHash('sha256')
    .update(blockData)
    .digest('hex');

  return calculatedBlockHash === proof.blockHash;
}

/**
 * Get latest proof hash for user (for blockchain chaining)
 */
async function getLatestProofHash(authorEmail: string): Promise<string | undefined> {
  // Query database for latest proof
  // const latestProof = await db.copyrightProof.findFirst({
  //   where: { authorEmail },
  //   orderBy: { timestamp: 'desc' },
  // });
  // return latestProof?.blockHash;
  return undefined;
}

/**
 * Send proof-of-creation email (immutable timestamp)
 */
async function sendProofEmail(
  proof: ProofOfOwnership,
  metadata: { workType: string; projectId: string }
): Promise<void> {
  const emailBody = `
COPYRIGHT PROOF - DO NOT DELETE
${LEGAL_INFO.product.name_with_tm}
${LEGAL_INFO.copyright.full_notice}

This email serves as immutable proof of creation for your work.

WORK DETAILS:
- Type: ${metadata.workType}
- Project ID: ${metadata.projectId}
- Created: ${new Date(proof.timestamp).toISOString()}
- Author: ${proof.author} (${proof.authorEmail})

CRYPTOGRAPHIC PROOF:
- Content Hash (SHA-256): ${proof.content_hash}
- Block Hash: ${proof.blockHash}
${proof.previousProofHash ? `- Previous Block: ${proof.previousProofHash}` : ''}

LEGAL STATEMENT:
${proof.proof}

PRESERVATION:
Keep this email indefinitely as proof of creation date and authorship.
This cryptographic proof can be verified at any time to establish:
1. You created this work
2. The exact date and time of creation
3. The work has not been altered (via content hash)

VERIFICATION:
To verify this proof, contact: ${LEGAL_INFO.contact.email}

QUESTIONS:
Contact: ${LEGAL_INFO.contact.email}
Address: ${LEGAL_INFO.contact.address}

${LEGAL_INFO.copyright.notice}
`;

  // TODO: Implement actual email sending
  // await emailService.send({
  //   to: proof.authorEmail,
  //   subject: `Copyright Proof - ${metadata.workType} - DO NOT DELETE`,
  //   body: emailBody,
  // });

  console.log('Proof email would be sent:', emailBody);
}

/**
 * Create content hash for tracking changes
 */
export function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Generate proof certificate for download
 */
export function generateProofCertificate(
  proof: ProofOfOwnership,
  workDetails: {
    title: string;
    type: string;
    projectId: string;
  }
): string {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         CERTIFICATE OF AUTHORSHIP & CREATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${LEGAL_INFO.product.name_with_tm}
Issued by: ${LEGAL_INFO.company.legal_name}
Certificate ID: ${proof.blockHash.substring(0, 16).toUpperCase()}

WORK INFORMATION:
Title: ${workDetails.title}
Type: ${workDetails.type}
Project ID: ${workDetails.projectId}

AUTHORSHIP:
Author: ${proof.author}
Email: ${proof.authorEmail}
Creation Date: ${new Date(proof.timestamp).toUTCString()}

CRYPTOGRAPHIC VERIFICATION:
Content Hash (SHA-256): ${proof.content_hash}
Block Hash: ${proof.blockHash}
${proof.previousProofHash ? `Chain Reference: ${proof.previousProofHash.substring(0, 16)}` : 'First Block'}

LEGAL STATEMENT:
${proof.proof}

This certificate serves as cryptographic proof of authorship and
creation date. The content hash can be used to verify the work
has not been altered from its original form.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${LEGAL_INFO.copyright.full_notice}
${LEGAL_INFO.contact.address}
${LEGAL_INFO.contact.email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated: ${new Date().toUTCString()}
`;
}
