import { Typography } from '@mui/material';


export default function ErrorPage() {
    return (


        <div>
            <div className="max-w-480 mx-auto min-h-screen flex justify-center flex-col py-24" style={{ textAlign: "center", alignItems: "center" }}>
                <Typography variant="h3" paragraph>
                    Sorry, page not found!
                </Typography>

                <Typography sx={{ color: "text.secondary" }}>
                    Oops something went wrong
                </Typography>

                <img
                    src="/assets/404.gif"
                    className="h-260 mx-auto my-5 xs:my-10 sm:my-10"
                    alt="404 Not Found Illustration"
                />
            </div>
        </div>

    )
}

