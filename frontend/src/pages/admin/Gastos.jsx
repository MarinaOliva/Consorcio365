import {
  AlertTriangle,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  FileText,
  Plus,
  ReceiptText,
} from "lucide-react";

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import Button from "../../components/ui/Button";
import CargarGastoManualModal from "../../components/admin/CargarGastoManualModal";
import SuccessModal from "../../components/shared/SuccessModal";

import { useGastosAdmin } from "../../hooks/useGastosAdmin";

const CLASE_CAMPO_FILTRO = `
  w-auto rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function formatearMonto(valor) {
  return new Intl.NumberFormat("es-AR", {
	style: "currency",
	currency: "ARS",
	maximumFractionDigits: 0,
  }).format(valor);
}

function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

function GastoTipoBadge({ tipo }) {
  const normalizado = normalizarTexto(tipo);

  const estilos = {
	reactivo: "border-secondary bg-secondary text-white",
	preventivo: "border-emerald-500 bg-emerald-500 text-white",
	manual: "border-primary bg-primary text-white",
  };

  return (
	<span
  	className={`
    	inline-flex items-center rounded-full border px-2 py-0.5
    	text-[10px] font-bold uppercase
    	${estilos[normalizado] || "border-border bg-white text-textMuted"}
  	`}
	>
  	{tipo}
	</span>
  );
}

function ResumenGastoCard({
  titulo,
  valor,
  descripcion,
  icon: Icon,
  iconClassName = "text-primary",
}) {
  return (
	<div
  	className="
    	rounded-xl border border-secondary/70 bg-white p-4
    	shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
  	"
	>
  	<div className="flex items-start justify-between gap-3">
    	<p className="text-xs font-bold text-textMuted">{titulo}</p>
    	<Icon size={22} className={iconClassName} />
  	</div>

  	<p className="mt-4 text-3xl font-bold leading-none text-primary">
    	{valor}
  	</p>

  	{descripcion && (
    	<p className="mt-3 text-[11px] font-bold text-textMuted">
      	{descripcion}
    	</p>
  	)}
	</div>
  );
}

function GastosAdmin() {

  const {
	gastos,
	gastosFiltrados,
	loading,
	error,
	resumen,

	tipoFiltro,
	setTipoFiltro,
	mesFiltro,
	setMesFiltro,
	MESES_DEL_ANIO,

	isCargarGastoManualOpen,
	abrirModalCargarGastoManual,
	cerrarModalCargarGastoManual,
	guardarGastoManual,

	isGastoCreadoOpen,
	cerrarGastoCreado,
  } = useGastosAdmin();

  const handleVerComprobante = (gasto) => {
	if (!gasto.comprobante) {
  	alert("Este gasto no tiene comprobante adjunto.");
  	return;
	}
	window.open(gasto.comprobante, "_blank", "noopener,noreferrer");
  };

  return (
	<ContenedorPanelPorRol
  	titulo="Libro de Gastos"
  	subtitulo="Gestión y seguimiento de gastos del consorcio"
	>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<div className="flex flex-wrap items-center justify-end gap-3">
			<Button
				variant="elevated"
				size="sm"
				type="button"
				onClick={abrirModalCargarGastoManual}
				className="gap-2"
			>
				<Plus size={15} />
				Cargar gasto manual
			</Button>
    	</div>

    	{loading && (
      	<p className="py-6 text-sm text-textMuted">Cargando gastos...</p>
    	)}

    	{error && !loading && (
      	<div className="rounded-md border border-red-200 bg-red-50 p-4">
        	<p className="text-sm font-semibold text-red-600">{error}</p>
      	</div>
    	)}

    	{!loading && !error && (
			<>
				{/* Resumen */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<ResumenGastoCard
						titulo="Total filtrado"
						valor={formatearMonto(resumen.total)}
						descripcion={`${gastosFiltrados.length} gastos`}
						icon={DollarSign}
					/>

					<ResumenGastoCard
						titulo="Gastos Reactivos"
						valor={formatearMonto(resumen.reactivos)}
						descripcion={`${resumen.porcentajeReactivos}% del total`}
						icon={AlertTriangle}
					/>

					<ResumenGastoCard
						titulo="Gastos Preventivos"
						valor={formatearMonto(resumen.preventivos)}
						descripcion={`${resumen.porcentajePreventivos}% del total`}
						icon={CalendarCheck}
					/>

					<ResumenGastoCard
						titulo="Gastos Manuales"
						valor={formatearMonto(resumen.manuales)}
						descripcion={`${resumen.porcentajeManuales}% del total`}
						icon={FileText}
					/>
				</div>

				{/* Filtros */}
				<div className="flex flex-row flex-wrap gap-3">
					<select
						value={tipoFiltro}
						onChange={(e) => setTipoFiltro(e.target.value)}
						className={CLASE_CAMPO_FILTRO}
					>
						<option value="Todos">Tipo: Todos</option>
						<option value="Reactivo">Reactivo</option>
						<option value="Preventivo">Preventivo</option>
						<option value="Manual">Manual</option>
					</select>

					<div className="relative">
						<CalendarDays
						size={15}
						className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
						/>

						<select
						value={mesFiltro}
						onChange={(e) => setMesFiltro(e.target.value)}
						className={`${CLASE_CAMPO_FILTRO} min-w-[170px] pl-9`}
						>
							<option value="Todos">Todos los meses</option>
							{MESES_DEL_ANIO.map((mes) => (
								<option key={mes} value={mes}>
								{mes}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Tabla */}
				<div
					className="
						rounded-xl border border-secondary/70 bg-white p-4
						shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
					"
				>
					<div className="overflow-x-auto">
						<table className="w-full min-w-[999px] table-auto border-collapse text-xs">
							<colgroup>
								<col className="w-[10%]" />
								<col className="w-[24%]" />
								<col className="w-[13%]" />
								<col className="w-[16%]" />
								<col className="w-[11%]" />
								<col className="w-[10%]" />
								<col className="w-[16%]" />
							</colgroup>

							<thead>
								<tr className="bg-secondary text-left text-[11px] text-white">
								<th className="px-3 py-3 font-bold">Fecha</th>
								<th className="px-3 py-3 font-bold">Concepto</th>
								<th className="px-3 py-3 font-bold">Tipo</th>
								<th className="px-3 py-3 font-bold">Proveedor</th>
								<th className="px-3 py-3 font-bold">Monto</th>
								<th className="px-3 py-3 text-center font-bold">
									Comprobante
								</th>
								<th className="px-3 py-3 text-center font-bold">Origen</th>
								</tr>
							</thead>

							<tbody>
								{gastosFiltrados.length > 0 ? (
								gastosFiltrados.map((gasto) => (
									<tr
									key={gasto.id}
									className="
										border-b border-border/60 last:border-b-0
										transition hover:bg-primarySoft/20
									"
									>
									<td className="px-3 py-3 font-medium text-textMain">
										{gasto.fecha}
									</td>

									<td className="px-3 py-3 text-textMain">
										<span className="block truncate font-medium">
										{gasto.concepto}
										</span>
									</td>

									<td className="px-3 py-3">
										<GastoTipoBadge tipo={gasto.tipo} />
									</td>

									<td className="px-3 py-3 text-textMain">
										<span className="block truncate">
										{gasto.proveedor}
										</span>
									</td>

									<td className="px-3 py-3">
										<span className="font-bold text-primary">
										{formatearMonto(gasto.monto)}
										</span>
									</td>

									<td className="px-3 py-3 text-center">
										<button
										type="button"
										onClick={() => handleVerComprobante(gasto)}
										aria-label={`Ver comprobante de ${gasto.concepto}`}
										disabled={!gasto.comprobante}
										className={`
											mx-auto flex rounded-md p-1.5 transition
											${
											gasto.comprobante
												? "text-primary hover:bg-primarySoft"
												: "cursor-not-allowed text-textMuted opacity-40"
											}
										`}
										>
										<ReceiptText size={16} />
										</button>
									</td>

									<td className="px-3 py-3 text-center">
										<span className="font-bold text-primary">
										{gasto.origen}
										</span>
									</td>
									</tr>
								))
								) : (
								<tr>
									<td colSpan={7} className="px-4 py-8 text-center">
									<p className="text-sm font-semibold text-textMain">
										No se encontraron gastos.
									</p>
									<p className="mt-1 text-xs text-textMuted">
										Probá ajustar los filtros seleccionados.
									</p>
									</td>
								</tr>
								)}
							</tbody>
						</table>
					</div>

					<div
						className="
						mt-3 rounded-lg border border-border/70 bg-surfaceSoft/50
						px-4 py-2
						"
					>
						<p className="text-xs font-medium text-primary">
						Mostrando {gastosFiltrados.length} de {gastos.length} gastos
						</p>
					</div>
				</div>
			</>
    	)}
  	</section>

  	<CargarGastoManualModal
    	isOpen={isCargarGastoManualOpen}
    	onClose={cerrarModalCargarGastoManual}
    	onSave={guardarGastoManual}
  	/>

  	<SuccessModal
    	isOpen={isGastoCreadoOpen}
    	onClose={cerrarGastoCreado}
    	message="Gasto cargado con éxito"
  	/>
	</ContenedorPanelPorRol>
  );
}

export default GastosAdmin;