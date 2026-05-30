// src/components/ocupante/PanelGeneralOcupante.jsx

import MiUnidadCard from "./MiUnidadCard";
import OcupanteReclamosList from "./OcupanteReclamosList";
import OcupanteAvisosList from "./OcupanteAvisosList";

function PanelGeneralOcupante() {
  return (
    <section className="mx-auto max-w-[1120px] space-y-5">
      <MiUnidadCard />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <OcupanteReclamosList />
        <OcupanteAvisosList />
      </div>
    </section>
  );
}

export default PanelGeneralOcupante;