import Card from "../ui/Card";

function EspecialidadBanner({ especialidad }) {
  return (
	<Card className="border-secondary/70 bg-white py-3 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
  	<p className="text-center text-sm font-semibold text-primary">
    	Especialidad: {especialidad}
  	</p>
	</Card>
  );
}

export default EspecialidadBanner;

