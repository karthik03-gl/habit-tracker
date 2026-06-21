"use client";

import { useHabitStore } from "@/store/useHabitStore";
import { Download, Upload, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";

export default function Settings() {
  const { habits, categories, records, importData } = useHabitStore();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      habits,
      categories,
      records,
      version: "1.0",
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Basic validation
        if (!json.habits || !json.records) {
          throw new Error("Invalid backup file format");
        }

        if (confirm("This will merge with your existing data. Do you want to proceed?")) {
          importData({
            habits: json.habits,
            categories: json.categories,
            records: json.records
          });
          setImportStatus("Data imported successfully!");
          setTimeout(() => setImportStatus(null), 3000);
        }
      } catch (err) {
        setImportStatus("Failed to import: Invalid file format.");
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
          Manage your data and preferences
        </p>
      </header>

      <div className="space-y-6">
        <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <h2 className="text-2xl font-bold">Data Management</h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl flex gap-3">
            <AlertTriangle className="flex-shrink-0" />
            <p className="text-sm">
              All your habit data is stored locally in this browser. To use it on another device or keep a backup, you must export it here.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-3 rounded-xl font-medium transition-colors"
            >
              <Download size={20} />
              Export Backup
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white py-3 rounded-xl font-medium transition-colors"
            >
              <Upload size={20} />
              Import Backup
            </button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImport}
            />
          </div>
          
          {importStatus && (
            <p className="text-center font-medium text-emerald-600 dark:text-emerald-400">
              {importStatus}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
