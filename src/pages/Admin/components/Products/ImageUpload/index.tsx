import React, { useState } from 'react';
import { ReactComponent as UploadPlaceholder } from 'core/assets/images/upload-placeholder.svg';
import { makePrivateRequest } from 'core/utils/request';
import './styles.scss';
import { toast } from 'react-toastify';

type Props ={
  onUploadSuccess: (imgUrl: string) => void;
  productImgUrl: string;
}

const ImageUpload = ({ onUploadSuccess, productImgUrl }: Props) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImgUrl, setUploadedImgUrl] = useState('');
  const imgUrl = uploadedImgUrl || productImgUrl;

  const onUploadProgress = (progressEvent: ProgressEvent) => {
    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setUploadProgress(progress);
  }

  const uploadImage = (selectedImage: File) => {
    const payload = new FormData();
    payload.append('file', selectedImage);

    makePrivateRequest({
      url: '/products/image',
      method: 'POST',
      data: payload,
      onUploadProgress
    })
    .then(response => {
      toast.success('Imagem enviada com sucesso');
      setUploadedImgUrl(response.data.uri);
      onUploadSuccess(response.data.uri);
    })
    .catch((error) => {
      toast.error(error.response.status + ' - Erro ao enviar imagem');
    })
    .finally(() => setUploadProgress(0))
  }

  const handleChage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0];
    if(selectedImage) {
      uploadImage(selectedImage);
    }
  }

  return (
    <div className="row">
      <div className="col-6">
        <div className="upload-button-container">
          <input 
            type="file" 
            id="upload" 
            hidden 
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleChage} />
          <label htmlFor="upload">ADICIONAR IMAGEM</label>
        </div>
        <small className="upload-text-helper text-primary">
          As imagens devem ser JPG ou PNG e não devem ultrapassar <strong>5mb.</strong> 
        </small>
      </div>
      <div className="col-6 upload-placeholder">
        {uploadProgress > 0 && (
          <>
            <UploadPlaceholder />
            <div className="upload-progress-container">
              <div className="upload-progress" style={{ width: `${uploadProgress}%`}}>
              
              </div>
            </div>
          </>
        )}
        {(imgUrl && uploadProgress === 0) && (
          <img src={imgUrl} alt={imgUrl} className="uploaded-image" />
        )}
      </div>
    </div>
  );
}

export default ImageUpload;