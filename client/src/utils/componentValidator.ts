import { useState, useEffect } from 'react';

interface ComponentHealth {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  issues: string[];
  lastChecked: number;
}

class ComponentValidator {
  private static instance: ComponentValidator;
  private healthChecks: ComponentHealth[] = [];

  static getInstance(): ComponentValidator {
    if (!ComponentValidator.instance) {
      ComponentValidator.instance = new ComponentValidator();
    }
    return ComponentValidator.instance;
  }

  // Validate React component props and state
  validateComponent(
    componentName: string,
    props: Record<string, any>,
    requiredProps: string[]
  ): ComponentHealth {
    const issues: string[] = [];

    // Check required props
    requiredProps.forEach(prop => {
      if (!(prop in props) || props[prop] === undefined || props[prop] === null) {
        issues.push(`Missing required prop: ${prop}`);
      }
    });

    // Check for common anti-patterns
    if (props.children && typeof props.children === 'string' && props.children.length > 1000) {
      issues.push('Large text content may cause performance issues');
    }

    // Check for accessibility issues
    if (props.onClick && !props.onKeyDown) {
      issues.push('Interactive element missing keyboard handler');
    }

    const status = issues.length === 0 ? 'healthy' : 
                   issues.length <= 2 ? 'warning' : 'error';

    const health: ComponentHealth = {
      name: componentName,
      status,
      issues,
      lastChecked: Date.now()
    };

    this.updateHealthCheck(health);
    return health;
  }

  // Validate API responses
  validateApiResponse(endpoint: string, response: any, expectedFields: string[]): boolean {
    try {
      if (!response) {
        console.error(`❌ Empty response from ${endpoint}`);
        return false;
      }

      const missingFields = expectedFields.filter(field => !(field in response));
      if (missingFields.length > 0) {
        console.error(`❌ Missing fields in ${endpoint} response:`, missingFields);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`❌ Error validating API response from ${endpoint}:`, error);
      return false;
    }
  }

  // Check for memory leaks in components
  checkMemoryLeaks(componentName: string): void {
    if ('performance' in window && 'memory' in (performance as any)) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB

      if (memoryUsage > 100) {
        console.warn(`⚠️ High memory usage detected in ${componentName}: ${memoryUsage.toFixed(2)}MB`);
      }
    }
  }

  // Validate form data
  validateFormData(formData: Record<string, any>, validationRules: Record<string, any>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    Object.entries(validationRules).forEach(([field, rules]) => {
      const value = formData[field];
      
      if (rules.required && (!value || value === '')) {
        errors[field] = `${field} is required`;
      }
      
      if (rules.minLength && value && value.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
      }
      
      if (rules.maxLength && value && value.length > rules.maxLength) {
        errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
      }
      
      if (rules.pattern && value && !rules.pattern.test(value)) {
        errors[field] = `${field} format is invalid`;
      }
      
      if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field] = `${field} must be a valid email address`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  private updateHealthCheck(health: ComponentHealth): void {
    const existingIndex = this.healthChecks.findIndex(check => check.name === health.name);
    
    if (existingIndex >= 0) {
      this.healthChecks[existingIndex] = health;
    } else {
      this.healthChecks.push(health);
    }
  }

  // Get overall system health
  getSystemHealth(): {
    overall: 'healthy' | 'warning' | 'error';
    components: ComponentHealth[];
    summary: Record<string, number>;
  } {
    const summary = this.healthChecks.reduce(
      (acc, check) => {
        acc[check.status] = (acc[check.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const overall = summary.error > 0 ? 'error' :
                   summary.warning > 0 ? 'warning' : 'healthy';

    return {
      overall,
      components: this.healthChecks,
      summary
    };
  }

  // Clear old health checks
  cleanup(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.healthChecks = this.healthChecks.filter(check => check.lastChecked > oneHourAgo);
  }
}

export const componentValidator = ComponentValidator.getInstance();

// React hook for component validation
export const useComponentValidation = (
  componentName: string,
  props: Record<string, any>,
  requiredProps: string[]
) => {
  const [health, setHealth] = useState<ComponentHealth | null>(null);

  useEffect(() => {
    const validationResult = componentValidator.validateComponent(
      componentName,
      props,
      requiredProps
    );
    setHealth(validationResult);
  }, [componentName, props, requiredProps]);

  return health;
};