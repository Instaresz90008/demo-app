#!/usr/bin/env node

/**
 * Ultra-simple contrast validator for our 2-theme system
 * Tests against WCAG AAA standards (7:1 ratio for normal text, 4.5:1 for large text)
 */

// Simple contrast calculation
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  
  let r: number, g: number, b: number;
  
  if (h < 1/6) [r, g, b] = [c, x, 0];
  else if (h < 2/6) [r, g, b] = [x, c, 0];
  else if (h < 3/6) [r, g, b] = [0, c, x];
  else if (h < 4/6) [r, g, b] = [0, x, c];
  else if (h < 5/6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

function getContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
  const lum1 = getLuminance(...color1);
  const lum2 = getLuminance(...color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Our theme colors (HSL format)
const THEMES = {
  light: {
    background: [0, 0, 100],      // 0 0% 100%
    foreground: [0, 0, 9],        // 0 0% 9%
    muted: [0, 0, 96],            // 0 0% 96%
    mutedForeground: [0, 0, 25],  // 0 0% 25%
    primary: [220, 91, 37],       // 220 91% 37%
    primaryForeground: [0, 0, 98], // 0 0% 98%
    destructive: [0, 84, 40],     // 0 84% 40%
    destructiveForeground: [0, 0, 98], // 0 0% 98%
    border: [0, 0, 87],           // 0 0% 87%
    card: [0, 0, 100],            // 0 0% 100%
  },
  dark: {
    background: [0, 0, 6],        // 0 0% 6%
    foreground: [0, 0, 96],       // 0 0% 96%
    muted: [0, 0, 12],            // 0 0% 12%
    mutedForeground: [0, 0, 70],  // 0 0% 70%
    primary: [220, 91, 65],       // 220 91% 65%
    primaryForeground: [0, 0, 9], // 0 0% 9%
    destructive: [0, 84, 65],     // 0 84% 65%
    destructiveForeground: [0, 0, 9], // 0 0% 9%
    border: [0, 0, 18],           // 0 0% 18%
    card: [0, 0, 8],              // 0 0% 8%
  }
};

// Test combinations
const TEST_COMBINATIONS = [
  { fg: 'foreground', bg: 'background', component: 'Body Text', requiredRatio: 7.0 },
  { fg: 'foreground', bg: 'card', component: 'Card Text', requiredRatio: 7.0 },
  { fg: 'mutedForeground', bg: 'background', component: 'Muted Text', requiredRatio: 4.5 },
  { fg: 'mutedForeground', bg: 'card', component: 'Card Muted Text', requiredRatio: 4.5 },
  { fg: 'primaryForeground', bg: 'primary', component: 'Primary Button', requiredRatio: 4.5 },
  { fg: 'destructiveForeground', bg: 'destructive', component: 'Destructive Button', requiredRatio: 4.5 },
  { fg: 'foreground', bg: 'muted', component: 'Input Text', requiredRatio: 7.0 },
];

let totalTests = 0;
let passedTests = 0;
let failedTests: Array<{theme: string, test: string, ratio: number, required: number}> = [];

console.log('🔍 WCAG AAA Contrast Validation\n');

// Test each theme
Object.entries(THEMES).forEach(([themeName, colors]) => {
  console.log(`\n📋 Testing ${themeName.toUpperCase()} theme:`);
  console.log('='.repeat(40));
  
  TEST_COMBINATIONS.forEach(({ fg, bg, component, requiredRatio }) => {
    const fgColor = hslToRgb(...colors[fg as keyof typeof colors]);
    const bgColor = hslToRgb(...colors[bg as keyof typeof colors]);
    
    const ratio = getContrastRatio(fgColor, bgColor);
    const passes = ratio >= requiredRatio;
    
    totalTests++;
    
    if (passes) {
      passedTests++;
      console.log(`✅ ${component}: ${ratio.toFixed(1)}:1 (PASS)`);
    } else {
      failedTests.push({
        theme: themeName,
        test: component,
        ratio,
        required: requiredRatio
      });
      console.log(`❌ ${component}: ${ratio.toFixed(1)}:1 (FAIL - needs ${requiredRatio}:1)`);
    }
  });
});

// Summary
console.log('\n📊 Final Results');
console.log('='.repeat(40));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests.length}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests.length > 0) {
  console.log('\n❌ FAILED TESTS:');
  failedTests.forEach(({ theme, test, ratio, required }) => {
    console.log(`${theme}: ${test} = ${ratio.toFixed(1)}:1 (Required: ${required}:1)`);
  });
  console.log('\n💥 Fix these color combinations before deploying!');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed! Your themes are WCAG AAA compliant.');
  process.exit(0);
}