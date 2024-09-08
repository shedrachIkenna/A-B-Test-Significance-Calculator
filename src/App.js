import React, { useState } from 'react';
import { Alert, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';

const ABTestCalculator = () => {
  const [controlVisitors, setControlVisitors] = useState('');
  const [controlConversions, setControlConversions] = useState('');
  const [variantVisitors, setVariantVisitors] = useState('');
  const [variantConversions, setVariantConversions] = useState('');
  const [result, setResult] = useState(null);

  const calculateSignificance = () => {
    const cVisitors = parseInt(controlVisitors);
    const cConversions = parseInt(controlConversions);
    const vVisitors = parseInt(variantVisitors);
    const vConversions = parseInt(variantConversions);

    if (isNaN(cVisitors) || isNaN(cConversions) || isNaN(vVisitors) || isNaN(vConversions)) {
      setResult('Please enter valid numbers for all fields.');
      return;
    }

    const totalVisitors = cVisitors + vVisitors;
    const totalConversions = cConversions + vConversions;
    const expectedControlConversions = (cVisitors / totalVisitors) * totalConversions;
    const expectedVariantConversions = (vVisitors / totalVisitors) * totalConversions;

    const chiSquare =
      Math.pow(cConversions - expectedControlConversions, 2) / expectedControlConversions +
      Math.pow(vConversions - expectedVariantConversions, 2) / expectedVariantConversions;

    const pValue = 1 - chiSquareDistribution(chiSquare, 1);

    setResult(
      pValue < 0.05
        ? `The result is statistically significant (p-value: ${pValue.toFixed(4)})`
        : `The result is not statistically significant (p-value: ${pValue.toFixed(4)})`
    );
  };

  // Chi-square distribution function (simplified version)
  const chiSquareDistribution = (x, k) => {
    const epsilon = 1e-15;
    let sum = 0;
    let term = 1;
    let i = 1;
    while (term > epsilon * sum) {
      term *= x / (k + 2 * i);
      sum += term;
      i++;
    }
    return Math.exp(-x / 2 - Math.log(2) * k / 2) * sum;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">A/B Test Significance Calculator</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="controlVisitors">Control Visitors</Label>
          <Input
            id="controlVisitors"
            type="number"
            value={controlVisitors}
            onChange={(e) => setControlVisitors(e.target.value)}
            placeholder="Enter number of control visitors"
          />
        </div>
        <div>
          <Label htmlFor="controlConversions">Control Conversions</Label>
          <Input
            id="controlConversions"
            type="number"
            value={controlConversions}
            onChange={(e) => setControlConversions(e.target.value)}
            placeholder="Enter number of control conversions"
          />
        </div>
        <div>
          <Label htmlFor="variantVisitors">Variant Visitors</Label>
          <Input
            id="variantVisitors"
            type="number"
            value={variantVisitors}
            onChange={(e) => setVariantVisitors(e.target.value)}
            placeholder="Enter number of variant visitors"
          />
        </div>
        <div>
          <Label htmlFor="variantConversions">Variant Conversions</Label>
          <Input
            id="variantConversions"
            type="number"
            value={variantConversions}
            onChange={(e) => setVariantConversions(e.target.value)}
            placeholder="Enter number of variant conversions"
          />
        </div>
        <Button onClick={calculateSignificance} className="w-full">
          Calculate Significance
        </Button>
      </div>
      {result && (
        <Alert className="mt-4">
          <AlertDescription>{result}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ABTestCalculator;