import 'assets/scss/tools.scss';
import { UserVerifier } from '@multiversx/sdk-wallet';
import { Row, Col } from 'react-bootstrap';
import { Fragment, useEffect, useState } from 'react';
import { useGetAccount, useGetAccountInfo, useGetIsLoggedIn, useGetLoginInfo, useSignMessage } from 'hooks';
import { useMobile, useTablet } from 'utils/responsive';
import ScrollToTopButton from 'components/ScrollToTopButton';
import LightSpot from 'components/LightSpot';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CreateToken from 'components/Tools/CreateToken';
import OwnedTokens from 'components/Tools/OwnedTokens';
import { Button, IconButton, MenuItem, styled, TextareaAutosize, TextField } from '@mui/material';
import { Address, SignableMessage } from "@multiversx/sdk-core";
import { Nullable } from '@multiversx/sdk-dapp/types';
import { useRedirectSignature } from 'hooks/transactions/useRedirectSignature';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import defaultLogo from 'assets/img/no_logo.png';
import ImageIcon from '@mui/icons-material/Image';
import { CloudUpload } from '@mui/icons-material';
import { CreatedToken } from 'types/mvxTypes';
import axios from 'axios';
import { useBackendAPI } from 'hooks/useBackendAPI';
import FilterLoader from 'components/Pools/FilterLoader';
import InfoIcon from '@mui/icons-material/Info';
import { error } from 'console';
import { isEmpty } from 'lodash';
import { verifySignature } from 'utils/calculs';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const isValidErdAddress = (address: string) => {
  return address.length >= 10;
};

const isValidTokenId = (tokenId: string) => {
  return /^[a-zA-Z0-9\-]{3,20}$/.test(tokenId);
};

