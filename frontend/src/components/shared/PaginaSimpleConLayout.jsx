// src/components/shared/PaginaSimpleConLayout.jsx

import ContenedorPanelPorRol from "../dashboard/ContenedorPanelPorRol";
import SectionCard from "../dashboard/SectionCard";

function PaginaSimpleConLayout({
  titulo,
  subtitulo = "",
  descripcion = "",
}) {
  return (
    <ContenedorPanelPorRol titulo={titulo} subtitulo={subtitulo}>
      <section className="mx-auto max-w-[1120px] space-y-5">
        <SectionCard title={titulo}>
          <div className="space-y-3">
            {subtitulo && (
              <p className="text-sm text-textMuted">
                {subtitulo}
              </p>
            )}

            {descripcion && (
              <p className="text-sm text-textMain">
                {descripcion}
              </p>
            )}
          </div>
        </SectionCard>
      </section>
    </ContenedorPanelPorRol>
  );
}

export default PaginaSimpleConLayout;