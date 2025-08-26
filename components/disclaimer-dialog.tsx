'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DisclaimerDialogProps {
  children: React.ReactNode;
}

export function DisclaimerDialog({ children }: DisclaimerDialogProps) {
  return (
    <div className="[&_[data-radix-alert-dialog-overlay]]:bg-black/90">
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] p-0 flex flex-col">
          <div className="p-6 pb-0">
            <AlertDialogHeader className="flex-shrink-0">
              <AlertDialogTitle>
                Important Insurance Information Disclaimer
              </AlertDialogTitle>
            </AlertDialogHeader>
          </div>
          <AlertDialogDescription asChild>
            <div className="text-left space-y-4 overflow-y-auto flex-1 px-6 pb-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800 font-medium text-sm">
                  ⚠️ This information is for guidance only and must be confirmed
                  by your licensed insurance agent. Policy interpretations can
                  vary, and only your agent can provide definitive coverage
                  determinations and handle claims or policy changes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Professional Consultation Required
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    All policy interpretations must be verified with your
                    licensed insurance agent
                  </li>
                  <li>
                    Only licensed professionals can provide definitive coverage
                    determinations
                  </li>
                  <li>
                    Claims processing and policy changes require agent
                    assistance
                  </li>
                  <li>Complex coverage scenarios need professional review</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  AI Assistant Limitations
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    HomeFax AI provides guidance based on policy document
                    analysis
                  </li>
                  <li>
                    AI responses may not reflect recent policy changes or
                    amendments
                  </li>
                  <li>
                    Policy language interpretation can vary and requires
                    professional validation
                  </li>
                  <li>
                    This service cannot replace licensed insurance consultation
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Regulatory Compliance
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    HomeFax adheres to all applicable insurance regulatory
                    requirements
                  </li>
                  <li>
                    Licensed agents provide human oversight for all policy
                    guidance
                  </li>
                  <li>
                    Official policy documents remain the authoritative source
                  </li>
                  <li>
                    Professional insurance advice supersedes AI interpretations
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Proper Use Guidelines
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Use HomeFax AI for initial policy understanding and
                    education
                  </li>
                  <li>
                    Always confirm important coverage details with your agent
                  </li>
                  <li>
                    Contact your insurance professional for claims or policy
                    changes
                  </li>
                  <li>
                    Maintain original policy documents as the definitive
                    reference
                  </li>
                </ul>
              </div>

              <p className="text-xs text-muted-foreground border-t pt-3 mt-4">
                By using HomeFax AI, you acknowledge that this service provides
                educational guidance only and that all insurance decisions
                should be made in consultation with your licensed insurance
                agent or company representative.
              </p>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter className="flex-shrink-0 bg-background border-t p-6 pt-4">
            <AlertDialogAction className="w-full">
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
