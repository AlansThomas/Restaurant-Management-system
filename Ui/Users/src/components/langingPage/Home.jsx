import { Outlet } from 'react-router-dom';

import Nav from '../navbar/Nav'



export default function Home() {
    return (
        <>
            <Nav />
            <Outlet />
        </>
    )
}
