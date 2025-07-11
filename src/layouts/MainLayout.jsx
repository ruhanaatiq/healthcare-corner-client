import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/shared/Navbar/Navbar';
import Footer from '../pages/shared/Footer/Footer';
import CartPage from '../pages/Cart/CartPage';
import { CartProvider } from '../contexts/CartContext';

const MainLayout = () => {
    return (
        <div>
            <CartProvider>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
</CartProvider>
        </div>
    );
};

export default MainLayout;