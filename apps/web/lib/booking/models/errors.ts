// lib/booking/models/errors.ts

export class BookingNotFoundError extends Error {
  constructor(public bookingId: string) {
    super(`Booking with ID ${bookingId} not found`);
    this.name = 'BookingNotFoundError';
  }
}

export class OrderNotFoundError extends Error {
  constructor(public orderId: string) {
    super(`Order with ID ${orderId} not found`);
    this.name = 'OrderNotFoundError';
  }
}

export class InvalidStatusTransitionError extends Error {
  constructor(public from: string, public to: string) {
    super(`Invalid status transition from ${from} to ${to}`);
    this.name = 'InvalidStatusTransitionError';
  }
}

export class UnauthorizedAccessError extends Error {
  constructor(public reason: string) {
    super(`Unauthorized access: ${reason}`);
    this.name = 'UnauthorizedAccessError';
  }
}

export class ValidationError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
