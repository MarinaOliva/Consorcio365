import logo from "../assets/LOGO.png";

function AuthLayout({ children }) {
  return (
    <div
      className="
        min-h-screen
        w-full
        flex
        justify-center
        items-start
        bg-[linear-gradient(to_bottom,#f1f5f9_0%,#e2e8f0_35%,#0f766e_100%)]
        px-4
        pt-4
      "
    >
      {/* Columna principal */}
      <div className="flex flex-col items-center">

        {/* Título */}
        <h2 className="text-[clamp(1.3rem,2.5vw,2rem)] font-bold text-teal-700 mb-1">
          Bienvenido a
        </h2>

        {/* Logo */}
        <img
          src={logo}
          alt="Consorcio365"
          className="w-[clamp(110px,16vw,160px)] mb-2"
        />

        {/* Círculo */}
        <div>
          <div
            className="
              rounded-full
              bg-white/30
              backdrop-blur-50px
              border border-white/50
              shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)]

              flex items-start justify-center

              w-[min(80vw,300px)]
              h-[min(80vw,300px)]
            "
          >
            {/* Formulario */}
            <div
              className="
                w-[min(65%,220px)]
                pt-[clamp(32px,8vw,48px)]
              "
            >
              {children}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;