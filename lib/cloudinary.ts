import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;


export async function uploadImage(imagePath: string) {
    let uploadedThumbnail = '';
    if (imagePath) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(imagePath, {
                folder: 'news-thumbnails',
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            });
            uploadedThumbnail = uploadResponse.secure_url;
        } catch (error) {
            console.error('Error uploading thumbnail to Cloudinary:', error);
        }
    }
    return uploadedThumbnail;
}