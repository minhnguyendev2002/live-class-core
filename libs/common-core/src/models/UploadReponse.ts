export interface UploadResponse  {
	data: UploadResponseData;
}
export interface UploadResponseDataUrl  {
	store: string;
	src: string;
}
export interface UploadResponseData {
	id: string;
	link: string;
	url: UploadResponseDataUrl;
	size: string;
	file_type: string;
	category: string;
}