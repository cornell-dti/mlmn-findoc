export const areCredentialsValid = (credentials: { [x: string]: unknown; expiry: string | number | Date; }) => {
    const requiredFields = ['refresh_token', 'client_id', 'client_secret'];
    const hasAllRequiredFields = requiredFields.every(field => credentials[field]);

    if (!hasAllRequiredFields) {
        return false;
    }

    if (credentials.expiry) {
        const now = new Date();
        const expiryDate = new Date(credentials.expiry);
        return expiryDate > now;
    }

    return true;
}
