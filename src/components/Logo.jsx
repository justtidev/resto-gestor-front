// src/components/Logo.jsx
import { Utensils } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <Utensils className="h-10 w-10 text-[#F4C430]" strokeWidth={1.5} />
        <h1 className="text-4xl font-serif font-bold tracking-tight text-stone-400 ">
          Resto
        </h1>
      </div>
      <p className="text-stone-400 italic text-sm mt-1">Gestor Gastronomico</p>
    </div>
  );
}
