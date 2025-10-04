/**
 * Message Type Constants
 *
 * Defines the types of messages that can be displayed.
 */
export const MESSAGE_TYPES = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
} as const;

/**
 * Type for message types
 */
export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

/**
 * Message Type Styles
 *
 * Maps message types to their corresponding Tailwind CSS classes.
 * This follows the Single Responsibility Principle by separating
 * style logic from component logic.
 */
export const MESSAGE_TYPE_STYLES: Record<MessageType, string> = {
  [MESSAGE_TYPES.ERROR]: 'text-red-600 dark:text-red-400',
  [MESSAGE_TYPES.WARNING]: 'text-orange-600 dark:text-orange-400',
  [MESSAGE_TYPES.INFO]: 'text-blue-600 dark:text-blue-400',
  [MESSAGE_TYPES.SUCCESS]: 'text-green-600 dark:text-green-400',
} as const;

/**
 * Gets the text color class for a given message type
 *
 * @param type - The message type
 * @returns The corresponding Tailwind CSS class
 */
export function getMessageTypeStyle(type: MessageType): string {
  return MESSAGE_TYPE_STYLES[type] || MESSAGE_TYPE_STYLES[MESSAGE_TYPES.ERROR];
}
