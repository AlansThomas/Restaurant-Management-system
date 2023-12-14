 /* eslint-disable react-refresh/only-export-components */

export const FormatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

export const currentDate = new Date().toISOString().slice(0, 10);
export const currentHour = new Date().getHours();