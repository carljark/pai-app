import { describe, it, expect } from 'vitest';
import {
  fromProjectDto,
  fromProjectDtoArray,
  fromGenerateProjectResponse,
  fromFileUploadResponse,
  fromImportDocxResponse,
  fromRetryProjectResponse,
  fromProjectFileDto,
  fromProjectFileDtoArray,
  toCreateProjectPayload,
  toUpdateProjectPayload,
  toRewriteSectionPayload,
  toFileUploadFormData,
  toImportDocxFormData,
  mapStatus,
  mapTipoNivel,
  fromRewriteSectionResponse,
  rewrittenText,
} from './projects.mapper';

describe('Projects Mapper', () => {
  describe('mapStatus', () => {
    it('should return valid status for known values', () => {
      expect(mapStatus('borrador')).toBe('borrador');
      expect(mapStatus('generando')).toBe('generando');
      expect(mapStatus('en_cola')).toBe('en_cola');
      expect(mapStatus('publicado')).toBe('publicado');
      expect(mapStatus('error')).toBe('error');
    });

    it('should default to borrador for unknown values', () => {
      expect(mapStatus('unknown')).toBe('borrador');
      expect(mapStatus('')).toBe('borrador');
      expect(mapStatus('invalid')).toBe('borrador');
    });
  });

  describe('mapTipoNivel', () => {
    it('should return valid tipoNivel for known values', () => {
      expect(mapTipoNivel('FP_BASICA')).toBe('FP_BASICA');
      expect(mapTipoNivel('CFGM_ESTETICA')).toBe('CFGM_ESTETICA');
      expect(mapTipoNivel('CFGM_PELUQUERIA')).toBe('CFGM_PELUQUERIA');
      expect(mapTipoNivel('DIVERSIFICACION_CURRICULAR')).toBe('DIVERSIFICACION_CURRICULAR');
    });

    it('should default to FP_BASICA for unknown values', () => {
      expect(mapTipoNivel('UNKNOWN')).toBe('FP_BASICA');
      expect(mapTipoNivel('')).toBe('FP_BASICA');
      expect(mapTipoNivel('invalid')).toBe('FP_BASICA');
    });
  });

  describe('fromProjectDto', () => {
    const baseDto = {
      _id: 'proj1',
      title: 'Test Project',
      status: 'borrador',
      tipoNivel: 'FP_BASICA',
      courseLevel: '1º',
      modules: ['mod1', 'mod2'],
      generatedContent: { rawText: 'content', modules: ['mod1'] },
      userId: 'u1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    };

    it('should map all fields correctly', () => {
      const result = fromProjectDto(baseDto);
      expect(result._id).toBe('proj1');
      expect(result.title).toBe('Test Project');
      expect(result.status).toBe('borrador');
      expect(result.tipoNivel).toBe('FP_BASICA');
      expect(result.courseLevel).toBe('1º');
      expect(result.modules).toEqual(['mod1', 'mod2']);
      expect(result.generatedContent).toBeDefined();
      expect(result.userId).toBe('u1');
    });

    it('should keep the generation error and AI metadata for the history', () => {
      const result = fromProjectDto({
        ...baseDto,
        status: 'error',
        error: 'Fallo',
        errorDetail: 'Timeout en Gemini',
        generationTimeMs: 1200,
        aiProvider: 'gemini',
        usedAiProvider: 'openrouter',
        usedModel: 'openai/gpt-6-luna',
      });
      expect(result.status).toBe('error');
      expect(result.error).toBe('Fallo');
      expect(result.errorDetail).toBe('Timeout en Gemini');
      expect(result.generationTimeMs).toBe(1200);
      expect(result.aiProvider).toBe('gemini');
      expect(result.usedAiProvider).toBe('openrouter');
      expect(result.usedModel).toBe('openai/gpt-6-luna');
    });

    it('should default title to "Sin título" when missing', () => {
      const dto = { ...baseDto, title: '' };
      const result = fromProjectDto(dto);
      expect(result.title).toBe('Sin título');
    });

    it('should default courseLevel to empty string when missing', () => {
      const dto = { ...baseDto, courseLevel: '' };
      const result = fromProjectDto(dto);
      expect(result.courseLevel).toBe('');
    });

    it('should handle non-array modules', () => {
      const dto = { ...baseDto, modules: 'not-array' as any };
      const result = fromProjectDto(dto);
      expect(result.modules).toEqual([]);
    });

    it('should handle null modules', () => {
      const dto = { ...baseDto, modules: null as any };
      const result = fromProjectDto(dto);
      expect(result.modules).toEqual([]);
    });

    it('should handle userId as object', () => {
      const dto = { ...baseDto, userId: { _id: 'u2', name: 'User 2' } };
      const result = fromProjectDto(dto);
      expect(result.userId).toEqual({ _id: 'u2', name: 'User 2' });
    });
  });

  describe('fromProjectDtoArray', () => {
    it('should map array of DTOs', () => {
      const dtos = [
        {
          _id: '1',
          title: 'P1',
          status: 'borrador',
          tipoNivel: 'FP_BASICA',
          courseLevel: '1º',
          modules: [],
          userId: 'u1',
          createdAt: '',
          updatedAt: '',
        },
        {
          _id: '2',
          title: 'P2',
          status: 'publicado',
          tipoNivel: 'CFGM_ESTETICA',
          courseLevel: '1º',
          modules: [],
          userId: 'u1',
          createdAt: '',
          updatedAt: '',
        },
      ];
      const result = fromProjectDtoArray(dtos);
      expect(result).toHaveLength(2);
      expect(result[0]._id).toBe('1');
      expect(result[1]._id).toBe('2');
    });

    it('should handle null/undefined input', () => {
      expect(fromProjectDtoArray(null as any)).toEqual([]);
      expect(fromProjectDtoArray(undefined as any)).toEqual([]);
    });
  });

  describe('fromGenerateProjectResponse', () => {
    it('should map response with message', () => {
      const dto = {
        project: {
          _id: '1',
          title: 'Test',
          status: 'borrador',
          tipoNivel: 'FP_BASICA',
          courseLevel: '1º',
          modules: [],
          userId: 'u1',
          createdAt: '',
          updatedAt: '',
        },
        message: 'Project generated',
      };
      const result = fromGenerateProjectResponse(dto);
      expect(result.project._id).toBe('1');
      expect(result.message).toBe('Project generated');
    });

    it('should handle missing message', () => {
      const dto = {
        project: {
          _id: '1',
          title: 'Test',
          status: 'borrador',
          tipoNivel: 'FP_BASICA',
          courseLevel: '1º',
          modules: [],
          userId: 'u1',
          createdAt: '',
          updatedAt: '',
        },
      };
      const result = fromGenerateProjectResponse(dto);
      expect(result.message).toBeUndefined();
    });
  });

  describe('fromFileUploadResponse', () => {
    it('should map file and message', () => {
      const dto = {
        file: {
          _id: 'f1',
          filename: 'test.pdf',
          originalName: 'test.pdf',
          mimeType: 'application/pdf',
          size: 1024,
          uploadedAt: '2024-01-01',
          projectId: 'p1',
        },
        message: 'Uploaded',
      };
      const result = fromFileUploadResponse(dto);
      expect(result.file._id).toBe('f1');
      expect(result.message).toBe('Uploaded');
    });
  });

  describe('fromImportDocxResponse', () => {
    it('should map project and message', () => {
      const dto = {
        project: {
          _id: '1',
          title: 'Imported',
          status: 'borrador',
          tipoNivel: 'FP_BASICA',
          courseLevel: '1º',
          modules: [],
          userId: 'u1',
          createdAt: '',
          updatedAt: '',
        },
        message: 'Imported',
      };
      const result = fromImportDocxResponse(dto);
      expect(result.project._id).toBe('1');
      expect(result.message).toBe('Imported');
    });
  });

  describe('fromRetryProjectResponse', () => {
    it('should map project and message', () => {
      const dto = {
        project: {
          _id: '1',
          title: 'Retried',
          status: 'borrador',
          tipoNivel: 'FP_BASICA',
          courseLevel: '1º',
          modules: [],
          userId: 'u1',
          createdAt: '',
          updatedAt: '',
        },
        message: 'Retried',
      };
      const result = fromRetryProjectResponse(dto);
      expect(result.project._id).toBe('1');
      expect(result.message).toBe('Retried');
    });
  });

  describe('fromProjectFileDto', () => {
    it('should map all file fields', () => {
      const dto = {
        _id: 'f1',
        filename: 'test.pdf',
        originalName: 'test.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        uploadedAt: '2024-01-01',
        projectId: 'p1',
      };
      const result = fromProjectFileDto(dto);
      expect(result._id).toBe('f1');
      expect(result.filename).toBe('test.pdf');
      expect(result.originalName).toBe('test.pdf');
      expect(result.mimeType).toBe('application/pdf');
      expect(result.size).toBe(1024);
      expect(result.uploadedAt).toBe('2024-01-01');
      expect(result.projectId).toBe('p1');
    });
  });

  describe('fromProjectFileDtoArray', () => {
    it('should map array of file DTOs', () => {
      const dtos = [
        {
          _id: 'f1',
          filename: 'a.pdf',
          originalName: 'a.pdf',
          mimeType: 'pdf',
          size: 100,
          uploadedAt: '2024-01-01',
          projectId: 'p1',
        },
        {
          _id: 'f2',
          filename: 'b.pdf',
          originalName: 'b.pdf',
          mimeType: 'pdf',
          size: 200,
          uploadedAt: '2024-01-02',
          projectId: 'p1',
        },
      ];
      const result = fromProjectFileDtoArray(dtos);
      expect(result).toHaveLength(2);
    });

    it('should handle null/undefined', () => {
      expect(fromProjectFileDtoArray(null as any)).toEqual([]);
      expect(fromProjectFileDtoArray(undefined as any)).toEqual([]);
    });
  });

  describe('toCreateProjectPayload', () => {
    it('should return payload with all fields', () => {
      const payload = {
        selectedRas: ['RA1'],
        methodology: 'ABP',
        modules: ['mod1'],
        tipoNivel: 'FP_BASICA' as const,
        language: 'castellano',
        aiProvider: 'gemini' as const,
        aiModel: 'gemini-3.8-flash',
        courseLevel: '1º',
        title: 'Test',
        extraInstructions: 'extra',
      };
      const result = toCreateProjectPayload(payload);
      expect(result).toEqual(payload);
    });
  });

  describe('toUpdateProjectPayload', () => {
    it('should create payload with rawText and status', () => {
      const result = toUpdateProjectPayload('content', 'publicado');
      expect(result).toEqual({ rawText: 'content', status: 'publicado' });
    });
  });

  describe('toRewriteSectionPayload', () => {
    it('should create payload with all fields', () => {
      const result = toRewriteSectionPayload('context', 'instruction', 'gemini', 'model');
      expect(result).toEqual({
        context: 'context',
        instruction: 'instruction',
        aiProvider: 'gemini',
        aiModel: 'model',
      });
    });
  });

  describe('toFileUploadFormData', () => {
    it('should create FormData with file', () => {
      const file = new File(['content'], 'test.txt');
      const formData = toFileUploadFormData(file, 'p1');
      expect(formData.get('file')).toBe(file);
    });
  });

  describe('toImportDocxFormData', () => {
    it('should create FormData with file', () => {
      const file = new File(['content'], 'test.docx');
      const formData = toImportDocxFormData(file, 'p1');
      expect(formData.get('file')).toBe(file);
    });
  });

  describe('fromRewriteSectionResponse', () => {
    it('should extract rawText from an object response', () => {
      expect(fromRewriteSectionResponse({ rawText: 'texto' })).toBe('texto');
    });

    it('should pass through plain text and objects without rawText', () => {
      const result = { newText: 'nuevo', provider: 'gemini' as const };
      expect(fromRewriteSectionResponse('plano')).toBe('plano');
      expect(fromRewriteSectionResponse(result)).toBe(result);
    });
  });

  describe('rewrittenText', () => {
    it('should return plain text responses as they are', () => {
      expect(rewrittenText('plano')).toBe('plano');
    });

    it('should prefer newText, then rewrittenPart, then an empty string', () => {
      expect(rewrittenText({ newText: 'nuevo', rewrittenPart: 'parte' })).toBe('nuevo');
      expect(rewrittenText({ rewrittenPart: 'parte' })).toBe('parte');
      expect(rewrittenText({})).toBe('');
    });
  });
});
