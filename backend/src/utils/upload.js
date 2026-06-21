const multer     = require('multer');
const cloudinary = require('../config/cloudinary');

// Multer guarda en memoria (buffer), no en disco
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
  fileFilter: (_req, file, cb) => {
    const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (permitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// Sube el buffer a Cloudinary y devuelve { url, public_id }
const subirACloudinary = (fileBuffer, folder = 'consorcio365', mimetype = '', originalName = '') => {
  return new Promise((resolve, reject) => {
	const esPdf = mimetype === 'application/pdf';
	const resource_type = esPdf ? 'raw' : 'auto';

	// Para PDFs
	const options = {
  	folder,
  	resource_type
	};

	if (esPdf) {
  	const base = (originalName || `archivo-${Date.now()}`)
    	.replace(/\.[^/.]+$/, '')    	
    	.replace(/[^a-zA-Z0-9-_]/g, '_'); 
  	options.public_id = `${base}-${Date.now()}.pdf`;
	}

	const stream = cloudinary.uploader.upload_stream(
  	options,
  	(error, result) => {
    	if (error) reject(error);
    	else resolve({ url: result.secure_url, public_id: result.public_id });
  	}
	);
	stream.end(fileBuffer);
  });
};

module.exports = { upload, subirACloudinary };
