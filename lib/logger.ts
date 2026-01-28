import pino from 'pino'
import type { Logger } from 'pino'

// Create base logger instance
const baseLogger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        singleLine: false,
      },
    },
  }),
  ...(process.env.NODE_ENV === 'production' && {
    formatters: {
      level: (label) => {
        return { level: label }
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }),
})

// Enhanced logger interface with structured logging
export interface LogContext {
  context?: string
  userId?: string
  requestId?: string
  userEmail?: string
  tier?: string // Allow any string for tier to support logging flexibility
  duration?: number
  error?: Error | string
  data?: Record<string, any>
  [key: string]: any
}

export interface StructuredLogger {
  info(message: string | LogContext, context?: LogContext): void
  warn(message: string | LogContext, context?: LogContext): void
  error(message: string | LogContext, context?: LogContext): void
  debug(message: string | LogContext, context?: LogContext): void
  trace(message: string | LogContext, context?: LogContext): void
}

// Request context storage for tracing
let requestContext: { requestId?: string; userId?: string } = {}

export const setRequestContext = (context: { requestId?: string; userId?: string }) => {
  requestContext = { ...requestContext, ...context }
}

export const clearRequestContext = () => {
  requestContext = {}
}

export const getRequestContext = () => requestContext

// Generate unique request ID
export const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Create structured logger
const createStructuredLogger = (): StructuredLogger => {
  const formatLog = (input: string | LogContext, additionalContext?: LogContext) => {
    const baseContext = {
      ...requestContext,
      timestamp: new Date().toISOString(),
    }

    if (typeof input === 'string') {
      return {
        ...baseContext,
        ...additionalContext,
        message: input,
      }
    } else {
      return {
        ...baseContext,
        ...additionalContext,
        ...input,
      }
    }
  }

  return {
    info: (message: string | LogContext, context?: LogContext) => {
      const logData = formatLog(message, context)
      baseLogger.info(logData)
    },

    warn: (message: string | LogContext, context?: LogContext) => {
      const logData = formatLog(message, context)
      baseLogger.warn(logData)
    },

    error: (message: string | LogContext, context?: LogContext) => {
      const logData = formatLog(message, context)
      baseLogger.error(logData)
    },

    debug: (message: string | LogContext, context?: LogContext) => {
      const logData = formatLog(message, context)
      baseLogger.debug(logData)
    },

    trace: (message: string | LogContext, context?: LogContext) => {
      const logData = formatLog(message, context)
      baseLogger.trace(logData)
    },
  }
}

// Export singleton logger instance
export const logger = createStructuredLogger()

// Helper functions for common logging patterns
export const logApiRequest = (method: string, path: string, context?: LogContext) => {
  logger.info({
    context: 'api-request',
    method,
    path,
    message: `${method} ${path}`,
    ...context,
  })
}

export const logApiResponse = (
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  context?: LogContext
) => {
  logger.info({
    context: 'api-response',
    method,
    path,
    statusCode,
    duration,
    message: `${method} ${path} - ${statusCode} (${duration}ms)`,
    ...context,
  })
}

export const logApiError = (
  method: string,
  path: string,
  error: Error | string,
  context?: LogContext
) => {
  logger.error({
    context: 'api-error',
    method,
    path,
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    message: `${method} ${path} failed`,
    ...context,
  })
}

export const logDatabaseQuery = (
  operation: string,
  table: string,
  duration?: number,
  context?: LogContext
) => {
  logger.debug({
    context: 'database-query',
    operation,
    table,
    duration,
    message: `Database ${operation} on ${table}`,
    ...context,
  })
}

export const logAuthEvent = (
  event: 'login' | 'logout' | 'register' | 'verify' | 'error',
  userId?: string,
  context?: LogContext
) => {
  logger.info({
    context: 'authentication',
    event,
    userId,
    message: `Auth ${event}${userId ? ` for user ${userId}` : ''}`,
    ...context,
  })
}

export const logGenerationEvent = (
  event: 'start' | 'complete' | 'error',
  tier: string,
  duration?: number,
  context?: LogContext
) => {
  const level = event === 'error' ? 'error' : 'info'
  logger[level]({
    context: 'design-generation',
    event,
    tier,
    duration,
    message: `Design generation ${event}`,
    ...context,
  })
}

export const logPerformance = (
  operation: string,
  duration: number,
  context?: LogContext
) => {
  logger.info({
    context: 'performance',
    operation,
    duration,
    message: `${operation} completed in ${duration}ms`,
    ...context,
  })
}

// Export the base logger for advanced use cases
export { baseLogger }
export default logger