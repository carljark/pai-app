import { Injectable, Injector, computed, inject } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { NivelesService } from '../../../services/niveles.service';
import type { AfinidadEso } from '../models/afinidad-eso.model';
import { CESTA_VACIA, type CestaEstado, type ClavesPorUnidad } from '../models/cesta.model';
import type { IntermodularConnection } from '../models/mapa-intermodular.model';
import type { CriteriosDeMateria } from '../utils/afinidad-seleccion';
import * as cesta from '../utils/cesta';
import { comunesEso, criteriosDeFicha } from '../utils/cesta-eso';
import { comunesFp, rasDeConexion, referenciasDeGrupos } from '../utils/cesta-fp';
import { AfinidadProyectoService } from './afinidad-proyecto.service';
import { AfinidadesEsoFacade } from './afinidades-eso.facade';
import { CestaDropService } from './cesta-drop.service';
import { CestaService } from './cesta.service';
import { MapaIntermodularFacade } from './mapa-intermodular.facade';
import { MapaProyectoService } from './mapa-proyecto.service';
import { PlappSoundService } from './plapp-sound.service';

/**
 * Cesta de la pestaña activa del mapa: materias (ESO) o módulos (FP) con los criterios o RA
 * que se quieren llevar juntos al generador.
 */
@Injectable({ providedIn: 'root' })
export class CestaFacade {
  private store = inject(CestaService);
  private mapa = inject(MapaIntermodularFacade);
  private afinidades = inject(AfinidadesEsoFacade);
  private niveles = inject(NivelesService);
  private layout = inject(LayoutService);
  private drop = inject(CestaDropService);
  private sonido = inject(PlappSoundService);
  private injector = inject(Injector);

  isCa = computed(() => this.layout.language() === 'catalan');
  tab = computed(() => this.mapa.activeTab());
  esEso = computed(() => this.niveles.mapaTab(this.tab())?.formato === 'afinidades');

  private estado = computed(() => this.store.estado(this.tab()));
  private comunes = computed(() => {
    const e = this.estado();
    const enCesta = cesta.todasLasUnidades(e);
    if (this.esEso()) return comunesEso(this.fichas(), enCesta, e.unidades);
    return comunesFp(this.mapa.modules(), enCesta, e.unidades);
  });

  grupos = computed(() => cesta.agrupar(this.estado(), this.comunes()));
  totalClaves = computed(() => this.grupos().reduce((n, g) => n + g.claves.length, 0));

  /** Nombre de la materia o del módulo en el idioma activo. */
  nombre(unidad: string): string {
    if (this.esEso()) return this.afinidades.materiaName(unidad, this.isCa());
    const m = this.mapa.modules().find((x) => x.code === unidad);
    if (!m) return unidad;
    return `${m.code} · ${this.isCa() ? m.name_ca : m.name_es}`;
  }

  /** Sigla del criterio («CE 1.1» / «CA 1.1») o código del RA. */
  etiqueta(clave: string): string {
    return this.esEso() ? `${this.isCa() ? 'CA' : 'CE'} ${clave}` : clave;
  }

  /** Bola soltada en la cesta desde el mapa mental. */
  meterUnidad(unidad: string): void {
    this.cambiar((e) => cesta.anadirUnidad(e, unidad));
    this.drop.recibir();
    this.sonido.plapp();
  }

  anadirFicha(ficha: AfinidadEso): void {
    this.cambiar((e) => cesta.anadirClaves(e, criteriosDeFicha(ficha)));
  }

  fichaEnCesta(ficha: AfinidadEso): boolean {
    return cesta.contieneClaves(this.grupos(), criteriosDeFicha(ficha));
  }

  /** Con `conexion`, sus dos RA; sin ella, el RA activo y los destinos de sus conexiones. */
  anadirConexion(conexion?: IntermodularConnection): void {
    this.cambiar((e) => cesta.anadirClaves(e, this.rasActivos(conexion)));
  }

  conexionEnCesta(conexion?: IntermodularConnection): boolean {
    return cesta.contieneClaves(this.grupos(), this.rasActivos(conexion));
  }

  quitarUnidad(unidad: string): void {
    this.cambiar((e) => cesta.quitarUnidad(e, unidad));
  }

  quitarClave(unidad: string, clave: string): void {
    this.cambiar((e) => cesta.quitarClave(e, unidad, clave));
  }

  vaciar(): void {
    this.cambiar(() => CESTA_VACIA);
  }

  /** Abre el generador con todo el contenido de la cesta. */
  crearProyecto(): void {
    const grupos = this.grupos().filter((g) => g.claves.length > 0);
    if (this.esEso()) {
      const pares = grupos.map((g): CriteriosDeMateria => [g.unidad, g.claves]);
      void this.injector.get(AfinidadProyectoService).crearDesdeCriterios(pares, this.tab());
      return;
    }
    const refs = referenciasDeGrupos(grupos, this.mapa.modules());
    this.injector.get(MapaProyectoService).crearDesdeReferencias(refs);
  }

  private fichas(): AfinidadEso[] {
    return this.afinidades.data()?.afinidades ?? [];
  }

  /** RA de origen activo y RA de destino de la conexión (o de todas las filtradas). */
  private rasActivos(conexion?: IntermodularConnection): ClavesPorUnidad {
    const modulo = this.mapa.selectedModule();
    const ra = this.mapa.selectedRa();
    if (!modulo || !ra) return {};
    const conexiones = conexion ? [conexion] : this.mapa.filteredConnections();
    const porModulo: ClavesPorUnidad = { [modulo.code]: [ra.code] };
    for (const c of conexiones) cesta.unirClaves(porModulo, rasDeConexion(modulo.code, ra.code, c));
    return porModulo;
  }

  private cambiar(cambio: (estado: CestaEstado) => CestaEstado): void {
    this.store.actualizar(this.tab(), cambio);
  }
}
