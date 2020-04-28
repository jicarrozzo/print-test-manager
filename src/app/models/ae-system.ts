/**
 * 
 * Namespace generico para clases transversales 
 * 
 * @version 1.0.0
 * 
 */
export namespace Agilis {
	/** Identificadores de Apps */
	export enum AppIdentifier {
		Argos = 1,
		Jano = 2,
		Hermes = 3,
		Frixo = 4,
		Hefesto = 5,
		Prometheus = 6
	}

	/** Identificadores de modulos de licencias */
	export enum AppModulos {
		FICS_REST = 67,
		AMS_REST = 74,
		PXP_REST = 68,
		ATS_REST = 80,
		MOBILE_LAYER = 59,
		HERMES = 71,
		FRIXO = 72,
		HEFESTO = 75,
		PROMETHEUS = 76
	}

	/**  Operaciones basicas  */
	export enum Operaciones {
		ALTA = 0,
		BAJA = 1,
		MODIFICACION = 2
	}

	/** Roles segun producto */
	export enum Roles {
		/** Rol que permite acceder a empresas de FICS */
		FICS_TRAFICO_ADMINISTRAR_EMPRESA = 44
	}
	/**
   * Clase q se utiliza para enviar datos a FICS.Rest
   */
	export class WebClientParams {
		constructor(public method: string, public jsonparams: string) {}
	}

	/**
	 * Clase para componer url de llamadas post/get
	 */
	export interface UrlCompose {
		url: string;
		controller: string;
	}

	/**
   * Interfaz de errores de agilis layer
   */
	export class Error {
		Entity: string;
		ErrorCode: string;
		HttpStatusCode: number;
		SpMessage: string;
		InvariantMessage: string;
		DeveloperMessage: string;
		EntityDetail?: any;
		constructor() {}
	}

	export interface Licencia {
		LicenciaID: number;
		Producto: Producto;
		ProductoID: number;
		ProductoModulo: ProductoModulo;
		ProductoModuloID: number;
		ProductoNombre: string;
		ProductoModuloNombre: string;
		Cliente: Cliente;
		Numero: string;
		TipoLicencia: number;
		SubTipoLicencia: number;
		FechaVencimiento: string;
		FechaActivacion: null | string;
		URL: string;
		URL_Mirror: string;
		Estado: number;
		TipoLicenciamiento: number;
		Cantidad: null;
	}
	export interface Producto {
		ProductoID: number;
		Nombre: string;
	}
	export interface ProductoModulo {
		ProductoModuloID: number;
		Nombre: string;
	}
	export interface Cliente {
		ClienteID: number;
		Nombre: string;
		NombreCompleto: string;
		Logo: string;
	}
}
