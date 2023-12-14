export const getTabelStatusInfo = (status) => {
    let statusColor;

    switch (status) {

        case 0:
            statusColor = "#1f6720";     // green shade
            break;

        case 1:
            statusColor = "#1f6720";    // green shade
            break;

        case 2:
            statusColor = "#9E9E9E";    // gray shade
            break;
        
        case 3:
            statusColor = "#2196F3";   // blue shade
            break;

        case 4:
            statusColor = "#af413a";   // red shade
            break;

        default:
            statusColor = "black";
    }

    return { statusColor };
};


