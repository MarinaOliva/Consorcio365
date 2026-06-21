import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import SuccessModal from "../../components/shared/SuccessModal";
import TarjetaPerfil from "../../components/perfil/TarjetaPerfil";
import ModalEditarPerfil from "../../components/perfil/ModalEditarPerfil";
import ModalCambiarContrasena from "../../components/perfil/ModalCambiarContrasena";
import { usePerfil } from "../../hooks/usePerfil";

function Perfil() {
  const {
    perfil,
    iniciales,
    isEditarPerfilOpen,
    isCambiarContrasenaOpen,
    isSuccessOpen,
    successMessage,
    formEditar,
    formPassword,
    validacionesPassword,
    passwordValida,
    abrirEditarPerfil,
    cerrarEditarPerfil,
    abrirCambiarContrasena,
    cerrarCambiarContrasena,
    actualizarCampoEditar,
    actualizarCampoPassword,
    guardarPerfil,
    guardarNuevaContrasena,
    seleccionarAvatar,
    cerrarSuccessModal,
  } = usePerfil();

  return (
    <ContenedorPanelPorRol
      titulo="Mi perfil"
      subtitulo="Información personal y configuración"
      showSettingsButton={false}
    >
      <section className="mx-auto max-w-[1120px] py-10">
        <TarjetaPerfil
          perfil={perfil}
          iniciales={iniciales}
          onEditarDatos={abrirEditarPerfil}
          onCambiarContrasena={abrirCambiarContrasena}
          onSeleccionarAvatar={seleccionarAvatar}
        />
      </section>

      <ModalEditarPerfil
        isOpen={isEditarPerfilOpen}
        onClose={cerrarEditarPerfil}
        form={formEditar}
        onChange={actualizarCampoEditar}
        onSave={guardarPerfil}
      />

      <ModalCambiarContrasena
        isOpen={isCambiarContrasenaOpen}
        onClose={cerrarCambiarContrasena}
        form={formPassword}
        onChange={actualizarCampoPassword}
        onSave={guardarNuevaContrasena}
        validaciones={validacionesPassword}
        passwordValida={passwordValida}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={cerrarSuccessModal}
        message={successMessage}
      />
    </ContenedorPanelPorRol>
  );
}

export default Perfil;