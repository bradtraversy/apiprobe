export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
}

export function substituteVariables(
  text: string,
  variables: Record<string, string>
): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Replace {{variable}} syntax with variable values
  return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim();
    return variables[trimmedName] || match; // Return original if variable not found
  });
}

export function substituteVariablesInObject(
  obj: Record<string, string>,
  variables: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    result[key] = substituteVariables(value, variables);
  }
  
  return result;
}

export function getVariableNames(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) {
    return [];
  }

  return matches.map(match => match.slice(2, -2).trim());
}

export function validateVariables(
  text: string,
  variables: Record<string, string>
): { isValid: boolean; missing: string[] } {
  const requiredVariables = getVariableNames(text);
  const missing = requiredVariables.filter(
    varName => !variables.hasOwnProperty(varName)
  );

  return {
    isValid: missing.length === 0,
    missing,
  };
} 