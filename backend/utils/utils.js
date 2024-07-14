const fs = require("fs");
const path = require("path");

const validateRequest = (requestBody, requiredFields) => {
    const missingFields = requiredFields.filter(field => !requestBody[field]);
    if (missingFields.length > 0) {
        return {
            success: false,
            message: `The following required fields are missing: ${missingFields.join(", ")}`,
            result: "",
        };
    }
    return null;
}

const saveBase64File = (base64Data, filePath) => {
    const base64String = base64Data.split(';base64').pop();
    fs.writeFileSync(filePath, base64String, {encoding: 'base64'})
}

const saveFile = async (file) => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // If file is an object containing the base64 string, extract the string
        const fileData = typeof file === 'string' ? file : file.file;

        // Extract MIME type
        const mimeType = fileData.substring("data:".length, fileData.indexOf(";base64"));
        const fileExtension = mimeType.split('/')[1];

        // Generate file name from timestamp
        const fileName = `${Date.now()}.${fileExtension}`;

        let filePath;
        if (mimeType === 'application/pdf') {
            const documentPath = "uploads/documents";
            if (!fs.existsSync(documentPath)) {
                fs.mkdirSync(documentPath, { recursive: true });
            }
            filePath = path.join(documentPath, fileName);
        } else if (mimeType === 'image/png' || mimeType === 'image/jpeg') {
            const iconPath = "uploads/images";
            if (!fs.existsSync(iconPath)) {
                fs.mkdirSync(iconPath, { recursive: true });
            }
            filePath = path.join(iconPath, fileName);
        } else {
            throw new Error('Unsupported file type');
        }

        // Save the file
        saveBase64File(fileData, filePath);

        return filePath;
    } catch (error) {
        console.error('Error saving file:', error);
        throw error;
    }
};

module.exports = {validateRequest, saveBase64File, saveFile};