const validateImage = (
  file: File,
  expectedType: 'image/png' | 'image/svg+xml'
): Promise<{ valid: boolean; error?: string; preview?: string }> => {
  return new Promise((resolve) => {
    const actualMimeType = file.type;

    // Extra MIME type check
    if (actualMimeType !== expectedType) {
      if (expectedType === 'image/png') {
        resolve({ valid: false, error: `Invalid file type. Expected a PNG image!` });
        return;
      }
      if (expectedType === 'image/svg+xml') {
        resolve({ valid: false, error: `Invalid file type. Expected a SVG image!` });
        return;
      }

    }

    // Extra extension check (some browsers can mislabel MIME types)
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (expectedType === 'image/png' && fileExtension !== 'png') {
      resolve({ valid: false, error: 'Only PNG files allowed' });
      return;
    }
    if (expectedType === 'image/svg+xml' && fileExtension !== 'svg') {
      resolve({ valid: false, error: 'Only SVG files allowed' });
      return;
    }

    if (file.size > 100 * 1024) {
      resolve({ valid: false, error: 'File size exceeds 100KB' });
      return;
    }

    if (expectedType === 'image/png') {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width !== 200 || img.height !== 200) {
          resolve({ valid: false, error: 'PNG must be 200x200px' });
        } else {
          resolve({ valid: true, preview: url });
        }
      };
      img.onerror = () => resolve({ valid: false, error: 'Invalid PNG image' });
      img.src = url;
    }

    if (expectedType === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(e.target?.result as string, 'image/svg+xml');
        const svg = doc.documentElement;

        // Try width/height first
        let width = svg.getAttribute('width');
        let height = svg.getAttribute('height');

        let w = width ? parseInt(width) : null;
        let h = height ? parseInt(height) : null;

        // Fallback to viewBox if width/height not set
        if (!w || !h) {
          const viewBox = svg.getAttribute('viewBox');
          if (viewBox) {
            const parts = viewBox.split(/\s+|,/).map(Number);
            if (parts.length === 4) {
              w = parts[2];
              h = parts[3];
            }
          }
        }

        if (w !== 200 || h !== 200) {
          resolve({ valid: false, error: 'SVG must be 200x200 (via width/height or viewBox)' });
        } else {
          const url = URL.createObjectURL(file);
          resolve({ valid: true, preview: url });
        }
      };
      reader.readAsText(file);
    }
  });
};


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const TokenAssets = () => {
  const { token_id } = useParams<{ token_id: string }>();
  const location = useLocation();
  const token = location.state as { token?: CreatedToken };
  const { checkBrandingPR, createBrandingPR } = useBackendAPI();
  const { address } = useGetAccountInfo();

  const branded = localStorage.getItem("branded");
  useEffect(() => {
    if (token) {
      if (token.token?.branded) {
        localStorage.setItem("branded", "yes");
      }
    } else {
      localStorage.setItem("branded", "no");
    }
  }, [branded]);


  const isMobile = useMobile();
  const isTablet = useTablet();
  const isLoggedIn = useGetIsLoggedIn();
  const navigate = useNavigate();
  const { tokenLogin } = useGetLoginInfo();
  const [loading, setLoading] = useState(false);
  const [tab1, setTab1] = useState(true);
  const [tab2, setTab2] = useState(false);
  const [tab3, setTab3] = useState(false);
  const [prInProgress, setPRInProgress] = useState(false);
  const [commitHash, setCommitHash] = useState<string>('');
  const urlSignature = useRedirectSignature();
  const [ownershipSignature, setOwnershipSignature] = useState<string | null>(null);
  const { signMessage } = useSignMessage();
  const [prError, setPrError] = useState<string | null>(null);
  const [hasCalledPR, setHasCalledPR] = useState(false);

  // image files
  const [pngFile, setPngFile] = useState<File | null>(null);
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [pngFileName, setPngFileName] = useState<string | null>(null);
  const [svgFileName, setSvgFileName] = useState<string | null>(null);
  const [pngError, setPngError] = useState<string | null>(null);
  const [svgError, setSvgError] = useState<string | null>(null);
  const [pngPreviewUrl, setPngPreviewUrl] = useState<string | null>(null);
  const [svgPreviewUrl, setSvgPreviewUrl] = useState<string | null>(null);
  const handlePngUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await validateImage(file, 'image/png');

    if (!result.valid) {
      setPngError(result.error || 'Invalid PNG');
      setPngFile(null);
      setPngPreviewUrl(null);
      setPngFileName(null);
    } else {
      setPngFile(file);
      setPngError(null);
      setPngPreviewUrl(result.preview || null);
      setPngFileName(file.name);
    }
  };

  const handleSvgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await validateImage(file, 'image/svg+xml');

    if (!result.valid) {
      setSvgError(result.error || 'Invalid SVG');
      setSvgFile(null);
      setSvgPreviewUrl(null);
      setSvgFileName(null);
    } else {
      setSvgFile(file);
      setSvgError(null);
      setSvgPreviewUrl(result.preview || null);
      setSvgFileName(file.name);
    }
  };


  // website
  const [website, setWebsite] = useState('');
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  const handleWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = event.target.value;
    setWebsite(newInput);

    if (!newInput) {
      setWebsiteError('Required');
    } else if (!isValidUrl(newInput)) {
      setWebsiteError('Invalid website');
    } else {
      setWebsiteError('');
    }
  };

  // description
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = event.target.value;
    setDescription(newInput);

    if (!newInput) {
      setDescriptionError('Required');
    } else if (newInput.length < 20 || newInput.length > 200) {
      setDescriptionError('Must be between 20 - 200 characters long');
    } else {
      setDescriptionError('');
    }
  };

  // ledger signature
  const [ledgerSignature, setLedgerSignature] = useState('');
  const handleLedgerSignatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = event.target.value;
    setLedgerSignature(newInput);
  };

  // social links
  const [social, setSocial] = useState([{ platform: '', url: '', error: { platform: '', url: '' } }]);
  const handleSocialChange = (index: number, field: 'platform' | 'url', value: string) => {
    setSocial(prev =>
      prev.map((item, i) => {
        if (i === index) {
          const newItem = { ...item, [field]: value };
          // live validate
          const error = {
            platform: newItem.platform.trim() === '' ? 'Required' : '',
            url: isValidUrl(newItem.url) ? '' : 'Invalid URL'
          };
          return { ...newItem, error };
        }
        return item;
      })
    );
  };

  const handleAddSocial = () => {
    setSocial(prev => [...prev, { platform: '', url: '', error: { platform: '', url: '' } }]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocial(prev => prev.filter((_, i) => i !== index));
  };

  // locked accounts
  const [lockedAccounts, setLockedAccounts] = useState([{ address: '', label: '', error: { address: '', label: '' } }]);
  const handleLockedAccountChange = (
    index: number,
    field: 'address' | 'label',
    value: string
  ) => {
    setLockedAccounts(prev =>
      prev.map((item, i) => {
        if (i === index) {
          const newItem = { ...item, [field]: value };
          const error = {
            address: isValidErdAddress(newItem.address) ? '' : 'Invalid erd address',
            label:
              newItem.label.length < 3 || newItem.label.length > 25
                ? 'Must be between 3 - 25 characters long'
                : ''
          };
          return { ...newItem, error };
        }
        return item;
      })
    );
  };

  const handleAddLockedAccount = () => {
    setLockedAccounts(prev => [
      ...prev,
      { address: '', label: '', error: { address: '', label: '' } }
    ]);
  };

  const handleRemoveLockedAccount = (index: number) => {
    setLockedAccounts(prev => prev.filter((_, i) => i !== index));
  };

  // extra tokens
  const [extraTokens, setExtraTokens] = useState([{ value: '', error: '' }]);
  const handleExtraTokenChange = (index: number, value: string) => {
    setExtraTokens(prev =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            value,
            error: isValidTokenId(value) ? '' : 'Invalid token ID'
          };
        }
        return item;
      })
    );
  };

  const handleAddExtraToken = () => {
    setExtraTokens(prev => [...prev, { value: '', error: '' }]);
  };

  const handleRemoveExtraToken = (index: number) => {
    setExtraTokens(prev => prev.filter((_, i) => i !== index));
  };

  // Status 
  const [status, setStatus] = useState('active');
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = event.target.value;
    setStatus(newInput);
  };

  // generate the json info based on the current state
  const generateInfoJson = () => {
    const filteredSocial = social.length > 0 && social[0].url !== ''
      ? social.reduce((acc, { platform, url }) => {
        if (platform && url) acc[platform] = url;
        return acc;
      }, {} as Record<string, string>)
      : undefined;

    const filteredLockedAccounts = lockedAccounts.length > 0 &&
      (lockedAccounts[0].label !== '' || lockedAccounts[0].address !== '')
      ? lockedAccounts.reduce((acc, { address, label }) => {
        if (address && label) acc[address] = label;
        return acc;
      }, {} as Record<string, string>)
      : undefined;

    const filteredExtraTokens = extraTokens.filter(token => token.value.trim() !== '');

    const json = {
      website,
      description,
      ...(ledgerSignature && ledgerSignature !== '' && { ledgerSignature }),
      ...(filteredSocial && { social: filteredSocial }),
      ...(filteredLockedAccounts && { lockedAccounts: filteredLockedAccounts }),
      ...(filteredExtraTokens.length > 0 && {
        extraTokens: filteredExtraTokens.map(token => token.value)
      }),
      status: status || 'active'
    };

    return json;
  };

  // convert json to file
  const createInfoJsonFile = () => {
    const json = generateInfoJson();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    return new File([blob], 'info.json', { type: 'application/json' });
  };

  const submitBrandingBranch = async (accessToken: string) => {
    if (!accessToken) {
      console.error('Missing access token');
      return;
    }

    if (!pngFile) {
      console.error('PNG file required');
      setPrError('PNG file required');
      return;
    }

    if (!svgFile) {
      console.error('SVG file required');
      setPrError('SVG file required');
      return;
    }

    if (!website || website === '') {
      console.error('Website field required');
      setPrError('Website field required');
      return;
    }

    if (!description || description === '') {
      console.error('Description field required');
      setPrError('Description field required');
      return;
    }

    if (prInProgress) {
      console.error('Only one open pull request is allowed at a time');
      setPrError('Only one open pull request is allowed at a time');
      return;
    }

    setLoading(true); // Start loading

    try {
      const infoJsonFile = createInfoJsonFile();

      const formData = new FormData();
      formData.append('token_id', token_id || '');
      formData.append(
        'pr_name',
        token.token?.branded ? `${token_id} token branding` : `${token_id} token update`
      );
      formData.append('branch_name', token_id || 'token-branding');
      formData.append('info', infoJsonFile);

      if (pngFile) {
        formData.append('logo_png', pngFile, 'logo.png');
      }
      if (svgFile) {
        formData.append('logo_svg', svgFile, 'logo.svg');
      }

      // Append accessToken as JSON string
      formData.append('auth', JSON.stringify({ accessToken }));

      const res = await axios.post('http://localhost:3002/api/create-branding-branch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Branch created:', res.data);
      setCommitHash(res.data.latestCommitSha);
      localStorage.setItem("latestCommitSha", res.data.latestCommitSha);
      setPrError(null);
    } catch (error: any) {
      console.error('Failed to create branding branch:', error);
      setPrError(error);
    } finally {
      setLoading(false);
      setTab1(false);
      setTab2(true);
      setTab3(false);
    }
  };

  // check status of the PR
  const loadCheckData = async () => {
    if (tokenLogin?.nativeAuthToken && address) {
      const newData = await checkBrandingPR(tokenLogin?.nativeAuthToken || '');
      if (newData && newData?.prs?.length && newData.prs[0].prInProgress) {
        setPRInProgress(true);
      } else {
        setPRInProgress(false);
      }
    }
  }

  useEffect(() => {
    if (address) {
      loadCheckData();
    }
  }, [address, prInProgress]);

  // Sign the commit hash
  const signLastCommit = async () => {
    if (!commitHash) {
      console.error('No commit hash provided');
      setPrError('No commit hash provided');
      return;
    }

    try {
      const message = new SignableMessage({
        message: Buffer.from(commitHash),
      });
      const result = await signMessage(message);

      // Extract the signature property
      if (!result || !result.signature) {
        throw new Error('Invalid signature format: missing or invalid signature property');
      }

      const signature = result.getSignature();
      setOwnershipSignature(signature.toString('hex'));
      setPrError(null);
    } catch (error: any) {
      console.error('Failed to sign message:', error);
      setPrError('Failed to generate signature: ' + error.message);
    }
  };

  // create pull request function
  const createPR = async (signature: string) => {
    if (typeof signature !== 'string' || signature === '[object Promise]') {
      console.error('Invalid signature:', signature);
      return;
    }

    if (tokenLogin?.nativeAuthToken && token_id) {
      const result = await createBrandingPR(tokenLogin?.nativeAuthToken, token_id, signature, branded ? true : false);
      setPrError(result?.error ? result?.error : null);
    }
  };

  useEffect(() => {
    const handleCreatePR = async () => {
      setLoading(true);
      if (!hasCalledPR) {
        try {
          if (ownershipSignature && ownershipSignature !== '') {
            const localCommit = localStorage.getItem("latestCommitSha") || '';
            const isValid = await verifySignature(address, commitHash || localCommit, ownershipSignature);
            if (!isValid) {
              setPrError('Signature verification failed');
              return;
            }

            await createPR(ownershipSignature);
            setHasCalledPR(true);
          } else if (urlSignature && urlSignature !== '') {
            const localCommit = localStorage.getItem("latestCommitSha") || '';
            const isValid = await verifySignature(address, commitHash || localCommit, urlSignature);
            if (!isValid) {
              setPrError('Signature verification failed');
              return;
            }

            await createPR(urlSignature);
            setHasCalledPR(true);
          }
        } catch (err) {
          console.error('Failed to create PR:', err);
        } finally {
          setLoading(false);
          setTab1(false);
          setTab2(false);
          setTab3(true);
          localStorage.removeItem("latestCommitSha");
        }
      }
    };

    if (address && (ownershipSignature || urlSignature)) {
      handleCreatePR();
    }
  }, [ownershipSignature, urlSignature, address]);

  // add existing token fields if it already has a previous branding change
  useEffect(() => {
    const loadTokenAssets = async () => {
      if (!token?.token?.assets) return;

      const assets = token.token.assets;

      // 1. Basic fields
      setWebsite(assets.website || '');
      setDescription(assets.description || '');
      setLedgerSignature(assets.ledgerSignature || '');
      setStatus(assets.status || 'active');

      // 2. Social (convert object to array with error placeholders)
      if (assets.social && typeof assets.social === 'object') {
        const socialArr = Object.entries(assets.social).map(([platform, url]) => ({
          platform,
          url,
          error: { platform: '', url: '' }
        }));
        setSocial(socialArr.length ? socialArr : [{ platform: '', url: '', error: { platform: '', url: '' } }]);
      }

      // 3. Locked accounts (convert object to array with error placeholders)
      if (assets.lockedAccounts && typeof assets.lockedAccounts === 'object') {
        const lockedArr = Object.entries(assets.lockedAccounts).map(([address, label]) => ({
          address,
          label,
          error: { address: '', label: '' }
        }));
        setLockedAccounts(lockedArr.length ? lockedArr : [{ address: '', label: '', error: { address: '', label: '' } }]);
      }

      // 4. Extra tokens
      if (Array.isArray(assets.extraTokens)) {
        const extra = assets.extraTokens.map((value) => ({
          value,
          error: ''
        }));
        setExtraTokens(extra.length ? extra : [{ value: '', error: '' }]);
      } else {
        setExtraTokens([{ value: '', error: '' }]);
      }

      // 5. PNG and SVG preview + file (fetch and set as File objects)
      if (assets.pngUrl) {
        try {
          const response = await fetch(assets.pngUrl);
          const blob = await response.blob();
          const file = new File([blob], 'logo.png', { type: blob.type });
          setPngFile(file);
          setPngFileName(file.name);
          setPngPreviewUrl(URL.createObjectURL(blob));
        } catch (err) {
          console.warn('Failed to load PNG from URL:', err);
        }
      }

      if (assets.svgUrl) {
        try {
          const response = await fetch(assets.svgUrl);
          const blob = await response.blob();
          const file = new File([blob], 'logo.svg', { type: blob.type });
          setSvgFile(file);
          setSvgFileName(file.name);
          setSvgPreviewUrl(URL.createObjectURL(blob));
        } catch (err) {
          console.warn('Failed to load SVG from URL:', err);
        }
      }
    };

    loadTokenAssets();
  }, [token]);



  return (
    <div className="tools-page-height">
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ minHeight: '60px' }}>
            <div className={`p-3 mb-2  ${isMobile ? 'mt-2' : 'mt-4'}`}>
              <h2 className='text-white text-center'>Branding for {token_id}</h2>
            </div>
          </div>
        </Col>
      </Row>
      {isMobile && (
        <ScrollToTopButton targetRefId='topSection' />
      )}

      {loading ? (
        <Row className='mt-1 mb-5'>
          <Col xs={12} lg={{ offset: 3, span: 6 }} className='mt-2'>
            <FilterLoader />
          </Col>
        </Row>
      ) : (
        <Fragment>
          {tab1 && (
            <Row className='mt-1 mb-5'>
              <Col xs={12} lg={{ offset: 3, span: 6 }} className='mt-2'>
                <div className='create-token-container p-4'>
                  {/* PNG, SVG Files */}
                  {prError && (
                    <div className={`p-3 b-r-sm text-silver ${isMobile ? '' : 'd-flex'} mb-2`} style={{ backgroundColor: 'rgba(10,10,10,0.7)' }}>
                      <InfoIcon fontSize='small' color='error' className='m-t-n-xxs' />
                      <p className='font-size-xs text-justified mb-0 mt-0 ms-2 d-inline'>{prError}</p>
                    </div>
                  )}
                  <Row>
                    <Col xs={12} lg={6} className='d-flex align-items-center justify-content-center'>
                      <div>
                        <p className='small ms-1 mt-4 mb-1 text-silver required'>PNG Logo</p>
                        {pngPreviewUrl ? (
                          <img src={pngPreviewUrl} alt="PNG preview" className="mt-2 rounded border-1 border-dashed border-[grey]" width={132} />
                        ) : (
                          <div className="mt-2 d-flex align-items-center justify-content-center rounded border-1 border-dashed border-[grey]" style={{ minHeight: '100px', width: '132px' }}>
                            <ImageIcon style={{ fontSize: '35px', color: 'white' }} />
                          </div>
                        )}
                        {pngError && <p className="text-danger font-size-sm mt-1 mb-0">* {pngError}</p>}

                        <Button
                          component="label"
                          role={undefined}
                          tabIndex={-1}
                          startIcon={<CloudUpload />}
                          className='hover-btn btn-intense-default btn-intense-info smaller b-r-xs mt-2'
                          size='small'
                        >

                          {pngPreviewUrl ? 'Change file' : 'Select file'}
                          <VisuallyHiddenInput
                            type="file"
                            onChange={handlePngUpload}
                            accept='image/png'
                          />
                        </Button>
                        {pngFileName && (
                          <p className='text-silver mb-0 mt-1 font-size-sm'>Selected: {pngFileName}</p>
                        )}
                      </div>
                    </Col>
                    <Col xs={12} lg={6} className='d-flex align-items-center justify-content-center'>
                      <div>
                        <p className='small ms-1 mt-4 mb-1 text-silver required'>SVG Logo</p>
                        {svgPreviewUrl ? (
                          <img src={svgPreviewUrl} alt="PNG preview" className="mt-2 rounded border-1 border-dashed border-[grey]" width={132} />
                        ) : (
                          <div className="mt-2 d-flex align-items-center justify-content-center rounded border-1 border-dashed border-[grey]" style={{ minHeight: '100px', width: '132px' }}>
                            <ImageIcon style={{ fontSize: '35px', color: 'white' }} />
                          </div>
                        )}
                        {svgError && <p className="text-danger font-size-sm mt-1 mb-0">* {svgError}</p>}

                        <Button
                          component="label"
                          role={undefined}
                          tabIndex={-1}
                          startIcon={<CloudUpload />}
                          className='hover-btn btn-intense-default btn-intense-info smaller b-r-xs mt-2'
                          size='small'
                        >

                          {svgPreviewUrl ? 'Change file' : 'Select file'}
                          <VisuallyHiddenInput
                            type="file"
                            onChange={handleSvgUpload}
                            accept='image/svg+xml'
                          />
                        </Button>
                        {svgFileName && (
                          <p className='text-silver mb-0 mt-1 font-size-sm'>Selected: {svgFileName}</p>
                        )}
                      </div>
                    </Col>
                  </Row>

                  {/* Website */}
                  <div>
                    <p className='small ms-1 mt-4 mb-1 text-silver required'>Website</p>
                    <TextField
                      type='text'
                      fullWidth
                      size='small'
                      variant='outlined'
                      value={website}
                      autoComplete="off"
                      onChange={handleWebsiteChange}
                      error={!!websiteError}
                      helperText={
                        websiteError ? (
                          <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                            {websiteError}
                          </span>
                        ) : null
                      }
                      className='mt-1'
                      InputProps={{
                        style: { color: 'silver', fontFamily: 'Red Rose' },
                      }}
                      InputLabelProps={{
                        style: { color: 'silver', fontFamily: 'Red Rose' },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'transparent',
                            background: 'rgba(18, 18, 18, 0.3)',
                            borderRadius: '5px',
                            color: 'silver',
                            fontSize: '14px',
                          },
                          '&:hover fieldset': {
                            borderColor: websiteError ? '#d32f2f' : '#3FAC5A',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: websiteError ? '#d32f2f' : '#3FAC5A',
                          },
                          fontFamily: 'Red Rose',
                          fontSize: '14px',
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                          WebkitAppearance: 'none',
                          appearance: 'none',
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <p className='small mt-4 ms-1 mb-1 text-silver required'>Description</p>
                    <TextField
                      type='text'
                      fullWidth
                      minRows={3}
                      multiline
                      size='small'
                      variant='outlined'
                      value={description}
                      autoComplete="off"
                      onChange={handleDescriptionChange}
                      error={!!descriptionError}
                      helperText={
                        descriptionError ? (
                          <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                            {descriptionError}
                          </span>
                        ) : null
                      }
                      className='mt-1'
                      InputProps={{
                        style: { color: 'silver', fontFamily: 'Red Rose' },
                      }}
                      InputLabelProps={{
                        style: { color: 'silver', fontFamily: 'Red Rose' },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'transparent',
                            background: 'rgba(18, 18, 18, 0.3)',
                            borderRadius: '5px',
                            color: 'silver',
                            fontSize: '14px',
                          },
                          '&:hover fieldset': {
                            borderColor: descriptionError ? '#d32f2f' : '#3FAC5A',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: descriptionError ? '#d32f2f' : '#3FAC5A',
                          },
                          fontFamily: 'Red Rose',
                          fontSize: '14px',
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                          WebkitAppearance: 'none',
                          appearance: 'none',
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                      }}
                    />
                  </div>

                  {/* Ledger Signature */}
                  <div>
                    <p className='mt-4 small ms-1 mb-1 text-silver required'>Ledger Signature</p>
                    <TextField
                      type='text'
                      fullWidth
                      size='small'
                      variant='outlined'
                      value={ledgerSignature}
                      autoComplete="off"
                      onChange={handleLedgerSignatureChange}
                      className='mt-1'
                      InputProps={{
                        style: { color: 'silver', fontFamily: 'Red Rose' },
                      }}
                      InputLabelProps={{
                        style: { color: 'silver', fontFamily: 'Red Rose' },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'transparent',
                            background: 'rgba(18, 18, 18, 0.3)',
                            borderRadius: '5px',
                            color: 'silver',
                            fontSize: '14px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3FAC5A',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3FAC5A',
                          },
                          fontFamily: 'Red Rose',
                          fontSize: '14px',
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                          WebkitAppearance: 'none',
                          appearance: 'none',
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                      }}
                    />
                  </div>

                  {/* Social links */}
                  <div>
                    <div className='d-flex justify-content-between align-items-center mt-4 mb-1'>
                      <p className='small ms-1 mb-0 text-silver required'>Social</p>
                      <Button
                        className={`font-bold font-size-xxs b-r-xs hover-btn text-white`}
                        onClick={handleAddSocial}
                        variant='text'
                        size='small'
                        sx={{ height: '25px' }}
                      >
                        + Add social
                      </Button>
                    </div>

                    {social.map((entry, index) => (
                      <div key={index} className="flex gap-2 items-start mb-2">
                        <TextField
                          type='text'
                          placeholder="Platform (e.g. Telegram)"
                          size="small"
                          variant="outlined"
                          value={entry.platform}
                          autoComplete="off"
                          onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                          error={!!entry.error.platform}
                          helperText={
                            entry.error.platform ? (
                              <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                                {entry.error.platform}
                              </span>
                            ) : null
                          }
                          className="flex-1"
                          InputProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          InputLabelProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'transparent',
                                background: 'rgba(18, 18, 18, 0.3)',
                                borderRadius: '5px',
                                color: 'silver',
                                fontSize: '14px',
                              },
                              '&:hover fieldset': {
                                borderColor: entry.error.platform ? '#d32f2f' : '#3FAC5A',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: entry.error.platform ? '#d32f2f' : '#3FAC5A',
                              },
                              fontFamily: 'Red Rose',
                              fontSize: '14px',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield',
                              WebkitAppearance: 'none',
                              appearance: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                          }}
                        />

                        <TextField
                          type='url'
                          placeholder="URL"
                          size="small"
                          variant="outlined"
                          value={entry.url}
                          onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                          autoComplete="off"
                          error={!!entry.error.url}
                          helperText={
                            entry.error.url ? (
                              <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                                {entry.error.url}
                              </span>
                            ) : null
                          }
                          className="flex-1"
                          InputProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          InputLabelProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'transparent',
                                background: 'rgba(18, 18, 18, 0.3)',
                                borderRadius: '5px',
                                color: 'silver',
                                fontSize: '14px',
                              },
                              '&:hover fieldset': {
                                borderColor: entry.error.url ? '#d32f2f' : '#3FAC5A',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: entry.error.url ? '#d32f2f' : '#3FAC5A',
                              },
                              fontFamily: 'Red Rose',
                              fontSize: '14px',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield',
                              WebkitAppearance: 'none',
                              appearance: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                          }}
                        />

                        <IconButton
                          className={`font-bold font-size-xxs b-r-xs`}
                          onClick={() => handleRemoveSocial(index)}
                          size='small'
                          color='error'
                        >
                          <IndeterminateCheckBoxIcon style={{ fontSize: '30px' }} />
                        </IconButton>
                      </div>
                    ))}
                  </div>

                  {/* Locked accounts */}
                  <div>
                    <div className='d-flex justify-content-between align-items-center mt-4 mb-1'>
                      <p className='small ms-1 mb-0 text-silver required'>Locked Accounts</p>
                      <Button
                        className={` font-bold font-size-xxs b-r-xs hover-btn text-white`}
                        onClick={handleAddLockedAccount}
                        variant='text'
                        size='small'
                        sx={{ height: '25px' }}
                      >
                        + Add Account
                      </Button>
                    </div>

                    {lockedAccounts.map((entry, index) => (
                      <div key={index} className="flex gap-2 items-start mb-2">
                        <TextField
                          type='text'
                          placeholder="Account address"
                          size="small"
                          variant="outlined"
                          value={entry.address}
                          autoComplete="off"
                          onChange={(e) => handleLockedAccountChange(index, 'address', e.target.value)}
                          error={!!entry.error.address}
                          helperText={
                            entry.error.address ? (
                              <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                                {entry.error.address}
                              </span>
                            ) : null
                          }
                          className="flex-1"
                          InputProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          InputLabelProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'transparent',
                                background: 'rgba(18, 18, 18, 0.3)',
                                borderRadius: '5px',
                                color: 'silver',
                                fontSize: '14px',
                              },
                              '&:hover fieldset': {
                                borderColor: entry.error.address ? '#d32f2f' : '#3FAC5A',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: entry.error.address ? '#d32f2f' : '#3FAC5A',
                              },
                              fontFamily: 'Red Rose',
                              fontSize: '14px',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield',
                              WebkitAppearance: 'none',
                              appearance: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                          }}
                        />

                        <TextField
                          type='text'
                          placeholder="Label"
                          size="small"
                          variant="outlined"
                          value={entry.label}
                          onChange={(e) => handleLockedAccountChange(index, 'label', e.target.value)}
                          autoComplete="off"
                          error={!!entry.error.label}
                          helperText={
                            entry.error.label ? (
                              <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                                {entry.error.label}
                              </span>
                            ) : null
                          }
                          className="flex-1"
                          InputProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          InputLabelProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'transparent',
                                background: 'rgba(18, 18, 18, 0.3)',
                                borderRadius: '5px',
                                color: 'silver',
                                fontSize: '14px',
                              },
                              '&:hover fieldset': {
                                borderColor: entry.error.label ? '#d32f2f' : '#3FAC5A',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: entry.error.label ? '#d32f2f' : '#3FAC5A',
                              },
                              fontFamily: 'Red Rose',
                              fontSize: '14px',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield',
                              WebkitAppearance: 'none',
                              appearance: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                          }}
                        />

                        <IconButton
                          className={`font-bold font-size-xxs b-r-xs`}
                          onClick={() => handleRemoveLockedAccount(index)}
                          size='small'
                          color='error'
                        >
                          <IndeterminateCheckBoxIcon style={{ fontSize: '30px' }} />
                        </IconButton>
                      </div>
                    ))}
                  </div>

                  {/* Extra tokens */}
                  <div>
                    <div className='d-flex justify-content-between align-items-center mt-4 mb-1'>
                      <p className='small ms-1 mb-0 text-silver required'>Extra Tokens</p>
                      <Button
                        className={` font-bold font-size-xxs b-r-xs hover-btn text-white`}
                        onClick={handleAddExtraToken}
                        variant='text'
                        size='small'
                        sx={{ height: '25px' }}
                      >
                        + Add Token
                      </Button>
                    </div>

                    {extraTokens.map((token, index) => (
                      <div key={index} className="flex gap-2 items-start mb-2">
                        <TextField
                          type='text'
                          placeholder="e.g. TOKEN-1234"
                          size="small"
                          variant="outlined"
                          value={token.value}
                          autoComplete="off"
                          onChange={(e) => handleExtraTokenChange(index, e.target.value)}
                          error={!!token.error}
                          helperText={
                            token.error ? (
                              <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                                {token.error}
                              </span>
                            ) : null
                          }
                          className="flex-1"
                          InputProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          InputLabelProps={{
                            style: { color: 'silver', fontFamily: 'Red Rose' },
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'transparent',
                                background: 'rgba(18, 18, 18, 0.3)',
                                borderRadius: '5px',
                                color: 'silver',
                                fontSize: '14px',
                              },
                              '&:hover fieldset': {
                                borderColor: token.error ? '#d32f2f' : '#3FAC5A',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: token.error ? '#d32f2f' : '#3FAC5A',
                              },
                              fontFamily: 'Red Rose',
                              fontSize: '14px',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield',
                              WebkitAppearance: 'none',
                              appearance: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                          }}
                        />

                        <IconButton
                          className={`font-bold font-size-xxs b-r-xs`}
                          onClick={() => handleRemoveExtraToken(index)}
                          size='small'
                          color='error'
                        >
                          <IndeterminateCheckBoxIcon style={{ fontSize: '30px' }} />
                        </IconButton>
                      </div>
                    ))}
                  </div>

                  {/* Status */}
                  <div>
                    <p className='mt-4 mb-1 small ms-1 text-silver required'>Status</p>
                    <TextField
                      type='select'
                      select
                      fullWidth
                      size='small'
                      variant='outlined'
                      value={status}
                      autoComplete="off"
                      onChange={handleStatusChange}
                      className='mt-1 mb-5'
                      InputProps={{
                        style: { color: 'silver', fontFamily: 'Red Rose' },
                      }}
                      InputLabelProps={{
                        style: { color: 'silver', fontFamily: 'Red Rose' },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'transparent',
                            background: 'rgba(18, 18, 18, 0.3)',
                            borderRadius: '5px',
                            color: 'silver',
                            fontSize: '14px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3FAC5A',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3FAC5A',
                          },
                          fontFamily: 'Red Rose',
                          fontSize: '14px',
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                          WebkitAppearance: 'none',
                          appearance: 'none',
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& .MuiSelect-icon': {
                          color: 'white'
                        }
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              backgroundColor: 'rgba(32, 32, 32, 1)',
                              color: 'white',
                              fontFamily: 'Red Rose'
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value={'active'} className={`font-rose select-menu-item font-size-sm ${status === 'active' ? 'active' : ''}`}>
                        Active
                      </MenuItem>
                      <MenuItem value={'inactive'} className={`font-rose select-menu-item font-size-sm ${status === 'inactive' ? 'active' : ''}`}>
                        Inactive
                      </MenuItem>
                    </TextField>
                  </div>

                  {/* Submit Button */}
                  <Button
                    className={`btn-intense-default b-r-xs hover-btn btn-intense-success2 fullWidth ${(prInProgress || !address) ? 'btn-disabled' : ''}`}
                    sx={{ height: '30px' }}
                    onClick={() => submitBrandingBranch(tokenLogin?.nativeAuthToken || '')}
                    disabled={prInProgress}
                  >
                    Submit Files
                  </Button>
                </div>
              </Col>
            </Row>
          )}

          {tab2 && (
            <Row className='mt-1 mb-5'>
              <Col xs={12} lg={{ offset: 3, span: 6 }} className='mt-2'>
                <div className='create-token-container p-4'>
                  <div className={`p-3 b-r-sm text-silver ${isMobile ? '' : 'd-flex'} mb-2`} style={{ backgroundColor: 'rgba(10,10,10,0.7)' }}>
                    <InfoIcon fontSize='small' color={`${prError ? 'error' : 'info'}`} className='m-t-n-xxs' />
                    <p className='font-size-xs text-justified mb-0 mt-0 ms-2 d-inline'>{prError ? prError : 'Branding files successfully submited!'}</p>
                  </div>
                  <p className='mb-0 text-white text-justified mt-3 mx-1 font-size-sm'>To complete your branding token request, you must sign the verification message below.</p>

                  <Button
                    className={`btn-intense-default mt-2 b-r-xs hover-btn btn-intense-success2 fullWidth ${(prInProgress || !address) ? 'btn-disabled' : ''}`}
                    sx={{ height: '30px' }}
                    onClick={() => signLastCommit()}
                    disabled={prInProgress}
                  >
                    Sign verification
                  </Button>
                </div>
              </Col>
            </Row>
          )}

          {tab3 && (
            <Row className='mt-1 mb-5'>
              <Col xs={12} lg={{ offset: 3, span: 6 }} className='mt-2'>
                <div className='create-token-container p-4'>
                  <div className={`p-3 b-r-sm text-silver ${isMobile ? '' : 'd-flex'} mb-2`} style={{ backgroundColor: 'rgba(10,10,10,0.7)' }}>
                    <InfoIcon fontSize='small' color={`${prError ? 'error' : 'info'}`} className='m-t-n-xxs' />
                    <p className='font-size-xs text-justified mb-0 mt-0 ms-2 d-inline'>{prError ? prError : 'Branding token request successfully completed!'}</p>
                  </div>
                  <p className='mb-0 text-white text-justified mt-3 mx-1 font-size-sm'>Once the multiversx team accepts your request, your token details will be updated. During the process, you will see a notification box on the tools page, in the token branding section. </p>
                </div>
              </Col>
            </Row>
          )}
        </Fragment>
      )}

      {/* Add light spots */}
      <LightSpot size={isMobile ? 220 : 350} x={isMobile ? '25%' : '40%'} y="40%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </div>
  );
}

export default TokenAssets;
