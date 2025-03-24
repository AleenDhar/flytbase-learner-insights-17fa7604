
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

interface CertificateProps {
  fullName: string;
  designation: string;
  email: string;
  assessmentTitle: string;
  score: number;
  date?: Date;
  onClose: () => void;
}

const Certificate = ({
  fullName,
  designation,
  email,
  assessmentTitle,
  score,
  date = new Date(),
  onClose
}: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      try {
        // Create canvas from the certificate div
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: '#1A1F2C'
        });

        // Calculate dimensions to maintain A4 proportions
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Save the PDF
        pdf.save(`FlytBase_Certificate_${fullName.replace(/\s+/g, '_')}.pdf`);
      } catch (error) {
        console.error('Error generating certificate PDF:', error);
      }
    }
  };

  const formattedDate = format(date, 'MMMM dd, yyyy');
  const certificateId = `FB-CERT-${Date.now().toString().slice(-8)}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 p-4">
      <div className="relative max-w-4xl w-full">
        <div className="absolute top-2 right-2 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadCertificate}
            className="bg-white text-flytbase-primary hover:bg-gray-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="bg-white text-flytbase-primary hover:bg-gray-100"
          >
            Close
          </Button>
        </div>
        
        <div ref={certificateRef} className="bg-[#1A1F2C] p-8 border-8 border-flytbase-secondary/20 rounded-lg">
          <div className="text-center mb-6">
            <div className="mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">FLYTBASE ACADEMY</h2>
              <p className="text-neutral-400">Certificate of Achievement</p>
            </div>
            
            <div className="w-36 h-1 bg-flytbase-secondary mx-auto my-4"></div>
            
            <p className="text-neutral-300 italic">This is to certify that</p>
            <h1 className="text-3xl md:text-4xl font-bold text-flytbase-secondary my-2">{fullName}</h1>
            <p className="text-neutral-300 mb-4">{designation}</p>
            
            <p className="text-white mb-6">
              has successfully completed the assessment
              <span className="block text-xl md:text-2xl font-semibold text-flytbase-secondary mt-2">
                {assessmentTitle}
              </span>
              with a score of <span className="font-bold">{score}%</span>
            </p>
            
            <div className="flex justify-between items-center mt-12 mb-8">
              <div className="text-center">
                <div className="w-32 h-px bg-white/20 mx-auto mb-2"></div>
                <p className="text-neutral-400 text-sm">Date</p>
                <p className="text-white">{formattedDate}</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="/lovable-uploads/481a13eb-6855-4500-888c-8c5d4a3734a1.png" 
                  alt="FlytBase Logo" 
                  className="h-16 mx-auto mb-2"
                />
                <div className="w-32 h-px bg-white/20 mx-auto mb-2"></div>
                <p className="text-white">FlytBase Academy</p>
              </div>
            </div>
            
            <div className="mt-8 text-sm text-neutral-400 flex justify-between items-center border-t border-white/10 pt-4">
              <span>Certificate ID: {certificateId}</span>
              <span>Verified by FlytBase Academy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
