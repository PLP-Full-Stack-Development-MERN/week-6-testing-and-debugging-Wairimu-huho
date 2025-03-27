const { isValidObjectId, isValidStatusTransition } = require('../../utils/validation');
const mongoose = require('mongoose');

describe('Validation Utilities', () => {
  describe('isValidObjectId', () => {
    it('should return true for valid ObjectId', () => {
      const validId = new mongoose.Types.ObjectId().toString();
      expect(isValidObjectId(validId)).toBe(true);
    });

    it('should return false for invalid ObjectId', () => {
      const invalidIds = [
        '123', 
        'invalidId',
        '123456789012', // 12 characters but not hex
        'abcdefghijkl', // 12 hex characters but not a valid ObjectId
        '507f1f77bcf86cd799439011a', // too long
        null,
        undefined,
        {},
        []
      ];

      invalidIds.forEach(id => {
        expect(isValidObjectId(id)).toBe(false);
      });
    });
  });

  describe('isValidStatusTransition', () => {
    it('should allow valid status transitions', () => {
      const validTransitions = [
        { from: 'open', to: 'in-progress' },
        { from: 'open', to: 'resolved' },
        { from: 'open', to: 'closed' },
        { from: 'in-progress', to: 'open' },
        { from: 'in-progress', to: 'resolved' },
        { from: 'in-progress', to: 'closed' },
        { from: 'resolved', to: 'in-progress' },
        { from: 'resolved', to: 'closed' },
        { from: 'resolved', to: 'open' },
        { from: 'closed', to: 'open' },
      ];

      validTransitions.forEach(transition => {
        expect(isValidStatusTransition(transition.from, transition.to))
          .toBe(true);
      });
    });

    it('should reject invalid status transitions', () => {
      // Direct transition from closed to in-progress or resolved is not allowed
      const invalidTransitions = [
        { from: 'closed', to: 'in-progress' },
        { from: 'closed', to: 'resolved' },
      ];

      invalidTransitions.forEach(transition => {
        expect(isValidStatusTransition(transition.from, transition.to))
          .toBe(false);
      });
    });

    it('should allow same status (no change)', () => {
      const statuses = ['open', 'in-progress', 'resolved', 'closed'];
      
      statuses.forEach(status => {
        expect(isValidStatusTransition(status, status)).toBe(true);
      });
    });

    it('should handle invalid status inputs', () => {
      expect(isValidStatusTransition('invalid', 'open')).toBe(false);
      expect(isValidStatusTransition('open', 'invalid')).toBe(false);
      expect(isValidStatusTransition('invalid', 'invalid')).toBe(false);
      expect(isValidStatusTransition(null, 'open')).toBe(false);
      expect(isValidStatusTransition('open', null)).toBe(false);
      expect(isValidStatusTransition(undefined, 'open')).toBe(false);
    });
  });
});