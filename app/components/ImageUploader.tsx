"use client";

import { useState, useRef } from "react";
import { SafeImage } from "@/app/components/SafeImage";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: "produtos" | "lojas" | "geral";
  helpText?: string;
  aspectRatio?: "square" | "cover" | "logo";
}

export function ImageUploader({
  value,
  onChange,
  label = "Imagem",
  folder = "geral",
  helpText,
  aspectRatio = "square",
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [modoUrl, setModoUrl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(file: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErro("Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP, GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErro("A imagem selecionada excede o tamanho máximo de 5MB.");
      return;
    }

    setErro("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setErro(data.error || "Erro ao realizar o upload da imagem.");
      }
    } catch (err: any) {
      setErro("Falha na conexão ao enviar a imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  const heightClass =
    aspectRatio === "cover"
      ? "h-40"
      : aspectRatio === "logo"
      ? "h-32 w-32"
      : "h-48";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-text-primary">
          {label}
        </label>
        <button
          type="button"
          onClick={() => {
            setModoUrl(!modoUrl);
            setErro("");
          }}
          className="text-xs text-mauve hover:text-text-primary font-semibold underline transition-colors"
        >
          {modoUrl ? "Subir arquivo do dispositivo" : "Usar URL externa"}
        </button>
      </div>

      {helpText && (
        <p className="text-xs text-lavendergrey mb-2 font-sans">{helpText}</p>
      )}

      {modoUrl ? (
        /* Inserção manual de URL */
        <div>
          <input
            type="url"
            value={value}
            onChange={(e) => {
              setErro("");
              onChange(e.target.value);
            }}
            placeholder="https://exemplo.com/sua-imagem.jpg"
            className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
          />
          {value && (
            <div className="mt-3 relative rounded-card overflow-hidden border border-lavendergrey/20 bg-mauve/10 h-32 flex items-center justify-center">
              <SafeImage
                src={value}
                alt="Preview da URL"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      ) : (
        /* Upload de arquivo local */
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          {value ? (
            /* Imagem já selecionada / enviada */
            <div className={`relative rounded-card overflow-hidden border border-lavendergrey/30 group bg-mauve/5 ${heightClass} flex items-center justify-center`}>
              <SafeImage
                src={value}
                alt="Preview da imagem"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-text-primary px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-aquamarine transition-colors shadow-sm"
                >
                  Trocar foto
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm"
                >
                  Remover
                </button>
              </div>
            </div>
          ) : (
            /* Área de Drag and Drop */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-card p-6 text-center cursor-pointer transition-all ${heightClass} flex flex-col items-center justify-center ${
                isDragging
                  ? "border-mauve bg-mauve/10 scale-[1.01]"
                  : "border-lavendergrey/30 bg-mauve/5 hover:border-mauve/60 hover:bg-mauve/10"
              }`}
            >
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-mauve border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold text-text-primary">Enviando imagem...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-mauve/20 text-mauve flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 12 12m-12-12v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Clique para escolher <span className="text-lavendergrey font-normal">ou arraste até aqui</span>
                    </p>
                    <p className="text-[11px] text-lavendergrey mt-0.5 font-sans">
                      PNG, JPG, WebP ou GIF (máx. 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {erro && (
        <p className="text-xs text-red-600 font-semibold mt-2">{erro}</p>
      )}
    </div>
  );
}
