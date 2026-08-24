import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TERMS_OF_SERVICE, LEGAL_INFO } from '@/config/legal';

interface TermsOfServiceProps {
  onAccept: (signatureData: string) => void;
  onDecline?: () => void;
}

export function TermsOfService({ onAccept, onDecline }: TermsOfServiceProps) {
  const [accepted, setAccepted] = useState(false);
  const [signature, setSignature] = useState('');

  const handleAccept = () => {
    if (!accepted || !signature.trim()) return;

    // Record acceptance with timestamp
    const signatureData = JSON.stringify({
      signature: signature.trim(),
      timestamp: new Date().toISOString(),
      termsVersion: LEGAL_INFO.terms.version,
      ip: 'recorded-server-side',
    });

    onAccept(signatureData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {LEGAL_INFO.product.name_with_tm}
          </CardTitle>
          <CardDescription>
            Terms of Service - Version {LEGAL_INFO.terms.version}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Terms Text */}
          <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-muted/50">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {TERMS_OF_SERVICE}
            </pre>
          </div>

          {/* Agreement Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms-accept"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <label htmlFor="terms-accept" className="text-sm leading-relaxed">
                I have read and agree to the Terms of Service. I understand that:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>I retain copyright to my original work</li>
                  <li>The studio receives a license to use my work in projects</li>
                  <li>All work receives timestamped proof of creation</li>
                  <li>I grant proper attribution to collaborators</li>
                </ul>
              </label>
            </div>

            {/* Digital Signature */}
            <div className="space-y-2">
              <label htmlFor="signature" className="text-sm font-medium">
                Digital Signature (Type your full name)
              </label>
              <input
                id="signature"
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3 py-2 border rounded-md"
                disabled={!accepted}
              />
              <p className="text-xs text-muted-foreground">
                By typing your name, you are electronically signing this agreement.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAccept}
                disabled={!accepted || !signature.trim()}
                className="flex-1"
              >
                Accept Terms & Continue
              </Button>
              {onDecline && (
                <Button onClick={onDecline} variant="outline">
                  Decline
                </Button>
              )}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              {LEGAL_INFO.copyright.notice}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface NDASignatureProps {
  onSign: (signatureData: string) => void;
  onDecline?: () => void;
}

export function NDASignature({ onSign, onDecline }: NDASignatureProps) {
  const [understood, setUnderstood] = useState(false);
  const [signature, setSignature] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">
            Non-Disclosure Agreement Required
          </CardTitle>
          <CardDescription>
            Team members must sign an NDA to access proprietary technology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">⚠️ Confidentiality Required</h3>
            <p className="text-sm">
              You are about to access proprietary AI technology, algorithms, and trade secrets.
              You must agree to maintain strict confidentiality.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">You agree to:</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>Keep all studio technology confidential</li>
              <li>Not reverse engineer the platform</li>
              <li>Not share trade secrets with competitors</li>
              <li>Protect proprietary algorithms and processes</li>
            </ul>

            <h4 className="font-semibold mt-4">Violations may result in:</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm text-destructive">
              <li>Immediate account termination</li>
              <li>Legal action for injunctive relief</li>
              <li>Damages and attorney's fees</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="nda-understand"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <label htmlFor="nda-understand" className="text-sm">
                I understand the confidentiality obligations and agree to the NDA terms
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="nda-signature" className="text-sm font-medium">
                Digital Signature
              </label>
              <input
                id="nda-signature"
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3 py-2 border rounded-md"
                disabled={!understood}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  const signatureData = JSON.stringify({
                    signature: signature.trim(),
                    timestamp: new Date().toISOString(),
                    ndaVersion: '1.0.0',
                  });
                  onSign(signatureData);
                }}
                disabled={!understood || !signature.trim()}
                variant="destructive"
                className="flex-1"
              >
                Sign NDA
              </Button>
              {onDecline && (
                <Button onClick={onDecline} variant="outline">
                  Decline
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
