'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon } from '@/components/icons';
import { toast } from '@/components/toast';

export default function EmbedPage() {
  const router = useRouter();
  const [agencyId, setAgencyId] = useState('your-agency-id');
  const [copied, setCopied] = useState(false);
  const [secretKey] = useState('••••••••pxc1');
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  const embedCode = `<script>
  (function(){const e=document.createElement("script");
  e.src="https://app.homefax.ai/widget.js";
  e.setAttribute("data-agency-id","${agencyId}");
  e.setAttribute("data-position","bottom-right");
  document.body.appendChild(e)})();
</script>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      type: 'success',
      description: 'Copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Load the widget script after component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/widget.js';
    script.setAttribute('data-agency-id', 'demo');
    script.setAttribute('data-position', 'bottom-right');
    script.onload = () => setWidgetLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup widget on unmount
      const bubble = document.querySelector(
        '[style*="position: fixed"][style*="border-radius: 30px"]',
      );
      const container = document.querySelector(
        '[style*="position: fixed"][style*="border-radius: 16px"]',
      );
      bubble?.remove();
      container?.remove();
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeftIcon size={16} />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Embed HomeFax Widget</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <p className="text-muted-foreground">
            Add HomeFax AI chat to your website. Your customers can get instant
            answers about their insurance policies 24/7.
          </p>
        </div>

        {/* Live Demo */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Live Demo</h2>
          <div className="bg-muted/50 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {widgetLoaded
                  ? 'Widget loaded! Look for the chat bubble in the bottom-right corner.'
                  : 'Loading widget demo...'}
              </p>
              <p className="text-xs text-muted-foreground">
                Click it to see how your customers will interact with HomeFax
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Setup */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Setup</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add this code snippet to your website's HTML, right before the
              closing {`</body>`} tag:
            </p>

            <div className="bg-muted rounded-lg p-4 relative font-mono text-sm">
              <pre className="overflow-x-auto text-muted-foreground">
                <code>{embedCode}</code>
              </pre>
              <Button
                onClick={() => handleCopy(embedCode)}
                className="absolute top-2 right-2"
                size="sm"
                variant="secondary"
              >
                Copy
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Pro tip:</strong> Replace "your-agency-id" with your
                actual agency ID to link conversations to your account.
              </p>
            </div>
          </div>
        </Card>

        {/* Advanced Configuration */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Configuration Options</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Widget Position</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Control where the chat bubble appears on your site:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-lg p-3">
                  <code className="text-xs">data-position="bottom-right"</code>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <code className="text-xs">data-position="bottom-left"</code>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Agency ID</h3>
              <p className="text-sm text-muted-foreground">
                Your unique agency identifier ensures all conversations are
                properly tracked and associated with your account.
              </p>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Security & Authentication
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For enhanced security, you can verify user identities by
              generating an HMAC signature on your server.
            </p>

            <div>
              <p className="text-sm font-medium">Your Secret Key</p>
              <div className="mt-2 bg-muted rounded-lg p-3 font-mono text-sm flex items-center justify-between">
                <span>{secretKey}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(secretKey)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
              <p className="text-sm text-orange-900 dark:text-orange-100">
                <strong>Important:</strong> Keep your secret key safe. Never
                expose it in client-side code or commit it to version control.
              </p>
            </div>

            <details className="group">
              <summary className="cursor-pointer text-sm font-medium hover:text-primary">
                View implementation example
              </summary>
              <div className="mt-4 space-y-3">
                <div className="bg-muted rounded-lg p-3">
                  <code className="text-xs">
                    {`// Server-side code only
const crypto = require('crypto');
const secret = process.env.HOMEFAX_SECRET;
const userId = currentUser.id;

const hash = crypto
  .createHmac('sha256', secret)
  .update(userId)
  .digest('hex');

// Pass hash to your frontend
`}
                  </code>
                </div>
              </div>
            </details>
          </div>
        </Card>

        {/* Support */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Our team is here to help you get set up and answer any questions.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.open('mailto:support@homefax.ai')}
            >
              Contact Support
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/docs', '_blank')}
            >
              View Documentation
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
