import { describe, it, expect } from 'vitest';
import {
  courseLevelLabelKey,
  getHistoryTabForTipoNivel,
  isFPProject,
  isESOProject,
  AiModelsResponse,
  getOwnerId,
  Project,
  projectLanguage,
  originalText,
  resolveProjectContent,
  projectTextIn,
  isTranslationInProgress,
  TRANSLATION_LOCK_MS,
} from './project.model';

const asProject = (p: object) => p as Project;

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

    it('should return CFGS_EDUCACION_INFANTIL for CFGS_EDUCACION_INFANTIL', () => {
      expect(getHistoryTabForTipoNivel('CFGS_EDUCACION_INFANTIL')).toBe('CFGS_EDUCACION_INFANTIL');
    });

    it('should resolve the translation key of each level', () => {
      expect(courseLevelLabelKey('CFGS_EDUCACION_INFANTIL')).toBe(
        'courseLevelCFGSEducacionInfantil',
      );
      expect(courseLevelLabelKey('CFGM_PELUQUERIA')).toBe('courseLevelCFGMPeluqueria');
      expect(courseLevelLabelKey('CFGM_ESTETICA')).toBe('courseLevelCFGM');
      expect(courseLevelLabelKey('DIVERSIFICACION_CURRICULAR')).toBe('courseLevelPDC');
      expect(courseLevelLabelKey(undefined)).toBe('courseLevelFP');
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

  describe('getOwnerId', () => {
    it('should return the _id of a populated user', () => {
      expect(getOwnerId({ _id: 'u1', name: 'Ana' })).toBe('u1');
    });

    it('should return the id when userId is a string', () => {
      expect(getOwnerId('u2')).toBe('u2');
    });

    it('should return undefined for missing or empty ids', () => {
      expect(getOwnerId(undefined)).toBeUndefined();
      expect(getOwnerId(null)).toBeUndefined();
      expect(getOwnerId('')).toBeUndefined();
    });
  });

  describe('idioma del contenido', () => {
    const base = {
      language: 'castellano',
      contentVersion: 2,
      generatedContent: { rawText: 'Original ES' },
    };

    it('projectLanguage usa castellano para proyectos antiguos', () => {
      expect(projectLanguage({ language: 'catalan' })).toBe('catalan');
      expect(projectLanguage({})).toBe('castellano');
    });

    it('originalText admite el formato legacy en texto plano', () => {
      expect(originalText(asProject(base))).toBe('Original ES');
      expect(originalText(asProject({ generatedContent: 'Legacy' }))).toBe('Legacy');
      expect(originalText(asProject({}))).toBe('');
    });

    it('muestra el original cuando la interfaz está en su idioma', () => {
      expect(resolveProjectContent(asProject(base), 'castellano')).toEqual({
        text: 'Original ES',
        language: 'castellano',
        isTranslation: false,
        stale: false,
        missingTranslation: false,
        translating: false,
        translationFailed: false,
      });
    });

    it('indica que falta la traducción y mantiene el original', () => {
      const view = resolveProjectContent(asProject(base), 'catalan');
      expect(view.text).toBe('Original ES');
      expect(view.language).toBe('castellano');
      expect(view.missingTranslation).toBe(true);
    });

    it('muestra la traducción y detecta si está desactualizada', () => {
      const fresh = asProject({
        ...base,
        translations: { catalan: { rawText: 'Original CA', sourceVersion: 2 } },
      });
      expect(resolveProjectContent(fresh, 'catalan')).toEqual({
        text: 'Original CA',
        language: 'catalan',
        isTranslation: true,
        stale: false,
        missingTranslation: false,
        translating: false,
        translationFailed: false,
      });

      const stale = asProject({ ...base, translations: { catalan: { rawText: 'Antic' } } });
      expect(resolveProjectContent(stale, 'catalan').stale).toBe(true);

      const legacy = asProject({
        generatedContent: { rawText: 'x' },
        translations: { catalan: { rawText: 'y' } },
      });
      expect(resolveProjectContent(legacy, 'catalan').stale).toBe(false);
    });

    it('isTranslationInProgress respeta el estado y la caducidad del bloqueo', () => {
      const now = new Date();
      const old = new Date(Date.now() - TRANSLATION_LOCK_MS - 1000);
      expect(isTranslationInProgress(undefined)).toBe(false);
      expect(isTranslationInProgress({ status: 'completada', startedAt: now })).toBe(false);
      expect(isTranslationInProgress({ status: 'traduciendo' })).toBe(false);
      expect(isTranslationInProgress({ status: 'traduciendo', startedAt: now })).toBe(true);
      expect(isTranslationInProgress({ status: 'traduciendo', startedAt: old })).toBe(false);
    });

    it('marca la traducción en curso, fallida o abandonada', () => {
      const withTranslation = (catalan: object) =>
        asProject({ ...base, translations: { catalan } });

      const running = resolveProjectContent(
        withTranslation({ status: 'traduciendo', startedAt: new Date() }),
        'catalan',
      );
      expect(running).toMatchObject({
        missingTranslation: true,
        translating: true,
        translationFailed: false,
      });

      const failed = resolveProjectContent(
        withTranslation({ rawText: 'Antic', sourceVersion: 2, status: 'error' }),
        'catalan',
      );
      expect(failed).toMatchObject({
        isTranslation: true,
        translating: false,
        translationFailed: true,
      });

      const abandoned = resolveProjectContent(
        withTranslation({ status: 'traduciendo', startedAt: new Date(0) }),
        'catalan',
      );
      expect(abandoned).toMatchObject({ translating: false, translationFailed: true });

      // En el idioma original no se considera ninguna traducción
      const original = resolveProjectContent(withTranslation({ status: 'error' }), 'castellano');
      expect(original.translationFailed).toBe(false);
    });

    it('projectTextIn devuelve la traducción del idioma o el original', () => {
      const project = asProject({ ...base, translations: { catalan: { rawText: 'CA' } } });
      expect(projectTextIn(project, 'catalan')).toBe('CA');
      expect(projectTextIn(project, 'castellano')).toBe('Original ES');
      expect(projectTextIn(asProject(base), 'catalan')).toBe('Original ES');
    });
  });
});
