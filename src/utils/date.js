export const formatDate = (dateString, long = false) => {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) return dateString; // Return original string if parse failed (maybe it's already formatted)

        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: long ? 'long' : 'short', 
            year: 'numeric' 
        });
    } catch (e) {
        return '-';
    }
};
