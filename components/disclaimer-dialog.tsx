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
            <AlertDialogHeader className="shrink-0">
              <AlertDialogTitle>AI Assistant Disclaimer</AlertDialogTitle>
            </AlertDialogHeader>
          </div>
          <AlertDialogDescription asChild>
            <div className="text-left space-y-4 overflow-y-auto flex-1 px-6 pb-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800 font-medium text-sm">
                  ⚠️ This AI assistant provides general information and guidance.
                  For professional advice, legal matters, or critical decisions,
                  please consult with qualified professionals or subject matter
                  experts.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Professional Consultation Recommended
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    For legal, medical, financial, or professional advice,
                    consult qualified experts in the relevant field
                  </li>
                  <li>
                    Critical business or personal decisions should be reviewed
                    with appropriate professionals
                  </li>
                  <li>
                    Technical implementations should be validated by subject
                    matter experts
                  </li>
                  <li>
                    Complex scenarios may require specialized consultation
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  AI Assistant Limitations
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    AI responses are based on training data and may not reflect
                    the most recent information
                  </li>
                  <li>
                    Responses may contain errors and should be verified
                    independently
                  </li>
                  <li>
                    Complex interpretations may vary and require human
                    validation
                  </li>
                  <li>
                    This service cannot replace professional consultation in
                    specialized fields
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Data and Privacy
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Your conversations are processed to provide AI assistance
                  </li>
                  <li>
                    Avoid sharing sensitive personal or confidential information
                  </li>
                  <li>
                    Review our privacy policy for details on data handling
                  </li>
                  <li>Consider data sensitivity when using AI assistance</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Proper Use Guidelines
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Use the AI assistant for general information and guidance
                  </li>
                  <li>
                    Always verify important information from authoritative
                    sources
                  </li>
                  <li>
                    Consult professionals for specialized advice and critical
                    decisions
                  </li>
                  <li>
                    Use your best judgment when acting on AI-generated
                    suggestions
                  </li>
                </ul>
              </div>

              <p className="text-xs text-muted-foreground border-t pt-3 mt-4">
                By using this AI assistant, you acknowledge that this service
                provides general guidance only and that important decisions
                should be made in consultation with qualified professionals or
                subject matter experts.
              </p>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter className="shrink-0 bg-background border-t p-6 pt-4">
            <AlertDialogAction className="w-full">
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
