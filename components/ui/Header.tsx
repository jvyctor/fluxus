"use client";

import { FileText, Bell } from "lucide-react";

interface HeaderProps {
  usuario: string;
  exercicio: string;
  notificacoes?: number;
}

export default function Header({
  usuario,
  exercicio,
  notificacoes = 0,
}: HeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">FluxusWeb</h1>
              <p className="text-sm text-slate-600">PREFEITURA DE BATURITÊ</p>
            </div>
          </div>

          {/* Exercício / Bem-vindo e sino */}
          <div className="flex items-center space-x-6">
            {/* Textos */}
            <div className="flex flex-col items-end text-sm text-slate-600 space-y-1">
              <span>{exercicio}</span>
              <span>Bem-vindo, {usuario}</span>
            </div>

            {/* Sino de notificações */}
            <button className="relative p-2 rounded-full hover:bg-slate-100">
              <Bell className="h-6 w-6 text-slate-600" />
              {notificacoes > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {notificacoes}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
