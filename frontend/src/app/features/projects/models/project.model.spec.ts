import { describe, it, expect } from 'vitest';
import {
  normalizeTipoNivel,
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

  describe('normalizeTipoNivel', () => {
    it('keeps the catalog ids as they are', () => {
      expect(normalizeTipoNivel('CFGS_EDUCACION_INFANTIL')).toBe('CFGS_EDUCACION_INFANTIL');
      expect(normalizeTipoNivel('NIVEL_NUEVO')).toBe('NIVEL_NUEVO');
    });

    it('maps legacy values: empty to FP Básica and ESO to the PDC', () => {
      expect(normalizeTipoNivel(undefined)).toBe('FP_BASICA');
      expect(normalizeTipoNivel('')).toBe('FP_BASICA');
      expect(normalizeTipoNivel('ESO')).toBe('DIVERSIFICACION_CURRICULAR');
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
