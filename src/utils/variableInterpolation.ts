export const interpolateVariables = (
  text: string,
  variables: Record<string, any>
): string => {
  return text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
    const trimmedName = varName.trim();
    return variables[trimmedName] !== undefined ? String(variables[trimmedName]) : match;
  });
};
