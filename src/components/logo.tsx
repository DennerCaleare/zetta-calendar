import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="group flex cursor-pointer items-center space-x-2.5"
    >
      <div className="relative flex size-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30
        transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/40 group-hover:scale-110 group-hover:rotate-3">
        <span className="text-sm font-black text-white tracking-tight">Z</span>
        {/* Brilho ao hover */}
        <div className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-primary">
          Zetta
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest -mt-0.5 transition-colors duration-200 group-hover:text-primary/70">
          Calendar
        </span>
      </div>
    </Link>
  );
};

