'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  LOGIN_ERROR_TYPES,
  LOGIN_ERROR_MODAL_STYLES,
  LOGIN_ERROR_MODAL_TEXTS,
  type LoginErrorType,
  getLoginErrorConfig,
} from './login-error.config';

/**
 * Props for LoginErrorModal component
 */
interface LoginErrorModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Type of login error to display */
  errorType: LoginErrorType | null;
  /** User's email (optional, shown for domain errors) */
  email?: string;
  /** Custom required domain text */
  requiredDomain?: string;
  /** Custom accept button text */
  acceptButtonText?: string;
}

/**
 * LoginErrorModal Component
 *
 * Displays different types of login errors in a modal dialog.
 * Follows SOLID principles:
 * - Single Responsibility: Only displays login error modals
 * - Open/Closed: Error configurations are separate and extensible
 * - Dependency Inversion: Depends on error config abstraction
 *
 * @example
 * ```tsx
 * <LoginErrorModal
 *   isOpen={showError}
 *   onClose={handleClose}
 *   errorType="invalid_credentials"
 * />
 *
 * // With email for domain error
 * <LoginErrorModal
 *   isOpen={showError}
 *   onClose={handleClose}
 *   errorType="invalid_domain"
 *   email="user@example.com"
 * />
 * ```
 */
export default function LoginErrorModal({
  isOpen,
  onClose,
  errorType,
  email,
  requiredDomain = LOGIN_ERROR_MODAL_TEXTS.REQUIRED_DOMAIN_VALUE,
  acceptButtonText = LOGIN_ERROR_MODAL_TEXTS.BUTTON_ACCEPT,
}: LoginErrorModalProps) {
  if (!errorType) return null;

  const config = getLoginErrorConfig(errorType);
  const IconComponent = config.icon;
  const showDomainInfo =
    errorType === LOGIN_ERROR_TYPES.INVALID_DOMAIN && email;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div
            className={`${LOGIN_ERROR_MODAL_STYLES.ICON_CONTAINER_BASE} ${config.bgColor}`}
          >
            <IconComponent
              className={`${LOGIN_ERROR_MODAL_STYLES.ICON} ${config.iconColor}`}
            />
          </div>
          <DialogTitle className={LOGIN_ERROR_MODAL_STYLES.TITLE}>
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className={LOGIN_ERROR_MODAL_STYLES.CONTENT}>
          <p className={LOGIN_ERROR_MODAL_STYLES.DESCRIPTION}>
            {config.description}
          </p>

          {showDomainInfo && (
            <div className={LOGIN_ERROR_MODAL_STYLES.INFO_BOX}>
              <p className={LOGIN_ERROR_MODAL_STYLES.INFO_TEXT}>
                <strong>{LOGIN_ERROR_MODAL_TEXTS.EMAIL_ENTERED}</strong> {email}
              </p>
              <p className={LOGIN_ERROR_MODAL_STYLES.INFO_TEXT_MARGIN}>
                <strong>{LOGIN_ERROR_MODAL_TEXTS.REQUIRED_DOMAIN}</strong>{' '}
                {requiredDomain}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className={LOGIN_ERROR_MODAL_STYLES.FOOTER}>
          <Button onClick={onClose} className={LOGIN_ERROR_MODAL_STYLES.BUTTON}>
            {acceptButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Re-export types and constants for convenience
export { LOGIN_ERROR_TYPES, type LoginErrorType };
