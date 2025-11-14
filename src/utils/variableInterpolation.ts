export const interpolateVariables = (
  text: string,
  variables: Record<string, any>
): string => {
  console.log('[Interpolation] Input text:', text);
  console.log('[Interpolation] Available variables:', variables);
  
  const result = text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
    const trimmedName = varName.trim();
    console.log('[Interpolation] Looking for variable:', trimmedName);
    console.log('[Interpolation] Found value:', variables[trimmedName]);
    
    if (variables[trimmedName] !== undefined) {
      return String(variables[trimmedName]);
    }
    
    console.log('[Interpolation] Variable not found, keeping original:', match);
    return match;
  });
  
  console.log('[Interpolation] Result:', result);
  return result;
};
