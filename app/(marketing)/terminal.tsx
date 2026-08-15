'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * This block imitates a macOS terminal window, so its chrome stays dark and its
 * traffic-light dots keep their fixed colors in both themes — theming them would
 * stop it reading as a terminal. Reviewed exception to the token-only rule.
 */
const CHROME = 'bg-gray-900 text-white'; // ui-audit-allow
const DOTS = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']; // ui-audit-allow
const COPY_BUTTON = 'text-gray-400 hover:bg-transparent hover:text-white'; // ui-audit-allow
const PROMPT = 'text-green-400'; // ui-audit-allow

export function Terminal() {
  const [terminalStep, setTerminalStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const terminalSteps = [
    'git clone https://github.com/nextjs/saas-starter',
    'pnpm install',
    'pnpm db:setup',
    'pnpm db:migrate',
    'pnpm db:seed',
    'pnpm dev 🎉',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setTerminalStep((prev) =>
        prev < terminalSteps.length - 1 ? prev + 1 : prev
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [terminalStep]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(terminalSteps.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'w-full rounded-lg shadow-lg overflow-hidden font-mono text-sm relative',
        CHROME
      )}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {DOTS.map((dot) => (
              <div key={dot} className={cn('w-3 h-3 rounded-full', dot)} />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className={cn('size-8', COPY_BUTTON)}
          >
            {copied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
            <span className="sr-only">Copy to clipboard</span>
          </Button>
        </div>
        <div className="space-y-2">
          {terminalSteps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'transition-opacity duration-300',
                index > terminalStep ? 'opacity-0' : 'opacity-100'
              )}
            >
              <span className={PROMPT}>$</span> {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
