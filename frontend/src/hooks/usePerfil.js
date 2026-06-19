import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";

function obtenerIniciales(nombreCompleto = "", apellido = "") {
  const nombre = String(nombreCompleto || "").trim();
  const ape = String(apellido || "").trim();

  if (nombre && ape) {
    return `${nombre.charAt(0)}${ape.charAt(0)}`.toUpperCase();
  }

  const partes = nombre.split(" ").filter(Boolean);

  if (partes.length >= 2) {
    return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
  }

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }

  return "UP";
}

function obtenerEtiquetaRol(role = "") {
  const rol = String(role || "").toLowerCase();

  const mapa = {
    admin: "Administrador",
    administrador: "Administrador",
    ocupante: "Ocupante",
    proveedor: "Proveedor",
  };

  return mapa[rol] || role || "Usuario";
}

function normalizarPerfilDesdeUser(user) {
  return {
    nombre: user?.nombre || user?.name || "",
    apellido: user?.apellido || user?.lastName || "",
    email: user?.email || "",
    telefono: user?.telefono || user?.phone || "",
    tipoDocumento: user?.tipoDocumento || user?.docType || "DNI",
    numeroDocumento: user?.numeroDocumento || user?.docNumber || "",
    rol: obtenerEtiquetaRol(user?.role),
    avatarUrl: user?.avatarUrl || user?.avatar || "",
  };
}

export function usePerfil() {
  const { user, updateUser } = useAuth();

  /**
   * Perfil base derivado del usuario autenticado
   * No lo guardamos en state para evitar sincronizaciones con useEffect.
   */
  const perfilBase = useMemo(() => {
    return normalizarPerfilDesdeUser(user);
  }, [user]);

  /**
   * Overrides locales:
   * - nombre/apellido/teléfono editados
   * - avatar local/subido
   */
  const [perfilLocal, setPerfilLocal] = useState({});
  const [avatarTemporalUrl, setAvatarTemporalUrl] = useState("");

  /**
   * Perfil final mostrado en pantalla:
   * mezcla perfil base + cambios locales
   */
  const perfil = useMemo(() => {
    return {
      ...perfilBase,
      ...perfilLocal,
      avatarUrl: avatarTemporalUrl || perfilLocal.avatarUrl || perfilBase.avatarUrl,
    };
  }, [perfilBase, perfilLocal, avatarTemporalUrl]);

  const [isEditarPerfilOpen, setIsEditarPerfilOpen] = useState(false);
  const [isCambiarContrasenaOpen, setIsCambiarContrasenaOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Cambios guardados con éxito"
  );

  /**
   * Form del modal editar
   * Se llena recién al abrir el modal
   */
  const [formEditar, setFormEditar] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  /**
   * Form del modal cambiar contraseña
   */
  const [formPassword, setFormPassword] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarNuevaContrasena: "",
  });

  /**
   * Cleanup para liberar object URLs del avatar preview
   */
  useEffect(() => {
    return () => {
      if (avatarTemporalUrl) {
        URL.revokeObjectURL(avatarTemporalUrl);
      }
    };
  }, [avatarTemporalUrl]);

  const iniciales = useMemo(() => {
    return obtenerIniciales(perfil.nombre, perfil.apellido);
  }, [perfil.nombre, perfil.apellido]);

  /**
   * Validaciones visuales del password
   */
  const validacionesPassword = useMemo(() => {
    const nueva = formPassword.nuevaContrasena || "";

    return {
      min8: nueva.length >= 8,
      mayuscula: /[A-ZÁÉÍÓÚÑ]/.test(nueva),
      numero: /\d/.test(nueva),
      coincide:
        nueva.length > 0 &&
        formPassword.confirmarNuevaContrasena.length > 0 &&
        nueva === formPassword.confirmarNuevaContrasena,
    };
  }, [formPassword.nuevaContrasena, formPassword.confirmarNuevaContrasena]);

  const passwordValida =
    validacionesPassword.min8 &&
    validacionesPassword.mayuscula &&
    validacionesPassword.numero &&
    validacionesPassword.coincide &&
    formPassword.contrasenaActual.trim() !== "";

  const abrirEditarPerfil = () => {
    setFormEditar({
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      telefono: perfil.telefono,
    });

    setIsEditarPerfilOpen(true);
  };

  const cerrarEditarPerfil = () => {
    setIsEditarPerfilOpen(false);
  };

  const abrirCambiarContrasena = () => {
    setFormPassword({
      contrasenaActual: "",
      nuevaContrasena: "",
      confirmarNuevaContrasena: "",
    });

    setIsCambiarContrasenaOpen(true);
  };

  const cerrarCambiarContrasena = () => {
    setIsCambiarContrasenaOpen(false);
  };

  const actualizarCampoEditar = (campo, valor) => {
    setFormEditar((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const actualizarCampoPassword = (campo, valor) => {
    setFormPassword((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const seleccionarAvatar = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Seleccioná un archivo de imagen válido.");
      return;
    }

    if (avatarTemporalUrl) {
      URL.revokeObjectURL(avatarTemporalUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarTemporalUrl(previewUrl);

    setPerfilLocal((prev) => ({
      ...prev,
      avatarUrl: previewUrl,
    }));

    updateUser?.({
      avatarUrl: previewUrl,
      avatar: previewUrl,
    });

    setSuccessMessage("Imagen de perfil actualizada con éxito");
    setIsSuccessOpen(true);

    // TODO backend:
    // subir archivo y reemplazar previewUrl por la URL real
  };

  const guardarPerfil = async () => {
    const perfilActualizado = {
      nombre: formEditar.nombre.trim(),
      apellido: formEditar.apellido.trim(),
      telefono: formEditar.telefono.trim(),
    };

    setPerfilLocal((prev) => ({
      ...prev,
      ...perfilActualizado,
    }));

    updateUser?.({
      name: perfilActualizado.nombre,
      nombre: perfilActualizado.nombre,
      apellido: perfilActualizado.apellido,
      phone: perfilActualizado.telefono,
      telefono: perfilActualizado.telefono,
      avatarUrl: perfil.avatarUrl,
      avatar: perfil.avatarUrl,
    });

    setIsEditarPerfilOpen(false);
    setSuccessMessage("Datos personales actualizados con éxito");
    setIsSuccessOpen(true);

    // TODO backend:
    // await updatePerfilRequest(...)
  };

  const guardarNuevaContrasena = async () => {
    if (!passwordValida) return;

    setIsCambiarContrasenaOpen(false);
    setSuccessMessage("Contraseña actualizada con éxito");
    setIsSuccessOpen(true);

    setFormPassword({
      contrasenaActual: "",
      nuevaContrasena: "",
      confirmarNuevaContrasena: "",
    });

    // TODO backend:
    // await changePasswordRequest(...)
  };

  return {
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

    cerrarSuccessModal: () => setIsSuccessOpen(false),
  };
}