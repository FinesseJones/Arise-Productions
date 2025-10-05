// Copyright and attribution utilities

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
Created using Finesse Jones Production Studio
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
