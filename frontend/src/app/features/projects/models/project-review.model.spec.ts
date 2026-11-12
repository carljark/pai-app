import { describe, it, expect } from 'vitest';
import {
  REVIEW_LOCK_MS,
  isReviewInProgress,
  isReviewStale,
  isSuggestionApplied,
  suggestionKey,
} from './project-review.model';

const dimension = { id: 'coherence' as const, score: 3, justification: 'J', suggestions: ['S'] };

describe('project-review.model', () => {
  it('isReviewInProgress solo es cierto con el bloqueo vigente', () => {
    expect(isReviewInProgress(null)).toBe(false);
    expect(isReviewInProgress({ status: 'revisando' })).toBe(false);
    expect(isReviewInProgress({ status: 'completada', startedAt: new Date() })).toBe(false);
    expect(isReviewInProgress({ status: 'revisando', startedAt: new Date() })).toBe(true);
    const expired = new Date(Date.now() - REVIEW_LOCK_MS - 1000);
    expect(isReviewInProgress({ status: 'revisando', startedAt: expired })).toBe(false);
  });

  it('identifica las sugerencias aplicadas', () => {
    expect(suggestionKey('timing', 2)).toBe('timing:2');
    expect(suggestionKey('timing')).toBe('timing:*');
    expect(isSuggestionApplied({ applied: ['timing:2'] }, 'timing', 2)).toBe(true);
    expect(isSuggestionApplied({ applied: ['timing:2'] }, 'timing', 1)).toBe(false);
    expect(isSuggestionApplied(null, 'timing', 2)).toBe(false);
  });

  it('isReviewStale compara la versión revisada con la actual', () => {
    expect(isReviewStale(undefined, 1)).toBe(false);
    expect(isReviewStale({ dimensions: [] }, 1)).toBe(false);
    expect(isReviewStale({ dimensions: [dimension], contentVersion: 1 }, 1)).toBe(false);
    expect(isReviewStale({ dimensions: [dimension], contentVersion: 1 }, 2)).toBe(true);
    expect(isReviewStale({ dimensions: [dimension] }, undefined)).toBe(false);
  });
});
