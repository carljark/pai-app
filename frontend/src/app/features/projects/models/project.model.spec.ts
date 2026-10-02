import { describe, it, expect } from 'vitest';
import {
  getHistoryTabForTipoNivel,
  isFPProject,
  isESOProject,
  AiModelsResponse,
} from './project.model';

describe('Project Model - Utility Functions', () => {
  it('should type the AI models response shape', () => {
    const response: AiModelsResponse = {
      providers: [{ value: 'gemini', label: 'Gemini', defaultModel: 'gemini-3.6-flash' }],
      models: [{ value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', provider: 'gemini' }],
    };
    expect(response.models[0].value).toBe('gemini-3.6-flash');
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
