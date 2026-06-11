import { useMemo, useState } from "react";
import { Eye, Pencil, ArrowLeft, UserCircle, CircleAlert } from "lucide-react";
import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import SectionCard from "../../components/dashboard/SectionCard";
import Button from "../../components/ui/Button";
import { unidadesAdminMock } from "../../data/unidadesAdminData";
import SuccessModal from "../../components/shared/SuccessModal";

const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function EstadoBadge({ estado }) {
  const normalizado = estado?.toLowerCase();

  const estilos = {
    ocupada: "border-emerald-400 bg-emerald-50 text-emerald-600",
    desocupada: "border-slate-400 bg-slate-100 text-slate-500",

    abierta: "border-red-400 bg-red-50 text-red-500",
    resuelta: "border-emerald-400 bg-emerald-50 text-emerald-600",
    cerrada: "border-slate-400 bg-slate-100 text-slate-500",

    vigente: "border-emerald-400 bg-emerald-50 text-emerald-600",
    finalizado: "border-slate-400 bg-slate-100 text-slate-500",

    propietario: "border-cyan-400 bg-cyan-50 text-cyan-700",
    inquilino: "border-primary/40 bg-primary/10 text-primary",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase
        ${estilos[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {estado}
    </span>
  );
}

function BotonIcono({ children, onClick, label, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        rounded-md p-1.5 transition
        ${
          danger
            ? "text-textMuted hover:bg-red-100 hover:text-red-500"
            : "text-textMuted hover:bg-primarySoft hover:text-primary"
        }
      `}
    >
      {children}
    </button>
  );
}

function InfoBasicaItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-textMuted">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-textMain">{value}</p>
    </div>
  );
}

function CampoEditable({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold text-textMuted">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="
          w-full rounded-lg border border-border bg-white
          px-3 py-2 text-sm font-semibold text-textMain
          outline-none transition
          focus:border-primary focus:ring-2 focus:ring-primary/20
        "
      />
    </div>
  );
}

function SelectEditable({ label, value, onChange, options = [] }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold text-textMuted">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="
          w-full rounded-lg border border-border bg-white
          px-3 py-2 text-sm font-semibold text-textMain
          outline-none transition
          focus:border-primary focus:ring-2 focus:ring-primary/20
        "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TarjetaDetalle({ title, children, className = "", titleAlign = "left" }) {
  return (
    <div
      className={`
        rounded-xl border border-secondary/70 bg-white p-4
        shadow-none
        ${className}
      `}
    >
      <h3
        className={`
          mb-4 text-sm font-bold text-primary
          ${titleAlign === "center" ? "text-center" : "text-left"}
        `}
      >
        {title}
      </h3>

      {children}
    </div>
  );
}

function UnidadesAdmin() {
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [unidadEnEdicion, setUnidadEnEdicion] = useState(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Cambios guardados con éxito");

  const unidadesFiltradas = useMemo(() => {
    return unidadesAdminMock.filter((unidad) => {
      const coincideEstado =
        estadoFiltro === "Todos" || unidad.estado === estadoFiltro;

      const coincideBusqueda = unidad.numero
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      return coincideEstado && coincideBusqueda;
    });
  }, [estadoFiltro, busqueda]);

  const abrirDetalleUnidad = (unidad) => {
    setUnidadSeleccionada(unidad);
    setUnidadEnEdicion(null);
  };

  const abrirEdicionUnidad = (unidad) => {
    const copia =
      typeof structuredClone === "function"
        ? structuredClone(unidad)
        : JSON.parse(JSON.stringify(unidad));

    setUnidadEnEdicion(copia);
    setUnidadSeleccionada(null);
  };

  const cerrarVistaUnidad = () => {
    setUnidadSeleccionada(null);
    setUnidadEnEdicion(null);
  };
  
  const cerrarModalExito = () => {
   setIsSuccessOpen(false);
  };

  const actualizarCampoUnidad = (campo, valor) => {
    setUnidadEnEdicion((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const actualizarRelacionUsuario = (usuarioId, campo, valor) => {
    setUnidadEnEdicion((prev) => ({
      ...prev,
      usuarios: prev.usuarios.map((usuario) =>
        usuario.id === usuarioId
          ? {
              ...usuario,
              [campo]: valor,
            }
          : usuario
      ),
    }));
  };

  const finalizarRelacionUsuario = (usuarioId) => {
  const fechaActual = new Date().toLocaleDateString("es-AR");

    setUnidadEnEdicion((prev) => ({
      ...prev,
      usuarios: prev.usuarios.map((usuario) =>
        usuario.id === usuarioId
          ? {
              ...usuario,
              hasta: fechaActual,
              estadoRelacion: "Finalizada",
            }
          : usuario
      ),
    }));
  };

  const guardarCambiosUnidad = () => {
    // Por ahora queda local. Cuando tengas endpoint, acá llamarías al servicio.
    console.log("Unidad editada:", unidadEnEdicion);

    setUnidadSeleccionada(unidadEnEdicion);
    setUnidadEnEdicion(null);
    setSuccessMessage("Cambios guardados con éxito");
    setIsSuccessOpen(true);

  };

  if (unidadEnEdicion) {
    const usuariosRelacionados = unidadEnEdicion.usuarios.length
      ? unidadEnEdicion.usuarios
      : [
          ...(unidadEnEdicion.ocupanteActual &&
          unidadEnEdicion.ocupanteActual !== "-"
            ? [
                {
                  id: "ocupante",
                  nombre: unidadEnEdicion.ocupanteActual,
                  rol: "Inquilino",
                  desde: "",
                  hasta: "",
                },
              ]
            : []),
          {
            id: "propietario",
            nombre: unidadEnEdicion.propietario,
            rol: "Propietario",
            desde: "",
            hasta: "",
          },
        ];

    const incidencias = unidadEnEdicion.incidencias.length
      ? unidadEnEdicion.incidencias
      : [
          {
            id: "empty",
            titulo: "Sin incidencias registradas",
            fecha: "-",
            estado: "Cerrada",
          },
        ];

    const historialOcupacion = unidadEnEdicion.historialOcupacion.length
      ? unidadEnEdicion.historialOcupacion
      : [
          {
            id: "empty",
            ocupante: "Sin registros",
            rol: "-",
            desde: "-",
            hasta: "-",
            estado: "Finalizado",
          },
        ];

    return (
      <ContenedorPanelPorRol
        titulo="Unidades"
        subtitulo="Editar unidad"
      >
        <section className="mx-auto max-w-[1120px] space-y-5">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={cerrarVistaUnidad}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Volver
          </Button>

          <div className="overflow-hidden rounded-xl border border-secondary/70 bg-white shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
            <div className="flex flex-wrap items-center justify-center gap-3 bg-secondary px-6 py-4 text-white">
              <h2 className="text-base font-bold">
                Editar Unidad {unidadEnEdicion.numero}
              </h2>

              <EstadoBadge estado={unidadEnEdicion.estado} />
            </div>

            <div className="space-y-5 bg-surfaceSoft p-5 md:p-6">
              <TarjetaDetalle title="Información básica">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  <InfoBasicaItem
                    label="Número"
                    value={unidadEnEdicion.numero}
                  />

                  <InfoBasicaItem
                    label="Piso"
                    value={unidadEnEdicion.piso}
                  />

                  <InfoBasicaItem
                    label="Edificio"
                    value={unidadEnEdicion.edificio}
                  />

                  <InfoBasicaItem
                    label="Superficie"
                    value={unidadEnEdicion.superficie}
                  />

                  <div className="max-w-[140px]">
                    <label className="text-[11px] font-semibold text-textMuted">
                      Estado
                    </label>

                    <select
                      value={unidadEnEdicion.estado}
                      onChange={(e) => actualizarCampoUnidad("estado", e.target.value)}
                      className="
                        mt-0 w-full rounded-lg border border-border bg-white
                        px-1 py-0 text-sm font-bold text-textMain
                        outline-none transition
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                      "
                    >
                      <option value="Ocupado">Ocupado</option>
                      <option value="Desocupado">Desocupado</option>
                    </select>
                  </div>
                </div>
              </TarjetaDetalle>

              <TarjetaDetalle
                title="Relación con usuarios"
                titleAlign="center"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {usuariosRelacionados.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="
                        rounded-lg border border-border/70
                        bg-surfaceSoft/60 p-4
                      "
                    >
                      <div className="mb-5 flex flex-wrap items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-secondary">
                          <UserCircle size={26} />
                        </div>

                        <div className="min-w-0 flex-1">
                         <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-bold text-textMain">
                              {usuario.nombre}
                            </p>

                            {usuario.estadoRelacion === "Finalizada" && (
                              <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                                Finalizada
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 text-[11px] font-semibold text-textMuted">
                            Relación editable
                          </p>
                        </div>

                        <div className="text-primary">
                          <Pencil size={18} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <SelectEditable
                          label="Rol"
                          value={usuario.rol}
                          className="ring-1 ring-primary/30"
                          onChange={(valor) =>
                            actualizarRelacionUsuario(usuario.id, "rol", valor)
                          }
                          options={["Propietario", "Inquilino"]}
                        />

                        <CampoEditable
                          label="Desde"
                          type="text"
                          value={usuario.desde}
                          onChange={(valor) =>
                            actualizarRelacionUsuario(usuario.id, "desde", valor)
                          }
                        />

                        <CampoEditable
                          label="Hasta"
                          type="text"
                          value={usuario.hasta}
                          onChange={(valor) =>
                            actualizarRelacionUsuario(usuario.id, "hasta", valor)
                          }
                        />
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          onClick={() => finalizarRelacionUsuario(usuario.id)}
                          className="
                            inline-flex items-center justify-center
                            whitespace-nowrap
                            rounded-full border border-red-300 bg-red-50 
                            px-6 py-2
                            text-xs font-bold text-red-600 transition
                             hover:bg-red-100 hover:border-red-400 hover:-translate-y-0.5
                            shadow-lg 
                            "
                          >
                            Finalizar relación
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TarjetaDetalle>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <TarjetaDetalle title="Historial de incidencias">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-textMuted">
                      Total registrado
                    </span>

                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {unidadEnEdicion.incidencias.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {incidencias.map((incidencia) => (
                      <div
                        key={incidencia.id}
                        className="
                          flex items-center justify-between gap-3
                          rounded-lg border border-border/70
                          bg-surfaceSoft/60 px-4 py-3
                        "
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <CircleAlert
                            size={17}
                            className={
                              incidencia.estado === "Abierta"
                                ? "shrink-0 text-red-500"
                                : incidencia.estado === "Resuelta"
                                ? "shrink-0 text-emerald-500"
                                : "shrink-0 text-slate-500"
                            }
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-textMain">
                              {incidencia.titulo}
                            </p>

                            <p className="text-xs text-textMuted">
                              {incidencia.fecha}
                            </p>
                          </div>
                        </div>

                        <EstadoBadge estado={incidencia.estado} />
                      </div>
                    ))}
                  </div>
                </TarjetaDetalle>

                <TarjetaDetalle
                  title="Historial de ocupación"
                  titleAlign="center"
                >
                  <div className="overflow-x-auto rounded-lg border border-secondary/40">
                    <table className="w-full min-w-[430px] border-collapse text-xs">
                      <thead>
                        <tr className="bg-secondary text-left text-white">
                          <th className="px-3 py-3 font-bold">Ocupante</th>
                          <th className="px-3 py-3 font-bold">Rol</th>
                          <th className="px-3 py-3 font-bold">Desde</th>
                          <th className="px-3 py-3 font-bold">Hasta</th>
                          <th className="px-3 py-3 font-bold">Estado</th>
                        </tr>
                      </thead>

                      <tbody className="bg-white">
                        {historialOcupacion.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-border/50 last:border-b-0"
                          >
                            <td className="px-3 py-3 font-semibold text-textMain">
                              {item.ocupante}
                            </td>

                            <td className="px-3 py-3 font-semibold text-textMain">
                              {item.rol}
                            </td>

                            <td className="px-3 py-3 font-semibold text-textMain">
                              {item.desde}
                            </td>

                            <td className="px-3 py-3 font-semibold text-textMain">
                              {item.hasta}
                            </td>

                            <td className="px-3 py-3">
                              <EstadoBadge estado={item.estado} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TarjetaDetalle>
              </div>

              <div className="flex flex-wrap justify-center gap-4 border-t border-border/70 pt-5">
                <Button
                  variant="elevated"
                  size="md"
                  type="button"
                  onClick={guardarCambiosUnidad}
                >
                  Guardar cambios
                </Button>

                <Button
                  variant="neutral"
                  size="md"
                  type="button"
                  onClick={cerrarVistaUnidad}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </section>
      </ContenedorPanelPorRol>
    );
  }

  if (unidadSeleccionada) {
    const usuariosRelacionados = unidadSeleccionada.usuarios.length
      ? unidadSeleccionada.usuarios
      : [
          ...(unidadSeleccionada.ocupanteActual &&
          unidadSeleccionada.ocupanteActual !== "-"
            ? [
                {
                  id: "ocupante",
                  nombre: unidadSeleccionada.ocupanteActual,
                  rol: "Inquilino",
                  desde: "-",
                  hasta: "-",
                },
              ]
            : []),
          {
            id: "propietario",
            nombre: unidadSeleccionada.propietario,
            rol: "Propietario",
            desde: "-",
            hasta: "-",
          },
        ];

    const incidencias = unidadSeleccionada.incidencias.length
      ? unidadSeleccionada.incidencias
      : [
          {
            id: "empty",
            titulo: "Sin incidencias registradas",
            fecha: "-",
            estado: "Cerrada",
          },
        ];

    const historialOcupacion = unidadSeleccionada.historialOcupacion.length
      ? unidadSeleccionada.historialOcupacion
      : [
          {
            id: "empty",
            ocupante: "Sin registros",
            rol: "-",
            desde: "-",
            hasta: "-",
            estado: "Finalizado",
          },
        ];

    return (
      <ContenedorPanelPorRol
        titulo="Unidades"
        subtitulo="Detalles de unidad"
      >
        <section className="mx-auto max-w-[1120px] space-y-5">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => setUnidadSeleccionada(null)}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Volver
          </Button>

          <div className="overflow-hidden rounded-xl border border-secondary/70 bg-white shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
            <div className="flex flex-wrap items-center justify-center gap-3 bg-secondary px-6 py-4 text-white">
              <h2 className="text-base font-bold">
                Detalle Unidad {unidadSeleccionada.numero}
              </h2>

              <EstadoBadge
                estado={
                  unidadSeleccionada.estado
                }
              />
            </div>

            <div className="space-y-5 bg-surfaceSoft p-5 md:p-6">
              <TarjetaDetalle title="Información básica">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <InfoBasicaItem
                    label="Número"
                    value={unidadSeleccionada.numero}
                  />

                  <InfoBasicaItem
                    label="Piso"
                    value={unidadSeleccionada.piso}
                  />

                  <InfoBasicaItem
                    label="Edificio"
                    value={unidadSeleccionada.edificio}
                  />

                  <InfoBasicaItem
                    label="Superficie"
                    value={unidadSeleccionada.superficie}
                  />
                </div>
              </TarjetaDetalle>

              <TarjetaDetalle
                title="Relación con usuarios"
                titleAlign="center"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {usuariosRelacionados.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="
                        rounded-lg border border-border/70
                       bg-surfaceSoft/60 p-4

                      "
                    >

                      <div className="mb-5 flex flex-wrap items-center gap-3">
                        <UserCircle className="text-secondary" size={29} />

                        <p className="truncate text-sm font-semibold text-textMain">
                          {usuario.nombre}
                        </p>

                        <EstadoBadge estado={usuario.rol} />
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                        <p>
                          <span className="font-semibold text-textMuted">
                            Desde:
                          </span>{" "}
                          <span className="font-bold text-textMain">
                            {usuario.desde}
                          </span>
                        </p>

                        <p>
                          <span className="font-semibold text-textMuted">
                            Hasta:
                          </span>{" "}
                          <span className="font-bold text-textMain">
                            {usuario.hasta}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TarjetaDetalle>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <TarjetaDetalle title="Historial de incidencias">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-textMuted">
                      Total registrado
                    </span>

                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {unidadSeleccionada.incidencias.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {incidencias.map((incidencia) => (
                      <div
                        key={incidencia.id}
                        className="
                          flex items-center justify-between gap-3
                          rounded-lg border border-border/70
                          bg-surfaceSoft/60 px-4 py-3
                        "
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <CircleAlert
                            size={17}
                            className={
                              incidencia.estado === "Abierta"
                                ? "shrink-0 text-red-500"
                                : incidencia.estado === "Resuelta"
                                ? "shrink-0 text-emerald-500"
                                : "shrink-0 text-slate-500"
                            }
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-textMain">
                              {incidencia.titulo}
                            </p>
                            <p className="text-xs text-textMuted">
                              {incidencia.fecha}
                            </p>
                          </div>
                        </div>

                        <EstadoBadge estado={incidencia.estado} />
                      </div>
                    ))}
                  </div>
                </TarjetaDetalle>

                <TarjetaDetalle
                  title="Historial de ocupación"
                  titleAlign="center"
                >
                  <div className="overflow-x-auto rounded-lg border border-secondary/40">
                    <table className="w-full min-w-[430px] border-collapse text-xs">
                      <thead>
                        <tr className="bg-secondary text-left text-white">
                          <th className="px-3 py-3 font-bold">Ocupante</th>
                          <th className="px-3 py-3 font-bold">Rol</th>
                          <th className="px-3 py-3 font-bold">Desde</th>
                          <th className="px-3 py-3 font-bold">Hasta</th>
                          <th className="px-3 py-3 font-bold">Estado</th>
                        </tr>
                      </thead>

                      <tbody className="bg-white">
                        {historialOcupacion.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-border/50 last:border-b-0"
                          >
                            <td className="px-3 py-3 font-semibold text-textMain">
                              {item.ocupante}
                            </td>
                            <td className="px-3 py-3 font-semibold text-textMain">
                              {item.rol}
                            </td>
                            <td className="px-3 py-3 font-semibold text-textMain">
                              {item.desde}
                            </td>
                            <td className="px-3 py-3 font-semibold text-textMain">
                              {item.hasta}
                            </td>
                            <td className="px-3 py-3">
                              <EstadoBadge estado={item.estado} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TarjetaDetalle>
              </div>
            </div>
          </div>
        </section>
        
        <SuccessModal
          isOpen={isSuccessOpen}
          onClose={cerrarModalExito}
          message={successMessage}
        />

      </ContenedorPanelPorRol>
    );
  }

  return (
    <ContenedorPanelPorRol
      titulo="Unidades"
      subtitulo="Gestión de las unidades del edificio"
    >
      <section className="mx-auto max-w-[1120px] space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className={`${CLASE_CAMPO_FILTRO} sm:w-[180px]`}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Ocupado">Ocupada</option>
              <option value="Desocupado">Desocupada</option>
            </select>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por número..."
              className={`${CLASE_CAMPO_FILTRO} sm:w-[240px]`}
            />
          </div>
        </div>

        <SectionCard title="Lista de unidades">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-xs">
              
              <colgroup>
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[22%]" />
                  <col className="w-[20%]" />
                  <col className="w-[10%]" />
                </colgroup>

              <thead>
                <tr className="bg-secondary text-left text-[11px] text-white">
                  <th className="px-1 py-2 font-bold">Número</th>
                  <th className="px-1 py-2 font-bold">Piso</th>
                  <th className="px-2 py-2 font-bold">Edificio</th>
                  <th className="px-2 py-2 font-bold">Estado</th>
                  <th className="px-2 py-2 font-bold">Ocupante actual</th>
                  <th className="px-2 py-2 font-bold">Propietario</th>
                  <th className="px-0 py-2 text-center font-bold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {unidadesFiltradas.map((unidad) => (
                  <tr
                    key={unidad.id}
                    className="border-b border-border/50 last:border-b-0 hover:bg-primarySoft/30"
                  >
                    <td className="px-2 py-3 font-bold text-textMain">
                      {unidad.numero}
                    </td>

                    <td className="px-1 py-3 text-textMain">{unidad.piso}</td>

                    <td className="px-2 py-3 text-textMain">
                      {unidad.edificio}
                    </td>

                    <td className="px-2 py-3">
                      <EstadoBadge estado={unidad.estado} />
                    </td>

                    <td className="px-2 py-3 text-textMain">
                      <div className="truncate">
                       {unidad.ocupanteActual}
                      </div>
                    </td>

                    <td className="px-2 py-3 text-textMain">
                      <div className="truncate">
                       {unidad.propietario}
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <BotonIcono
                          onClick={() => abrirDetalleUnidad(unidad)}
                          label={`Ver detalle de unidad ${unidad.numero}`}
                        >
                          <Eye size={16} />
                        </BotonIcono>

                        <BotonIcono
                          onClick={() => abrirEdicionUnidad(unidad)}
                          label={`Editar unidad ${unidad.numero}`}
                        >
                          <Pencil size={16} />
                        </BotonIcono>
                      </div>
                    </td>
                  </tr>
                ))}

                {unidadesFiltradas.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-sm text-textMuted"
                    >
                      No se encontraron unidades con esos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-lg border border-border/70 bg-surfaceSoft/50 px-4 py-3 text-xs font-semibold text-primary">
            Mostrando {unidadesFiltradas.length} de {unidadesAdminMock.length}{" "}
            unidades
          </div>
        </SectionCard>
      </section>
    </ContenedorPanelPorRol>
  );
}

export default UnidadesAdmin;