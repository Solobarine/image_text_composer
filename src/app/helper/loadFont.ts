const loadGoogleFont = async (font: string) => {
  const linkId = `gf-${font.replace(/\s+/g, "-")}`;
  
  if (document.getElementById(linkId)) {
    // Font link exists, but ensure it's actually loaded
    return await waitForFont(font);
  }
  
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, "+")}&display=swap`;
  
  // Wait for the stylesheet to load first
  await new Promise<void>((resolve, reject) => {
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load font: ${font}`));
    document.head.appendChild(link);
  });
  
  // Now wait for the actual font to be ready
  return await waitForFont(font);
};

const waitForFont = async (font: string) => {
  const maxAttempts = 20; // 2 seconds max wait
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await document.fonts.load(`16px "${font}"`);
      
      // Verify font is actually available
      const fontFaces = Array.from(document.fonts.values());
      const fontExists = fontFaces.some(fontFace => 
        fontFace.family.includes(font) && fontFace.status === 'loaded'
      );
      
      if (fontExists) {
        return;
      }
    } catch (error) {
      // Continue to next attempt
    }
    
    // Wait 100ms before next attempt
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error(`Font ${font} failed to load after ${maxAttempts} attempts`);
};

export default loadGoogleFont;
