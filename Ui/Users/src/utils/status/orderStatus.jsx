import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelIcon from '@mui/icons-material/Cancel';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import UpdateDisabledIcon from '@mui/icons-material/UpdateDisabled';


export const getShopStatusInfo = (status) => {
    let id, statusText, statusColor, StatusIcon;

    switch (status) {
        case 1:
            id = 1;
            statusText = "Order placed";
            statusColor = "Orange";
            StatusIcon = <DoneIcon />;

            break;
        case 2:
            id = 2;
            statusText = "Pending";
            statusColor = "Blue";
            StatusIcon = <AutorenewIcon />
            break;
        case 3:
            id = 3;
            statusText = "Accepted";
            statusColor = "Green";
            StatusIcon = <DoneAllIcon />
            break;
        case 4:
            id = 4;
            statusText = "Finished";
            statusColor = "Purple";
            StatusIcon = <CheckCircleIcon />
            break;
        case 5:
            id = 5;
            statusText = "Canceled";
            statusColor = "Red";
            StatusIcon = <CancelIcon />
            break;
        case 6:
            id = 6;
            statusText = "Expired";
            statusColor = "#B00020";
            StatusIcon = <UpdateDisabledIcon />
            break;

        default:
            id = 0;
            statusText = "Unknown";
            statusColor = "black";
            StatusIcon = <QuestionMarkIcon />
    }

    return { id, statusText, statusColor, StatusIcon };
};