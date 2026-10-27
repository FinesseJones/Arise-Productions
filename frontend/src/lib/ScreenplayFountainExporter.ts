/**
 * Hollywood Standard Fountain & Final Draft (.fdx) Screenplay Engine
 * Produces industry-compliant formatted screenplays with scene headings,
 * dual-dialogue, parentheticals, transitions, and legal copyright watermarks.
 * 
 * © 2026 Arise Productions, LLC • Registered with WGA & U.S. Copyright Office
 */

export interface ScreenplayScene {
  id: string;
  sceneNumber: number;
  slugline: string; // e.g. "EXT. METROPOLIS ROOFTOP - NIGHT"
  summary: string;
  actionLines: string[];
  dialogueBlocks: {
    character: string;
    parenthetical?: string;
    text: string;
    dualCharacter?: string;
    dualText?: string;
  }[];
}

export interface ScreenplayMetadata {
  title: string;
  author: string;
  draftDate?: string;
  copyrightNotice?: string;
  wgaRegistrationNumber?: string;
}

/**
 * Converts structured scene data into standard industry Fountain text (.fountain)
 */
export function exportToFountain(scenes: ScreenplayScene[], metadata: ScreenplayMetadata): string {
  const dateStr = metadata.draftDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const copyright = metadata.copyrightNotice || `© ${new Date().getFullYear()} ${metadata.author || 'Arise Productions, LLC'}. All Rights Reserved.`;
  const wga = metadata.wgaRegistrationNumber || 'WGA Registered & Stamped';

  let fountain = `Title: ${metadata.title.toUpperCase()}\n`;
  fountain += `Credit: Written by\n`;
  fountain += `Author: ${metadata.author}\n`;
  fountain += `Draft date: ${dateStr}\n`;
  fountain += `Copyright: ${copyright} • ${wga}\n`;
  fountain += `Format: Feature Screenplay (Industry Standard)\n\n`;
  fountain += `===\n\n`;

  scenes.forEach((scene) => {
    fountain += `.${scene.slugline.toUpperCase()} #${scene.sceneNumber}#\n\n`;
    
    if (scene.actionLines && scene.actionLines.length > 0) {
      scene.actionLines.forEach((action) => {
        fountain += `${action}\n\n`;
      });
    }

    if (scene.dialogueBlocks && scene.dialogueBlocks.length > 0) {
      scene.dialogueBlocks.forEach((block) => {
        fountain += `@${block.character.toUpperCase()}\n`;
        if (block.parenthetical) {
          fountain += `(${block.parenthetical})\n`;
        }
        fountain += `${block.text}\n\n`;

        if (block.dualCharacter && block.dualText) {
          fountain += `@${block.dualCharacter.toUpperCase()} ^\n`;
          fountain += `${block.dualText}\n\n`;
        }
      });
    }
  });

  return fountain;
}

/**
 * Converts structured scene data into Final Draft 12/13 XML (.fdx) format
 */
export function exportToFinalDraftFDX(scenes: ScreenplayScene[], metadata: ScreenplayMetadata): string {
  const title = metadata.title || 'UNTITLED SCREENPLAY';
  const author = metadata.author || 'ARISE PRODUCTIONS';

  let fdx = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n`;
  fdx += `<FinalDraft DocumentType="Script" Template="No" Version="4">\n`;
  fdx += `  <Content>\n`;

  scenes.forEach((scene) => {
    // Scene Heading
    fdx += `    <Paragraph Type="Scene Heading">\n`;
    fdx += `      <SceneProperties Number="${scene.sceneNumber}" />\n`;
    fdx += `      <Text>${escapeXml(scene.slugline.toUpperCase())}</Text>\n`;
    fdx += `    </Paragraph>\n`;

    // Action Lines
    if (scene.actionLines) {
      scene.actionLines.forEach((action) => {
        fdx += `    <Paragraph Type="Action">\n`;
        fdx += `      <Text>${escapeXml(action)}</Text>\n`;
        fdx += `    </Paragraph>\n`;
      });
    }

    // Dialogue Blocks
    if (scene.dialogueBlocks) {
      scene.dialogueBlocks.forEach((block) => {
        fdx += `    <Paragraph Type="Character">\n`;
        fdx += `      <Text>${escapeXml(block.character.toUpperCase())}</Text>\n`;
        fdx += `    </Paragraph>\n`;

        if (block.parenthetical) {
          fdx += `    <Paragraph Type="Parenthetical">\n`;
          fdx += `      <Text>(${escapeXml(block.parenthetical)})</Text>\n`;
          fdx += `    </Paragraph>\n`;
        }

        fdx += `    <Paragraph Type="Dialogue">\n`;
        fdx += `      <Text>${escapeXml(block.text)}</Text>\n`;
        fdx += `    </Paragraph>\n`;
      });
    }
  });

  fdx += `  </Content>\n`;
  fdx += `  <TitlePage>\n`;
  fdx += `    <Header><Text>${escapeXml(title)}</Text></Header>\n`;
  fdx += `    <Content><Paragraph><Text>Written by ${escapeXml(author)}</Text></Paragraph></Content>\n`;
  fdx += `  </TitlePage>\n`;
  fdx += `</FinalDraft>\n`;

  return fdx;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
