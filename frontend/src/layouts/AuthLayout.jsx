import logo from "../assets/LOGO.png";

function AuthLayout({ children }) {
  return (
    // Contenedor principal de pantalla
    <div className="min-h-screen w-full flex justify-center items-start sm:items-center bg-[linear-gradient(to_bottom,#f1f5f9_0%,#e2e8f0_35%,#0f766e_100%)] sm:bg-[linear-gradient(to_bottom,#f1f5f9_0%,#e2e8f0_35%,#0f766e_100%)]">
      
      {/* Columna principal */}
      <div className="flex flex-col items-center">

        {/* Espacio superior controlado */}
        <div className="h-4" />

        {/* Título */}
        <h2 className="text-2xl font-bold text-teal-700 mb-2">
          Bienvenido a
        </h2>

        {/* Logo */}
        <img
          src={logo}
          alt="Consorcio365"
          className="w-40 md:w-42 mb-2"
        />

        {/*BLOQUE ÚNICO: círculo + formulario */}
        <div className="mt-0">
          <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[335px] md:h-[335px] rounded-full bg-white/30 backdrop-blur-50px  border border-white/50 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] flex items-start justify-center">
            
            {/* Formulario dentro del círculo */}
            <div className="w-[200px] sm:w-[210px] md:w-[220px] pt-12 sm:pt-12">
              {children}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;


