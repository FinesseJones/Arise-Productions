// Copyright and attribution utilities

const LEGAL_INFO = {
  company: {
    legal_name: "The AI Content Foundry LLC",
    dba: "Finesse Jones",
  },
  product: {
    name_with_tm: "Finesse Jones™ Production Studio",
  },
  copyright: {
    owner: "The AI Content Foundry LLC",
    full_notice: "© 2025 The AI Content Foundry LLC. All rights reserved. Finesse Jones™ Production Studio is a trademark of The AI Content Foundry LLC.",
  },
};

export interface CopyrightInfo {
  author: string;
  createdAt: Date;
  id: string | number;
}

export function addCopyrightNotice(content: string, info: CopyrightInfo): string {
  const notice = `
---
© ${new Date().getFullYear()} ${info.author}
Created: ${info.createdAt.toISOString()}
Studio ID: ${info.id}
Created using ${LEGAL_INFO.product.name_with_tm}
${LEGAL_INFO.copyright.full_notice}
All rights reserved. Unauthorized use prohibited.
`;

  return content + notice;
}

export function generateCopyrightMetadata(info: CopyrightInfo) {
  return {
    copyright: `© ${new Date().getFullYear()} ${info.author}. All rights reserved.`,
    creator: info.author,
    created: info.createdAt.toISOString(),
    studioId: info.id,
    notice: 'Created using Finesse Jones Production Studio. Unauthorized reproduction or distribution prohibited.'
  };
}

// For JSON exports
export function addCopyrightToJSON(data: any, info: CopyrightInfo): any {
  return {
    ...data,
    _copyright: generateCopyrightMetadata(info)
  };
}
