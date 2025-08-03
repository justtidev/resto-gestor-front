// src/components/Logo.jsx
import { Utensils } from "lucide-react";

export default function LogoRestaurante() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <Utensils className="h-10 w-10 text-[#F4C430]" strokeWidth={1.5} />
      <img src="/pngegg.png" alt="Logo Restaurante" className="h-10 w-10" />
      </div>
      
    </div>
  );
}
