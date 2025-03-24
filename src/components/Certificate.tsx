
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
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
          backgroundColor: '#FFFFFF'
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
        
        <div ref={certificateRef} className="bg-white p-8 border-2 border-blue-600 rounded-lg">
          <div className="text-center mb-6">
            {/* FlytBase Logo */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/beb4c3f0-62a3-4fed-a309-28749c117012.png" 
                  alt="FlytBase Logo" 
                  className="h-10"
                />
              </div>
              <div className="border border-blue-600 rounded">
                <div className="flex flex-col items-center">
                  <div className="bg-white p-1">
                    <img 
                      src="/lovable-uploads/beb4c3f0-62a3-4fed-a309-28749c117012.png" 
                      alt="FlytBase Logo" 
                      className="h-6"
                    />
                  </div>
                  <div className="bg-blue-600 text-white text-sm font-bold py-1 px-4">
                    CERTIFIED OPERATER
                  </div>
                </div>
              </div>
            </div>
            
            {/* Certificate Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-3 text-left">FlytBase Certificate</h1>
            <div className="w-full h-1 bg-blue-200 mb-8"></div>
            
            {/* Certificate Content */}
            <div className="text-left mb-8">
              <p className="text-lg mb-5">
                <span className="font-bold">{fullName}</span> of <span className="font-bold">{designation}</span> is a FlytBase Certified Operator.
              </p>
              
              <p className="text-lg mb-6">He/She has successfully completed FlytBase training session to:</p>
              
              <ul className="space-y-3 text-left text-lg mb-8">
                <li className="flex items-start">
                  <div className="text-blue-600 mr-2 w-5 h-5 mt-1">✓</div>
                  <span>Gain an understanding of how to operate FlytBase software</span>
                </li>
                <li className="flex items-start">
                  <div className="text-blue-600 mr-2 w-5 h-5 mt-1">✓</div>
                  <span>Manage a hybrid fleet of drones and docking stations</span>
                </li>
                <li className="flex items-start">
                  <div className="text-blue-600 mr-2 w-5 h-5 mt-1">✓</div>
                  <span>Plan and execute autonomous flights with FlytBase</span>
                </li>
                <li className="flex items-start">
                  <div className="text-blue-600 mr-2 w-5 h-5 mt-1">✓</div>
                  <span>Set requisite failsafes to ensure safe flights</span>
                </li>
                <li className="flex items-start">
                  <div className="text-blue-600 mr-2 w-5 h-5 mt-1">✓</div>
                  <span>Take manual remote control over FlytBase in unusual circumstances</span>
                </li>
                <li className="flex items-start">
                  <div className="text-blue-600 mr-2 w-5 h-5 mt-1">✓</div>
                  <span>Execute basic maintenance tasks</span>
                </li>
              </ul>
              
              <p className="text-lg mb-6">This certificate was granted on {formattedDate} by</p>
              
              <div className="flex justify-between items-end">
                <div></div>
                <div className="bg-gray-100 px-4 py-2 rounded">
                  <p className="text-base">Director of Products - Dhiraj Dhule</p>
                </div>
              </div>
            </div>
            
            {/* Certificate Footer */}
            <div className="mt-8 text-sm text-gray-500 flex justify-between items-center pt-4">
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
