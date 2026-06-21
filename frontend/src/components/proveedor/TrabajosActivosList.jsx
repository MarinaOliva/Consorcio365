import { Wrench, MapPin, Calendar, DollarSign, Eye } from "lucide-react";
import Card from "../ui/Card";
import StatusBadge from "../dashboard/StatusBadge";

function TrabajoRow({ trabajo, onVerDetalle }) {
  // Color del icono según estado
  const iconBg =
	trabajo.estado?.toLowerCase() === "en progreso"
  	? "bg-blue-50 text-blue-500"
  	: "bg-orange-50 text-orange-500";

  return (
		<div className="rounded-lg border border-border/70 bg-white p-3">
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				{/* Izquierda: icono + info */}
				<div className="flex items-center gap-3 min-w-0 flex-1">
					<div
						className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
					>
						<Wrench size={18} />
					</div>

					<div className="min-w-0">
						<p className="truncate text-sm font-semibold text-textMain">
						{trabajo.titulo}
						</p>

						<div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-textMuted">
							<span className="inline-flex items-center gap-1">
								<MapPin size={11} />
								{trabajo.ubicacion}
							</span>
							<span className="inline-flex items-center gap-1">
								<Calendar size={11} />
								Asignado: {trabajo.fechaAsignacion}
							</span>
							<span className="inline-flex items-center gap-1">
								<DollarSign size={11} />
								${trabajo.monto.toLocaleString("es-AR")}
							</span>
						</div>
					</div>
				</div>

				{/* Derecha: estado + acción */}
				<div className="flex shrink-0 items-center gap-3">
					<StatusBadge status={trabajo.estado} />

					<button
						type="button"
						onClick={() => onVerDetalle(trabajo)}
						className="
						rounded-md p-2 text-primary transition
						hover:bg-primarySoft hover:text-primaryHover
						"
						aria-label={`Ver detalle del trabajo ${trabajo.titulo}`}
					>
						<Eye size={18} />
					</button>
				</div>
			</div>
		</div>
  	);
}

function TrabajosActivosList({ trabajos = [], onVerDetalle = () => {} }) {
  return (
    <Card className="border-secondary/70 bg-white p-4 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
      <h2 className="mb-4 text-center text-base font-bold text-primary">
        Trabajos Activos
      </h2>

      <div className="space-y-2.5">
			{trabajos.map((trabajo) => (
			<TrabajoRow
				key={trabajo.id}
				trabajo={trabajo}
				onVerDetalle={onVerDetalle}
			/>
			))}
      </div>
    </Card>
  );
}

export default TrabajosActivosList;