import { useEffect, useState } from 'react';

export const useRedirectSignature = () => {
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const signatureParam = params.get('signature');

    if (status === 'signed' && signatureParam) {
      setSignature(signatureParam);
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return signature;
};