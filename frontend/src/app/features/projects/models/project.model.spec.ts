import { describe, it, expect } from 'vitest';
import {
  getModelsForProvider,
  getDefaultModelForProvider,
  getHistoryTabForTipoNivel,
  isFPProject,
  isESOProject,
  ProjectType,
} from './project.model';

describe('Project Model - Utility Functions', () => {
  describe('getModelsForProvider', () => {
    it('should return GEMINI_MODELS for gemini provider', () => {
      const models = getModelsForProvider('gemini');
      expect(models).toHaveLength(5);
      expect(models[0].provider).toBe('gemini');
      expect(models[0].value).toBe('gemini-3.8-flash');
    });

    it('should return OPENROUTER_MODELS for openrouter provider', () => {
      const models = getModelsForProvider('openrouter');
      expect(models).toHaveLength(8);
      expect(models[0].provider).toBe('openrouter');
      expect(models[0].value).toBe('openrouter/free');
    });
  });

  describe('getDefaultModelForProvider', () => {
    it('should return gemini-3.8-flash for gemini', () => {
      expect(getDefaultModelForProvider('gemini')).toBe('gemini-3.8-flash');
    });

    it('should return openrouter/free for openrouter', () => {
      expect(getDefaultModelForProvider('openrouter')).toBe('openrouter/free');
    });
  });

  describe('getHistoryTabForTipoNivel', () => {
    it('should return ESO for DIVERSIFICACION_CURRICULAR', () => {
      expect(getHistoryTabForTipoNivel('DIVERSIFICACION_CURRICULAR')).toBe('ESO');
    });

    it('should return ESO for ESO', () => {
      expect(getHistoryTabForTipoNivel('ESO')).toBe('ESO');
    });

    it('should return CFGM for CFGM_ESTETICA', () => {
      expect(getHistoryTabForTipoNivel('CFGM_ESTETICA')).toBe('CFGM');
    });

    it('should return CFGM_PELUQUERIA for CFGM_PELUQUERIA', () => {
      expect(getHistoryTabForTipoNivel('CFGM_PELUQUERIA')).toBe('CFGM_PELUQUERIA');
    });

    it('should return FPB for FP_BASICA', () => {
      expect(getHistoryTabForTipoNivel('FP_BASICA')).toBe('FPB');
    });

    it('should return FPB for unknown tipoNivel', () => {
      expect(getHistoryTabForTipoNivel('UNKNOWN' as any)).toBe('FPB');
    });
  });

  describe('isFPProject', () => {
    it('should return true for FP_BASICA', () => {
      expect(isFPProject('FP_BASICA')).toBe(true);
    });

    it('should return true for CFGM_ESTETICA', () => {
      expect(isFPProject('CFGM_ESTETICA')).toBe(true);
    });

    it('should return true for undefined tipoNivel', () => {
      expect(isFPProject(undefined as any)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isFPProject('' as any)).toBe(true);
    });

    it('should return false for CFGM_PELUQUERIA', () => {
      expect(isFPProject('CFGM_PELUQUERIA')).toBe(false);
    });

    it('should return false for DIVERSIFICACION_CURRICULAR', () => {
      expect(isFPProject('DIVERSIFICACION_CURRICULAR')).toBe(false);
    });

    it('should return false for ESO', () => {
      expect(isFPProject('ESO')).toBe(false);
    });
  });

  describe('isESOProject', () => {
    it('should return true for DIVERSIFICACION_CURRICULAR', () => {
      expect(isESOProject('DIVERSIFICACION_CURRICULAR')).toBe(true);
    });

    it('should return false for FP_BASICA', () => {
      expect(isESOProject('FP_BASICA')).toBe(false);
    });

    it('should return false for CFGM_ESTETICA', () => {
      expect(isESOProject('CFGM_ESTETICA')).toBe(false);
    });

    it('should return false for CFGM_PELUQUERIA', () => {
      expect(isESOProject('CFGM_PELUQUERIA')).toBe(false);
    });

    it('should return false for ESO', () => {
      expect(isESOProject('ESO')).toBe(false);
    });
  });
});