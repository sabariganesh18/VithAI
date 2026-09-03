import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Terminal, Sparkles, Code2, Award, Cpu, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export default function CodeCompilerMock({
  initialCode = `x = 15\ny = 25\nprint(x + y)`,
  language = 'python',
  expectedOutput = '40',
  testCases = [{ input: 'x = 15, y = 25', expected: '40' }],
  onLevelComplete
}) {
  const { addXP } = useLearning();

  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isLevelPassed, setIsLevelPassed] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setOutput('');
    setIsError(false);
    setTestResults(null);
    setIsLevelPassed(false);
  }, [initialCode]);

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 7) }, (_, i) => i + 1);

  const evaluateCode = () => {
    setIsRunning(true);
    setOutput('Compiling and parsing code execution...');
    setTestResults(null);
    setIsError(false);
    setIsLevelPassed(false);

    setTimeout(() => {
      let logs = [];
      let isPassed = false;
      let hasSyntaxError = false;

      // 1. Check for Syntax Errors
      if ((code.match(/"/g) || []).length % 2 !== 0 || (code.match(/'/g) || []).length % 2 !== 0) {
        logs.push('SyntaxError: EOL while scanning string literal');
        logs.push('Line: Missing closing quote " or \'');
        hasSyntaxError = true;
      } else if (code.includes('print') && !code.includes('(') && language !== 'python2') {
        logs.push('SyntaxError: Missing parentheses in call to \'print\'. Did you mean print(...)?');
        hasSyntaxError = true;
      } else if (!code.includes('print') && !code.includes('console.log') && !code.includes('cout') && !code.includes('printf') && !code.includes('SELECT') && !code.includes('return')) {
        logs.push('Error: No output statement found in code.');
        logs.push('Tip: Add print(), printf(), or console.log() to display your output.');
        hasSyntaxError = true;
      }

      if (hasSyntaxError) {
        setIsError(true);
        logs.push('\n[Process terminated with exit code 1 (FAILED)]');
        setOutput(logs.join('\n'));
        setIsRunning(false);

        setTestResults(testCases.map((tc, idx) => ({
          id: idx + 1,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: 'Syntax Error'
        })));
        return;
      }

      // 2. Evaluate Calculation Output
      const cleanExpected = expectedOutput.trim();

      if (
        (cleanExpected === '40' && (code.includes('15 + 25') || code.includes('15, y = 25') || code.includes('x + y') || code.includes('40'))) ||
        (cleanExpected === 'Eligible to Vote' && code.includes('Eligible to Vote')) ||
        (cleanExpected === '1\n2\n3' && (code.includes('range(1, 4)') || code.includes('range(1,4)'))) ||
        (cleanExpected === 'Hello Sabari' && code.includes('Hello Sabari')) ||
        (cleanExpected === '60' && (code.includes('sum(numbers)') || code.includes('60'))) ||
        (code.includes(cleanExpected))
      ) {
        logs.push(cleanExpected);
        logs.push('\n[Process finished with exit code 0 (SUCCESS)]');
        isPassed = true;
        setIsError(false);
      } else {
        logs.push(`Output: ${code.slice(0, 30)}...`);
        logs.push(`Warning: Output does not match expected result "${cleanExpected}"`);
        logs.push('\n[Process finished with exit code 0]');
        isPassed = false;
        setIsError(true);
      }

      setOutput(logs.join('\n'));
      setIsRunning(false);

      const tests = testCases.map((tc, idx) => ({
        id: idx + 1,
        passed: isPassed,
        input: tc.input,
        expected: tc.expected,
        actual: isPassed ? tc.expected : 'Incorrect Output'
      }));

      setTestResults(tests);

      if (isPassed) {
        setIsLevelPassed(true);
        addXP(25);
      }
    }, 600);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setIsError(false);
    setTestResults(null);
    setIsLevelPassed(false);
  };

  return (
    <div className="card border-0 rounded-5 shadow-2xl overflow-hidden mb-4" style={{ backgroundColor: '#090d16', color: '#f8fafc' }}>
      
      {/* Compiler Header Bar */}
      <div className="px-3 py-2.5 px-md-4 py-md-3 d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2 border-bottom" style={{ backgroundColor: '#030712', borderColor: '#1e293b' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center gap-1.5 me-1">
            <span className="rounded-circle bg-danger d-inline-block" style={{ width: '9px', height: '9px' }}></span>
            <span className="rounded-circle bg-warning d-inline-block" style={{ width: '9px', height: '9px' }}></span>
            <span className="rounded-circle bg-success d-inline-block" style={{ width: '9px', height: '9px' }}></span>
          </div>
          <Code2 className="w-4 h-4 text-emerald shrink-0" style={{ color: '#34d399' }} />
          <span className="fw-bold font-mono text-uppercase tracking-wider small text-truncate" style={{ color: '#f8fafc', fontSize: '0.78rem' }}>
            {language} Live Sandbox
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 w-100 w-sm-auto justify-content-end">
          <button
            onClick={handleReset}
            className="btn btn-sm btn-dark rounded-3 px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 border flex-fill flex-sm-grow-0 justify-content-center"
            style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155', fontSize: '0.8rem' }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          
          <button
            onClick={evaluateCode}
            disabled={isRunning}
            className="btn btn-sm btn-success rounded-3 px-4 py-1.5 fw-black text-dark d-inline-flex align-items-center gap-1.5 shadow flex-fill flex-sm-grow-0 justify-content-center"
            style={{ backgroundColor: '#34d399', borderColor: '#34d399', color: '#090d16', fontSize: '0.8rem' }}
          >
            {isRunning ? (
              <Cpu className="w-4 h-4 animate-spin text-dark" />
            ) : (
              <Play className="w-4 h-4 fill-dark text-dark" />
            )}
            <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Grid */}
      <div className="row g-0">
        
        {/* Code Editor Box */}
        <div className="col-12 col-lg-6 p-3 p-md-4 border-end d-flex font-mono" style={{ backgroundColor: '#090d16', borderColor: '#1e293b' }}>
          {/* Line Numbers Column */}
          <div className="pe-3 select-none text-end font-mono border-end me-3" style={{ color: '#94a3b8', borderColor: '#1e293b' }}>
            {lineNumbers.map((num) => (
              <div key={num} style={{ lineHeight: '1.6rem', fontSize: '0.85rem' }}>{num}</div>
            ))}
          </div>

          {/* Text Area Code Editor with Bulletproof Inline Styling */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={9}
            className="w-100 border-0 focus-none font-mono"
            style={{
              color: '#34d399',
              backgroundColor: 'transparent',
              caretColor: '#ffffff',
              lineHeight: '1.6rem',
              fontSize: '0.85rem',
              outline: 'none',
              resize: 'none',
              fontWeight: '600'
            }}
            placeholder="// Type your code here..."
            spellCheck="false"
          />
        </div>

        {/* Console Stdout Terminal */}
        <div className="col-12 col-lg-6 p-3 p-md-4 font-mono d-flex flex-column justify-content-between" style={{ backgroundColor: '#030712', minHeight: '260px' }}>
          <div>
            <div className="d-flex align-items-center justify-content-between font-sans fw-bold text-uppercase tracking-wider mb-2 pb-2 border-bottom" style={{ color: '#94a3b8', borderColor: '#1e293b', fontSize: '0.75rem' }}>
              <span className="d-flex align-items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" style={{ color: '#6366f1' }} /> Console Terminal Output
              </span>
              {isError && (
                <span className="text-danger d-flex align-items-center gap-1 fw-bold">
                  <AlertTriangle className="w-3.5 h-3.5" /> ERROR
                </span>
              )}
            </div>
            
            <pre className="whitespace-pre-wrap leading-relaxed m-0 font-mono" style={{ color: isError ? '#f87171' : '#e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>
              {output || '// Type your code in the editor on the left and click "Run Code"...'}
            </pre>
          </div>

          {/* Level Complete / Proceed CTA */}
          {isLevelPassed ? (
            <div className="mt-3 p-3 rounded-4 font-sans text-center border" style={{ backgroundColor: '#022c22', borderColor: '#059669', color: '#6ee7b7' }}>
              <div className="d-flex align-items-center justify-content-center gap-1.5 fw-black mb-1" style={{ color: '#34d399' }}>
                <Sparkles className="w-4 h-4 text-warning" /> Level Passed! +25 Coding XP
              </div>
              <p className="small mb-2 opacity-90">All test cases passed successfully!</p>
              
              <button
                onClick={onLevelComplete}
                className="btn btn-success w-100 py-2 rounded-3 font-black small d-flex align-items-center justify-content-center gap-2 shadow"
                style={{ backgroundColor: '#10b981', borderColor: '#10b981', color: '#090d16' }}
              >
                Proceed to Next Level <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : testResults && (
            <div className="mt-3 pt-3 border-top font-sans" style={{ borderColor: '#1e293b' }}>
              <div className="small fw-bold mb-2" style={{ color: '#94a3b8' }}>Test Cases Evaluation:</div>
              <div className="d-flex flex-column gap-1.5">
                {testResults.map((tc) => (
                  <div
                    key={tc.id}
                    className="p-2 rounded-3 border small d-flex align-items-center justify-content-between"
                    style={{
                      backgroundColor: tc.passed ? '#022c22' : '#450a0a',
                      borderColor: tc.passed ? '#059669' : '#dc2626',
                      color: tc.passed ? '#6ee7b7' : '#fca5a5'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {tc.passed ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-danger" />}
                      <span>Test Case #{tc.id}: Expected "{tc.expected}"</span>
                    </div>
                    <span className="fw-bold">{tc.passed ? 'PASSED ✅' : 'FAILED ❌'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
