export interface Template {
  id: string;
  name: string;
  icon: string;
  category: 'animals' | 'plants' | 'objects' | 'nature' | 'food' | 'vehicles' | 'people' | 'fantasy';
  paths: string[];
}

// Import extended templates with 100 items
import { EXTENDED_TEMPLATES } from './templates-extended';

// Export the extended templates as the main TEMPLATES constant
export const TEMPLATES: Record<string, Template> = EXTENDED_TEMPLATES;