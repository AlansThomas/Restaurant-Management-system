import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Button, Typography } from '@mui/material';


export default function Page404() {

    return (
        <>
            <Helmet>
                <title> 404 Page Not Found </title>
            </Helmet>

            <div>
                <div className="max-w-480 mx-auto min-h-screen flex justify-center flex-col py-24" style={{ textAlign: "center", alignItems: "center" }}>
                    <Typography variant="h3" paragraph>
                    Sorry, page not found!
                </Typography>

                <Typography sx={{ color: "text.secondary" }}>
                    Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
                    mistyped the URL? Be sure to check your spelling.
                </Typography>

                <img
                    src="/assets/404.gif"
                    className="h-260 mx-auto my-5 xs:my-10 sm:my-10"
                    alt="404 Not Found Illustration"
                />
                <Link to="dashboard/home">
                    <Button size="large" variant="contained" > Go to Home </Button>
                </Link>
            </div>
        </div>
        </>
    );
}
