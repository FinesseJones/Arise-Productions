export const LEGAL_INFO = {
  company: {
    legal_name: "The AI Content Foundry LLC",
    dba: "Finesse Jones",
    business_id: "1477089",
    state: "Mississippi",
    address: "196 W College St, Hickory, MS 39332",
    established: "February 18, 2025",
  },

  product: {
    name: "TACF Hybrid 3D Studio",
    name_with_tm: "TACF Hybrid 3D Studio™",
    full_name: "TACF Hybrid 3D Studio - AI-Powered Film Production Platform",
    tagline: "Vision-Driven | Creator-Led | Built To Empower Bold",
    version: "1.0.0",
  },

  technology: {
    platform: "Finesse Jones Platform",
    credit: "Powered by Finesse Jones Technology",
    credit_full: "Built on the Finesse Jones Platform",
  },

  copyright: {
    owner: "The AI Content Foundry LLC",
    year: 2025,
    notice: "© 2025 The AI Content Foundry LLC. All rights reserved.",
    dba_notice: "Operating as Finesse Jones",
    trademark_notice: "TACF Hybrid 3D Studio™ is a trademark of The AI Content Foundry LLC",
    full_notice: "© 2025 The AI Content Foundry LLC. All rights reserved. TACF Hybrid 3D Studio™ is a trademark of The AI Content Foundry LLC. Built on Finesse Jones Technology.",
  },

  contact: {
    email: "finessejones@theaicontentfoundry.com",
    address: "196 W College St, Hickory, MS 39332",
    city: "Hickory",
    state: "Mississippi",
    zip: "39332",
    country: "USA",
  },

  taglines: {
    primary: "Vision-Driven | Creator-Led | Built To Empower Bold",
    secondary: "AI-Powered Film Production Platform",
    mission: "Empowering bold creators with cutting-edge AI technology",
  },

  terms: {
    version: "1.0.0",
    last_updated: "2025-02-18",
  },
};

export const TERMS_OF_SERVICE = `
TACF HYBRID 3D STUDIO™
TERMS OF SERVICE

Product: ${LEGAL_INFO.product.name_with_tm}
${LEGAL_INFO.technology.credit_full}

Legal Entity: The AI Content Foundry LLC
Business ID: 1477089
Location: 196 W College St, Hickory, MS 39332
Last Updated: ${LEGAL_INFO.terms.last_updated}

1. COPYRIGHT OWNERSHIP
   - All work created in this studio is automatically copyrighted
   - Individual creators retain copyright to their contributions
   - Studio retains license to use work within projects
   - Each work receives timestamped proof of creation

2. WORK-FOR-HIRE (if applicable)
   - Work created for studio projects may be work-for-hire
   - Copyright ownership defined by project agreements
   - Client agreements override default terms where applicable

3. ATTRIBUTION
   - All creators receive automatic attribution
   - Credits tracked in database and exports
   - Attribution included in all exported content

4. LICENSE GRANTS
   - Creators grant studio non-exclusive license to:
     * Use work in productions
     * Display in portfolios
     * Share with clients (with attribution)
   - Creators retain all other rights
   - Sublicensing requires explicit permission

5. PROTECTION & SECURITY
   - Studio implements industry-standard security measures
   - SHA-256 hashing for proof of creation
   - Timestamped records for all creative works
   - Users responsible for backing up work
   - Copyright violations reported immediately

6. INTELLECTUAL PROPERTY
   - Finesse Jones™ is a trademark of The AI Content Foundry LLC
   - Platform technology is proprietary
   - Reverse engineering prohibited
   - Trade secrets must be kept confidential

7. DATA & PRIVACY
   - Creation metadata stored for copyright protection
   - IP addresses logged for security
   - User data handled per Privacy Policy
   - Ownership records maintained indefinitely

8. TERMINATION
   - Users may export their work at any time
   - Account termination does not affect copyright ownership
   - Studio retains copies for legal compliance

9. GOVERNING LAW
   - Governed by laws of Mississippi, USA
   - Disputes resolved in Newton County, Mississippi

10. CONTACT
    Email: ${LEGAL_INFO.contact.email}
    Address: ${LEGAL_INFO.contact.address}

By using this platform, you agree to these terms.

${LEGAL_INFO.copyright.full_notice}
`;

export const NDA_TEMPLATE = `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of [DATE]
between The AI Content Foundry LLC ("Company") and [USER NAME] ("Recipient").

WHEREAS, Recipient will have access to proprietary technology, algorithms,
and trade secrets of the Finesse Jones™ Production Studio platform.

Recipient agrees to:

1. CONFIDENTIALITY
   - Keep all studio technology confidential
   - Protect proprietary algorithms and AI processes
   - Not disclose platform architecture or implementation details
   - Maintain confidentiality of client projects and data

2. RESTRICTIONS
   - Not reverse engineer the platform
   - Not share trade secrets with competitors
   - Not use confidential information for personal gain
   - Not create competing products using Company knowledge

3. TERM
   - This agreement remains in effect for 5 years from signing
   - Confidentiality obligations survive agreement termination

4. REMEDIES
   Violation may result in:
   - Immediate account termination
   - Legal action for injunctive relief
   - Damages and attorney's fees
   - Criminal prosecution where applicable

5. GOVERNING LAW
   - Governed by laws of Mississippi, USA
   - Venue: Newton County, Mississippi

Recipient Signature: ___________________________
Recipient Name: _______________________________
Date: _________________________________________

Company: The AI Content Foundry LLC
Representative: _______________________________
Date: _________________________________________

${LEGAL_INFO.copyright.notice}
`;
