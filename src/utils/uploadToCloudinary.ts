import { UploadApiResponse,v2 as cloudinary } from 'cloudinary';


export const uploadToCloudinary = (
  file: string,
  options: {},
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

export type CloudinaryResponse = UploadApiResponse;

export const cloudinaryDefaultUploadOptions = {
  resource_type: 'auto',
  folder: 'phone_catalog',
  eager: [
    {
      width: 200,
      height: 300,
    },
  ],
};

export type CloudinaryEagerOption = {
  width: number;
  height: number;
};
export const cloudinaryCustomOptionGenerater = (sizes: CloudinaryEagerOption[]) => ({
  ...cloudinaryDefaultUploadOptions,
  eager: [
    ...cloudinaryDefaultUploadOptions.eager,
    ...sizes.map(size => ({
      width: size.width,
      height: size.height,
    })),
  ],
});



