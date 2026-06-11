import { Settings, LogOut, Home, AlertCircle, FileText, DollarSign, Bell } from "lucide-react";
import Button from "../ui/Button";
import {
  ocupanteMenuItems,
  ocupanteUsuario,
  unidadActual,
  reclamosRecientes,
  avisosEdificio,
} from "../../data/ocupanteDashboardData";

function ChipEstado({ estado }) {
  const mapa = {
    "ABIERTA": "bg-red-100 text-red-700 border border-red-300",
    "EN TRABAJO": "bg-blue-100 text-blue-700 border border-blue-300",
    "RESUELTA": "bg-green-100 text-green-700 border border-green-300",
  };
  return (
    <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${mapa[estado] || "bg-slate-100 text-slate-700"}`}>
      {estado}
    </span>
  );
}

function BarraAviso({ color }) {
  const cls = color === "rojo" ? "bg-red-500" : "bg-blue-500";
  return <span className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${cls}`} />;
}

function OcupantePanelGeneral() {
  return (
    <div className="min-h-screen bg-slate-300">
      <div className="flex">

        {/* SIDEBAR */}
        <aside className="w-[250px] min-h-screen bg-[#0b3f4b] text-white flex flex-col">
          <div className="px-6 py-5 font-bold text-lg flex items-center gap-2">
            <Home size={20} />
            Consorcio365
          </div>

          <nav className="px-4 space-y-2">
            {ocupanteMenuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition
                  ${item.label === "Panel general" ? "bg-white/10" : ""}`}
              >
                {item.label === "Panel general" && <Home size={16} />}
                {item.label === "Mis reclamos" && <AlertCircle size={16} />}
                {item.label === "Libro de Gastos" && <DollarSign size={16} />}
                {item.label === "Documentos" && <FileText size={16} />}
                {item.label === "Avisos" && <Bell size={16} />}
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto px-6 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/15" />
              <div>
                <div className="text-sm font-semibold">{ocupanteUsuario.nombre}</div>
                <div className="text-xs text-white/70">{ocupanteUsuario.rol}</div>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full justify-center bg-white/10 text-white border-white/20 hover:bg-white/15"
              onClick={() => {}}
            >
              <span className="flex items-center gap-2">
                SALIR <LogOut size={16} />
              </span>
            </Button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1">
          {/* TOPBAR */}
          <header className="bg-[#0f5b66] text-white px-8 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Panel general</h1>
              <p className="text-sm text-white/80">
                Bienvenido a su panel general de Consorcio365
              </p>
            </div>

            <button className="p-2 rounded-lg hover:bg-white/10 transition" type="button">
              <Settings />
            </button>
          </header>

          {/* CONTENT */}
          <section className="p-8 space-y-6">
            {/* MI UNIDAD */}
            <div className="bg-slate-100 rounded-xl border border-slate-300 shadow-sm">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-700/15 flex items-center justify-center">
                    <Home className="text-purple-700" size={18} />
                  </div>

                  <div>
                    <div className="text-xs text-slate-600">Mi Unidad</div>
                    <div className="text-lg font-bold text-slate-900">
                      {unidadActual.codigo}
                      <span className="text-sm font-medium text-slate-600">
                        {" "}• {unidadActual.piso} • {unidadActual.torre}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="bg-purple-700 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  {unidadActual.relacion}
                </span>
              </div>
            </div>

            {/* GRID CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* MIS RECLAMOS */}
              <div className="bg-slate-100 rounded-xl border border-slate-300 shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between">
                  <h2 className="font-bold text-purple-800">Mis Reclamos</h2>
                  <a className="text-sm text-purple-700 hover:underline" href="/ocupante/reclamos">
                    Ver todas
                  </a>
                </div>

                <div className="px-6 pb-4 space-y-3">
                  {reclamosRecientes.map((r) => (
                    <div
                      key={r.titulo}
                      className="bg-slate-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{r.titulo}</div>
                        <div className="text-xs text-slate-600">{r.fecha}</div>
                      </div>
                      <ChipEstado estado={r.estado} />
                    </div>
                  ))}
                </div>

                <div className="px-6 pb-6">
                  <Button variant="primary" className="w-full justify-center">
                    + Nuevo Reclamo
                  </Button>
                </div>
              </div>

              {/* AVISOS DEL EDIFICIO */}
              <div className="bg-slate-100 rounded-xl border border-slate-300 shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between">
                  <h2 className="font-bold text-purple-800">Avisos del Edificio</h2>
                  <a className="text-sm text-purple-700 hover:underline" href="/ocupante/avisos">
                    Ver todos
                  </a>
                </div>

                <div className="px-6 pb-6 space-y-3">
                  {avisosEdificio.map((a) => (
                    <div key={a.titulo} className="relative bg-slate-200 rounded-lg p-4 pl-6">
                      <BarraAviso color={a.color} />
                      <div className="font-semibold text-slate-800 text-sm">{a.titulo}</div>
                      <div className="text-xs text-slate-700 mt-1">{a.descripcion}</div>
                      <div className="text-[11px] text-slate-600 mt-2">
                        Publicado: {a.publicado}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default OcupantePanelGeneral;