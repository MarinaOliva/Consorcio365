import { useEffect, useMemo, useState } from "react";
import {
  TriangleAlert,
  Wrench,
  BadgeDollarSign,
  Settings,
} from "lucide-react";

import { getIncidencias } from "../services/incidenciasService";
import { getTrabajos } from "../services/trabajosService";
import { getGastos } from "../services/gastosService";
import { getInstancias } from "../services/mantenimientoService";

function formatearFecha(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-AR");
}

function formatearMontoCorto(valor) {
  const n = Number(valor) || 0;
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

function formatearMontoFull(valor) {
  return new Intl.NumberFormat("es-AR", {
	style: "currency",
	currency: "ARS",
	maximumFractionDigits: 0,
  }).format(Number(valor) || 0);
}

// Etiquetas visuales para estado/tipo
const ESTADO_INCIDENCIA = {
  ABIERTA: "ABIERTA",
  EN_PROGRESO: "EN PROGRESO",
  RESUELTA: "RESUELTA",
  CERRADA: "CERRADA",
  RECHAZADA: "RECHAZADA",
  CANCELADA: "CANCELADA",
};

const ETIQUETA_TIPO_GASTO = {
  CORRECTIVO: "Reactivo",
  PREVENTIVO: "Preventivo",
  MANUAL: "Manual",
};

export function usePanelAdmin() {
  const [incidencias, setIncidencias] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [instancias, setInstancias] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
	let activo = true;

	async function cargar() {
  	try {
    	setLoading(true);
    	setError("");

    	const [incData, trabData, gastosData, instProgramadas, instEnCurso] =
      	await Promise.all([
        	getIncidencias(),
        	getTrabajos(),
        	getGastos(),
        	getInstancias({ estado: "PROGRAMADA" }),
        	getInstancias({ estado: "EN_CURSO" }),
      	]);

    	if (!activo) return;

    	setIncidencias(incData || []);
    	setTrabajos(trabData || []);
    	setGastos(gastosData || []);
    	setInstancias([...(instProgramadas || []), ...(instEnCurso || [])]);
  	} catch (err) {
    	if (!activo) return;
    	const msg =
      	err?.response?.data?.message ||
      	err?.message ||
      	"No se pudieron cargar los datos del panel";
    	setError(msg);
  	} finally {
    	if (activo) setLoading(false);
  	}
	}

	cargar();
	return () => {
  	activo = false;
	};
  }, []);

  // Estadísticas del mes
  const stats = useMemo(() => {
	const inicioMes = new Date();
	inicioMes.setDate(1);
	inicioMes.setHours(0, 0, 0, 0);

	const incidenciasAbiertas = incidencias.filter(
  	(i) => i.estado === "ABIERTA"
	).length;

	const trabajosEnProgreso = trabajos.filter(
  	(t) => t.estado === "EN_EJECUCION" || t.estado === "ASIGNADO"
	).length;

	const gastosMes = gastos
  	.filter((g) => {
    	const f = g.fecha ? new Date(g.fecha) : null;
    	return f && f >= inicioMes;
  	})
  	.reduce((acc, g) => acc + (Number(g.monto) || 0), 0);

	return [
  	{
    	id: 1,
    	title: "Incidencias Abiertas",
    	value: String(incidenciasAbiertas),
    	trend: "",
    	trendType: "",
    	icon: TriangleAlert,
  	},
  	{
    	id: 2,
    	title: "Trabajos en Progreso",
    	value: String(trabajosEnProgreso),
    	trend: "",
    	trendType: "",
    	icon: Wrench,
  	},
  	{
    	id: 3,
    	title: "Gastos del Mes",
    	value: formatearMontoCorto(gastosMes),
    	trend: "",
    	trendType: "",
    	icon: BadgeDollarSign,
  	},
	];
  }, [incidencias, trabajos, gastos]);

  // Incidencias recientes (últimas 3)
  const incidenciasRecientes = useMemo(() => {
	return incidencias
  	.slice()
  	.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  	.slice(0, 3)
  	.map((inc) => ({
    	id: inc._id,
    	title: inc.titulo,
    	building: inc.edificioId?.nombre || "—",
    	unit: inc.espacio || "—",
    	status: ESTADO_INCIDENCIA[inc.estado] || inc.estado,
    	date: formatearFecha(inc.createdAt),
  	}));
  }, [incidencias]);

  // Próximos mantenimientos (instancias programadas / en curso)
 const proximosMantenimientos = useMemo(() => {
  return instancias
	.filter((inst) => {
  	// Solo instancias cuyo plan esté activo
  	const plan = inst.planId;
  	return plan && plan.activo === true;
	})
	.sort(
  	(a, b) => new Date(a.fechaProgramada) - new Date(b.fechaProgramada)
	)
	.slice(0, 3)
	.map((inst) => {
  	const plan = inst.planId;
  	const edificio = plan?.edificioId?.nombre || "Edificio";
  	const fecha = formatearFecha(inst.fechaProgramada);
  	return {
    	id: inst._id,
    	title: plan?.tarea || "Mantenimiento",
    	subtitle: `${edificio} • ${fecha}`,
    	description: `Estado: ${
      	inst.estado === "PROGRAMADA" ? "Programada" : "En curso"
    	}`,
    	icon: Settings,
  	};
	});
}, [instancias]);

  // Últimos gastos (top 3 por fecha)
  const ultimosGastos = useMemo(() => {
	return gastos
  	.slice()
  	.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  	.slice(0, 3)
  	.map((g) => ({
    	id: g._id,
    	description: g.concepto || "Sin descripción",
    	amount: formatearMontoFull(g.monto),
    	origin: ETIQUETA_TIPO_GASTO[g.tipo] || g.tipo,
    	date: formatearFecha(g.fecha),
  	}));
  }, [gastos]);

  return {
	loading,
	error,
	stats,
	incidenciasRecientes,
	proximosMantenimientos,
	ultimosGastos,
  };
}

