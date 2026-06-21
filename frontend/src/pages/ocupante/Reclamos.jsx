import { CalendarDays, Eye, Plus, Wrench, X } from "lucide-react";

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import Button from "../../components/ui/Button";
import SuccessModal from "../../components/shared/SuccessModal";
import ModalNuevoReclamo from "../../components/ocupante/ModalNuevoReclamo";
import BadgeEstadoReclamo from "../../components/ocupante/BadgeEstadoReclamo";
import DetalleReclamoOcupante from "../../components/ocupante/DetalleReclamoOcupante";

import { useReclamosOcupante } from "../../hooks/useReclamosOcupante";

function obtenerClaseBorde(estado) {
  const valor = String(estado || "").toUpperCase().trim();
  if (valor === "ABIERTA") return "border-l-red-400";
  if (valor === "EN_PROGRESO") return "border-l-blue-400";
  if (valor === "RESUELTA") return "border-l-emerald-400";
  if (valor === "CERRADA") return "border-l-slate-400";
  if (valor === "RECHAZADA") return "border-l-orange-400";
  if (valor === "CANCELADA") return "border-l-slate-400";
  return "border-l-slate-300";
}

function ReclamosOcupante() {
  const {
	reclamosFiltrados,
	loading,
	error,
	unidadActual,

	estadoFiltro,
	setEstadoFiltro,

	reclamoSeleccionado,
	abrirDetalleReclamo,
	cerrarDetalleReclamo,

	isNuevoReclamoOpen,
	handleAbrirNuevoReclamo,
	handleCerrarNuevoReclamo,
	formReclamo,
	handleChangeReclamo,
	handleCrearReclamo,

	isSuccessOpen,
	cerrarSuccess,
  } = useReclamosOcupante();

  const subtitulo = reclamoSeleccionado
	? `Detalle de reclamo > ID #${String(reclamoSeleccionado.id).slice(-4)}`
	: `${unidadActual.edificio}`;

  if (reclamoSeleccionado) {
	return (
  	<ContenedorPanelPorRol titulo="Mis Reclamos" subtitulo={subtitulo}>
    	<DetalleReclamoOcupante
      	reclamo={reclamoSeleccionado}
      	onVolver={cerrarDetalleReclamo}
    	/>

    	<ModalNuevoReclamo
      	isOpen={isNuevoReclamoOpen}
      	onClose={handleCerrarNuevoReclamo}
      	onCreate={handleCrearReclamo}
      	form={formReclamo}
      	onChange={handleChangeReclamo}
      	unidadActual={unidadActual}
    	/>

    	<SuccessModal
      	isOpen={isSuccessOpen}
      	onClose={cerrarSuccess}
      	message="Su reclamo ha sido creado con éxito"
    	/>
  	</ContenedorPanelPorRol>
	);
  }

  return (
	<ContenedorPanelPorRol titulo="Mis Reclamos" subtitulo={subtitulo}>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<div className="flex flex-wrap items-center justify-end gap-3">
      	<Button
        	variant="elevated"
        	size="sm"
        	type="button"
        	onClick={handleAbrirNuevoReclamo}
        	className="gap-2"
      	>
        	<Plus size={15} />
        	Nuevo Reclamo
      	</Button>
    	</div>

    	{loading && (
      	<p className="py-6 text-sm text-textMuted">Cargando reclamos...</p>
    	)}

    	{error && !loading && (
      	<div className="rounded-md border border-red-200 bg-red-50 p-4">
        	<p className="text-sm font-semibold text-red-600">{error}</p>
      	</div>
    	)}

    	{!loading && !error && (
      	<div className="rounded-xl border border-secondary/70 bg-white p-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
        	<div className="mb-5">
          	<select
            	value={estadoFiltro}
            	onChange={(e) => setEstadoFiltro(e.target.value)}
            	className="
              	rounded-lg border border-border bg-white
              	px-4 py-2 text-sm text-textMain
              	outline-none transition
              	focus:border-primary focus:ring-2 focus:ring-primary/20
            	"
          	>
            	<option value="Todos">Estado: Todos</option>
            	<option value="ABIERTA">Abierta</option>
            	<option value="EN_PROGRESO">En progreso</option>
            	<option value="RESUELTA">Resuelta</option>
            	<option value="CERRADA">Cerrada</option>
            	<option value="RECHAZADA">Rechazada</option>
            	<option value="CANCELADA">Cancelada</option>
          	</select>
        	</div>

        	<div className="space-y-4">
          	{reclamosFiltrados.length > 0 ? (
            	reclamosFiltrados.map((reclamo) => (
              	<div
                	key={reclamo.id}
                	className={`
                  	rounded-xl border border-border/80 border-l-4
                  	bg-surfaceSoft/55 px-5 py-5
                  	${obtenerClaseBorde(reclamo.estado)}
                	`}
              	>
                	<div className="flex flex-wrap items-start justify-between gap-4">
                  	<div className="min-w-0 flex-1">
                    	<div className="flex flex-wrap items-center gap-3">
                      	<p className="truncate text-[17px] font-medium text-textMain">
                        	{reclamo.titulo}
                      	</p>
                      	<BadgeEstadoReclamo estado={reclamo.estado} />
                    	</div>

                    	<div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-textMuted">
                      	<p className="flex items-center gap-2">
                        	<CalendarDays size={14} />
                        	{reclamo.fecha}
                      	</p>

                      	<p className="flex items-center gap-2">
                        	{reclamo.trabajoAsociado === "Sin trabajo asociado" ? (
                          	<X size={14} />
                        	) : (
                          	<Wrench size={14} className="text-primary" />
                        	)}
                        	<span
                          	className={
                            	reclamo.trabajoAsociado === "Sin trabajo asociado"
                              	? "text-textMuted"
                              	: "font-medium text-primary"
                          	}
                        	>
                          	{reclamo.trabajoAsociado}
                        	</span>
                      	</p>
                    	</div>
                  	</div>

                  	<button
                    	type="button"
                    	onClick={() => abrirDetalleReclamo(reclamo)}
                    	className="
                      	rounded-md p-2 text-primary transition
                      	hover:bg-primarySoft hover:text-primaryHover
                    	"
                    	aria-label={`Ver detalle del reclamo ${reclamo.id}`}
                  	>
                    	<Eye size={19} />
                  	</button>
                	</div>
              	</div>
            	))
          	) : (
            	<div className="py-8 text-center">
              	<p className="text-sm font-semibold text-textMain">
                	No se encontraron reclamos.
              	</p>
              	<p className="mt-1 text-xs text-textMuted">
                	Probá cambiar el filtro o crear un nuevo reclamo.
              	</p>
            	</div>
          	)}
        	</div>
      	</div>
    	)}
  	</section>

  	<ModalNuevoReclamo
    	isOpen={isNuevoReclamoOpen}
    	onClose={handleCerrarNuevoReclamo}
    	onCreate={handleCrearReclamo}
    	form={formReclamo}
    	onChange={handleChangeReclamo}
    	unidadActual={unidadActual}
  	/>

  	<SuccessModal
    	isOpen={isSuccessOpen}
    	onClose={cerrarSuccess}
    	message="Su reclamo ha sido creado con éxito"
  	/>
	</ContenedorPanelPorRol>
  );
}

export default ReclamosOcupante;

