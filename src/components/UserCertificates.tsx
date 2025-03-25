
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Certificate from '@/components/Certificate';
import { format } from 'date-fns';

interface CertificateData {
  id: string;
  assessment_id: string;
  assessment_title: string;
  score: number;
  created_at: string;
  user_id: string;
}

const UserCertificates = () => {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  
  const { data: certificates, isLoading, error } = useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: async () => {
      // This is a mock implementation - in a real app, you would fetch from your database
      // Simulating 3 certificates for the demo
      const mockCertificates: CertificateData[] = [
        {
          id: '1',
          assessment_id: 'drone-basics-101',
          assessment_title: 'Drone Flight Basics',
          score: 92,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          user_id: user?.id || '',
        },
        {
          id: '2',
          assessment_id: 'navigation-advanced',
          assessment_title: 'Advanced Navigation Techniques',
          score: 87,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          user_id: user?.id || '',
        },
        {
          id: '3',
          assessment_id: 'drone-regulations',
          assessment_title: 'Drone Regulations & Compliance',
          score: 95,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          user_id: user?.id || '',
        }
      ];
      
      // In a real implementation, you would fetch from Supabase like this:
      // const { data, error } = await supabase
      //   .from('user_certificates')
      //   .select('*')
      //   .eq('user_id', user?.id);
      
      // if (error) throw error;
      // return data;
      
      return mockCertificates;
    },
    enabled: !!user,
  });
  
  const handleViewCertificate = (certificate: CertificateData) => {
    setSelectedCertificate(certificate);
  };
  
  const handleCloseCertificate = () => {
    setSelectedCertificate(null);
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Award className="h-8 w-8 mx-auto mb-2 text-neutral-400 animate-pulse" />
        <p className="text-neutral-400">Loading certificates...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400">Error loading certificates. Please try again.</p>
      </div>
    );
  }
  
  if (!certificates || certificates.length === 0) {
    return (
      <div className="bg-[#1A1F2C] border border-white/5 rounded-lg p-10 text-center">
        <Award className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
        <h3 className="text-xl font-medium text-white mb-2">No Certificates Yet</h3>
        <p className="text-neutral-400 mb-6">Complete course assessments to earn certificates.</p>
        <Button variant="outline" className="bg-flytbase-secondary/10">
          Browse Assessments
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="bg-[#1A1F2C] border-white/5 text-white overflow-hidden transition-all duration-300 hover:border-flytbase-secondary/40 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <Award className="h-10 w-10 text-flytbase-secondary" />
                <div className="bg-flytbase-secondary/10 rounded px-2 py-1 text-sm">
                  Score: {certificate.score}%
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-2">{certificate.assessment_title}</h3>
              
              <p className="text-sm text-neutral-400 mb-4">
                Issued on {format(new Date(certificate.created_at), 'MMM d, yyyy')}
              </p>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewCertificate(certificate)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewCertificate(certificate)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedCertificate && (
        <Certificate
          fullName={user?.email?.split('@')[0] || "Student"}
          designation="FlytBase Academy Graduate"
          email={user?.email || ""}
          assessmentTitle={selectedCertificate.assessment_title}
          score={selectedCertificate.score}
          date={new Date(selectedCertificate.created_at)}
          onClose={handleCloseCertificate}
        />
      )}
    </>
  );
};

export default UserCertificates;
