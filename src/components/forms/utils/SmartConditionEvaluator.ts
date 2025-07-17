
import { SmartCondition } from '../types';

export class SmartConditionEvaluator {
  static evaluate(conditions: SmartCondition[], formValues: Record<string, any>): boolean {
    // All conditions must be true (AND logic)
    return conditions.every(condition => {
      const fieldValue = formValues[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'contains':
          return typeof fieldValue === 'string' && fieldValue.includes(condition.value);
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        case 'truthy':
          return Boolean(fieldValue);
        case 'falsy':
          return !Boolean(fieldValue);
        default:
          return true;
      }
    });
  }
}
