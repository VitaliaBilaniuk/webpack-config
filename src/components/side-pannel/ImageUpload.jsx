import React from 'react';
import { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import './sidePannel.scss';


class ImageUpload extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      src: null,
      crop: {
        aspect: 1,
        width: 50,
        x: 0,
        y: 0,
      },
      showElements: false,
    };

   
  }
    onSelectFile = e => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () =>
          this.setState({ src: reader.result }),
        );
        reader.readAsDataURL(e.target.files[0]);
      }
      this.setState({ showElements: true });
    };
  
    onImageLoaded = (image, pixelCrop) => {
      this.imageRef = image;
    };
  
    onCropComplete = (crop, pixelCrop) => {
      this.makeClientCrop(crop, pixelCrop);
    };
  
    onCropChange = crop => {
      this.setState({ crop });
    };

    handleCropSave = () => {
      this.setState({ showElements: false });
    }
  
    async makeClientCrop(crop, pixelCrop) {
      if (this.imageRef && crop.width && crop.height) {
        const croppedImageUrl = await this.getCroppedImg(
          this.imageRef,
          pixelCrop,
          'newFile.jpeg',
        );
        this.setState({ croppedImageUrl });
      }
    }
  
    getCroppedImg(image, pixelCrop, fileName) {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
  
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );
  
      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error('Canvas is empty');
            return;
          }
          blob.name = fileName;
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(blob);
          resolve(this.fileUrl);
        }, 'image/jpeg');
      });
    }
  
    
    render() {
      const { crop, croppedImageUrl, src } = this.state;
      return (
        <div>
          <div>
            <input type="file" onChange={this.onSelectFile} />
          </div>
          { this.state.showElements ? 
            <div>
              <div className="sfs-overlay"></div>
              <div className="sfs-crop"> 
                <h3>Crop photo</h3>
                {src && (
                  <ReactCrop
                    src={src}
                    crop={crop}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                  />
                )}
                <button onClick={this.handleCropSave} >Crop photo</button>
              </div>
            </div>
          : null }        
          {croppedImageUrl && (
            <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
          )}
        </div>
      );
    }
  }
  
export default ImageUpload;