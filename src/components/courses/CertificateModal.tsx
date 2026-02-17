import { motion, AnimatePresence } from "framer-motion";
import { Award, Download, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  learnerName: string;
  courseName: string;
  certificateNumber: string;
  issuedAt: string;
  instructor?: string;
}

const CertificateModal = ({
  open,
  onClose,
  learnerName,
  courseName,
  certificateNumber,
  issuedAt,
  instructor,
}: CertificateModalProps) => {
  const handleDownload = () => {
    downloadCertificatePDF({ learnerName, courseName, certificateNumber, issuedAt, instructor });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-lg glass-card p-8 text-center space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {/* Celebration animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto glow-border">
                <Award className="w-10 h-10 text-primary" />
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-black text-foreground">🎉 مبارك!</h2>
              <p className="text-muted-foreground mt-2">لقد أكملت جميع دروس الكورس بنجاح</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2 text-sm"
            >
              <p className="text-muted-foreground">
                الكورس: <span className="text-primary font-bold">{courseName}</span>
              </p>
              <p className="text-muted-foreground">
                رقم الشهادة: <span className="text-foreground font-bold" dir="ltr">{certificateNumber}</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button onClick={handleDownload} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Download className="w-4 h-4" />
                تحميل الشهادة PDF
              </Button>
              <Button
                variant="outline"
                className="border-border text-foreground gap-2"
                onClick={() => window.open(`/verify/${certificateNumber}`, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
                صفحة التحقق
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;
