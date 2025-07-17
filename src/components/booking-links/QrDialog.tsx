
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrDialogProps {
  url: string;
}

export const QrDialog: React.FC<QrDialogProps> = ({ url }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="group bg-white/60 hover:bg-white/90 border-slate-200/60 text-slate-600 hover:text-slate-800 font-medium px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-sm hover:scale-105"
        aria-label="Show QR code"
      >
        <QrCode className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
        QR
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-sm rounded-3xl p-8 bg-popover border border-border shadow-2xl modal-content">
      <div className="flex flex-col items-center space-y-6 bg-background">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <QrCode className="w-6 h-6 text-white" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">
            QR Code
          </h3>
          <p className="text-sm text-slate-600">
            Scan to access booking link
          </p>
        </div>

        <div className="relative">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&margin=20`}
            alt="QR code for booking link"
            className="w-60 h-60 rounded-2xl shadow-lg border-4 border-white"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/5 to-purple-500/5 pointer-events-none" />
        </div>
        
        <div className="w-full bg-slate-50/80 border border-slate-200/60 rounded-xl p-3">
          <p className="text-xs font-mono text-slate-600 text-center break-all leading-relaxed">
            {url}
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
